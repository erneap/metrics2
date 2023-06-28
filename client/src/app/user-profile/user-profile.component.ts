import { HttpClient, HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MustMatchValidator } from '../must-match-validator.directive';
import { PasswordStrengthValidator } from '../password-strength-validator.directive';
import { AuthService } from '../services/auth.service';
import { transformErrorString } from '../models/common';
import { AuthenticationResponse, UpdateRequest } from '../models/web';
import { DialogService } from '../services/dialog-service.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent {
  profileForm: FormGroup;
  formError: string = '';

  constructor(
    protected authService: AuthService,
    protected dialogService: DialogService,
    private httpClient: HttpClient,
    private fb: FormBuilder
  ) {
    const user = this.authService.getUser();
    this.profileForm = fb.group({
      email: [user?.emailAddress, [Validators.required, Validators.email]],
      first: [user?.firstName, [Validators.required]],
      middle: user?.middleName,
      last: [user?.lastName, [Validators.required]],
      password: ['', [new PasswordStrengthValidator()]],
      password2: ['', [new MustMatchValidator()]],
    });
  }

  getPasswordError(): string {
    let answer: string = ''
    if (this.profileForm.get('password')?.hasError('required')) {
      answer = "Password is Required";
    }
    if (this.profileForm.get('password')?.hasError('passwordStrength')) {
      if (answer !== '') {
        answer += ', ';
      }
      answer += "Password doesn't meet minimum requirements";
    }
    return answer;
  }

  getVerifyError(): string {
    let answer: string = ''
    if (this.profileForm.get('password2')?.hasError('required')) {
      answer = "Password is Required";
    }
    if (this.profileForm.get('password2')?.hasError('matching')) {
      if (answer !== '') {
        answer += ', ';
      }
      answer += "Password doesn't match";
    }
    return answer;
  }

  setPassword() {
    if (this.profileForm.valid) {
      const user = this.authService.getUser();
      const id = (user && user.id) ? user.id : '';
      const passwd = this.profileForm.value.password;
      const payload = { id: id, password: passwd };
      const url = '/metrics/api/v1/user/password';
      this.dialogService.showSpinner();
      this.httpClient.put<IMessage>(url, payload)
        .subscribe({
          next: (data) => { 
            this.dialogService.closeSpinner();
            this.formError = data.message;
            if (data.message.toLowerCase() === 'password changed') {
              this.profileForm.controls['password'].setValue(undefined);
              this.profileForm.controls['password2'].setValue(undefined);
            }
          },
          error: error => {
            this.dialogService.closeSpinner();
            this.formError = `${error.status} - ${transformErrorString(error)}`;
          }
        });
    }
  }

  updateUserField(field: string) {
    const user = this.authService.getUser();
    const id = (user && user.id) ? user.id : '';
    const update: UpdateRequest = {
      id: id,
      field: field,
      value: '',
    };
    switch(field.toLowerCase()) {
      case "email":
        update.value = this.profileForm.value.email;
        break;
      case "first":
        update.value = this.profileForm.value.first;
        break;
      case "middle":
        update.value = this.profileForm.value.middle;
        break;
      case "last":
        update.value = this.profileForm.value.last;
        break;
    }
    const url = '/metrics/api/v1/user/change';
    this.dialogService.showSpinner();
    this.httpClient.put<AuthenticationResponse>(
      url, update, { observe: 'response'})
      .subscribe({
        next: (resp) => {
          this.dialogService.closeSpinner();
          if (resp.headers.get('token') !== null) {
            this.authService.setToken(resp.headers.get('token') as string);
          }
          const data: AuthenticationResponse | null = resp.body;
          if (data && data !== null && data.user) {
            this.authService.setUser(data.user);
          }
        },
        error: (err) => {
          this.dialogService.closeSpinner();
          console.log(err);
        }
      });
  }
}

export interface IMessage {
  message: string;
}
