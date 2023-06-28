import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { transformErrorString } from '../models/common';
import { IUser, User } from '../models/interfaces';
import { MustMatchValidator } from '../must-match-validator.directive';
import { PasswordStrengthValidator } from '../password-strength-validator.directive';
import { AdminService } from '../services/admin.service';
import { AuthService } from '../services/auth.service';
import { DialogService } from '../services/dialog-service.service';
import { IMessage } from '../user-profile/user-profile.component';
import { DeleteUserDialogComponent } from './delete-user-dialog/delete-user-dialog.component';
import { PurgeDialogComponent } from './purge-dialog/purge-dialog.component';
import { UserListComponent } from './user-list/user-list.component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
  userForm: FormGroup;
  passwordForm: FormGroup;
  purgeForm: FormGroup;
  formError: string = '';
  showUnlock: boolean = false;
  users: User[] = [];
  @ViewChild(UserListComponent)
  private userlist!: UserListComponent

  constructor(
    public adminService: AdminService,
    protected authService: AuthService,
    protected httpClient: HttpClient,
    protected dialog: MatDialog,
    protected dialogService: DialogService,
    private fb: FormBuilder
  ) {
    this.userForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      first: ['', [Validators.required]],
      middle: '',
      last: ['', [Validators.required]],
      geoint: false,
      xint: false,
      ddsa: false,
      admin: false,
    });
    this.passwordForm = this.fb.group({
      password: ['', [Validators.required, new PasswordStrengthValidator()]],
      password2: ['', [Validators.required, new MustMatchValidator()]],
    })
    this.purgeForm = this.fb.group({
      mission: false,
      outages: false,
      purgedate: new Date(),
    });
    this.dialogService.showSpinner();
    this.adminService.getAllUsers()
      .subscribe((resp) => {
        this.dialogService.closeSpinner();
        if (resp.headers.get('token') !== null) {
          this.authService.setToken(resp.headers.get('token') as string);
        }
        if (resp.body !== null) {
          this.adminService.allUsers = [];
          resp.body.forEach(iUser => {
            this.adminService.allUsers.push(new User(iUser));
          })
          this.users = this.adminService.allUsers;
        } else {
          this.adminService.allUsers = [];
          this.users = [];
        }
      });;
  }

  getUserStatus(user: User) {
    const now = new Date();
    let answer = 'primary';
    if (user.passwordExpires.getTime() < now.getTime()) {
      answer = "warn";
    } else if (user.badAttempts > 2) {
      answer = "accent";
    }
    return answer;
  }

  addUser() {
    this.adminService.selectedUser = undefined;
    this.setUserForm();
  }

  createUser() {
    if (this.userForm.valid) {
      const iUser: IUser = {
        id: '',
        emailAddress: this.userForm.value.email,
        firstName: this.userForm.value.first,
        middleName: this.userForm.value.middle,
        lastName: this.userForm.value.last,
        password: this.userForm.value.password,
        passwordExpires: new Date(),
        salt: '',
        badAttempts: 0,
        workgroups: [],
      }
      console.log(this.userForm.value.geoint);
      if (this.userForm.value.geoint) {
        iUser.workgroups.push("GEOINT");
      }
      if (this.userForm.value.xint) {
        iUser.workgroups.push('XINT');
      }
      if (this.userForm.value.ddsa) {
        iUser.workgroups.push('MIST');
      }
      if (this.userForm.value.admin) {
        iUser.workgroups.push('ADMIN');
      }
      if (iUser.password !== '') {
        const url = '/metrics/api/v1/admin/';
        this.dialogService.showSpinner();
        this.httpClient.post<IUser>(url, iUser, {observe: 'response'})
          .subscribe({
            next: (resp) => {
              this.dialogService.closeSpinner();
              if (resp.headers.get('token') !== null) {
                this.authService.setToken(resp.headers.get('token') as string);
              }
              if (resp.body && resp.body !== null) {
                this.adminService.selectedUser = new User(resp.body);
                this.adminService.allUsers.push(new User(resp.body));
                this.setUserForm();
                this.users = this.adminService.allUsers;
                this.userlist.users = this.users;
              }
            },
            error: (err) => {
              this.dialogService.closeSpinner();
              this.formError = transformErrorString(err);
            }
          });
      } else {
        this.userForm.controls['password'].setErrors({passwordStrength: true});
      }
    }
  }

  selectUser(user: User) {
    this.adminService.selectedUser = undefined;
    this.adminService.allUsers.forEach(iUser => {
      if (iUser.id === user.id) {
        this.adminService.selectedUser = new User(iUser);
      }
    });
    this.setUserForm();
  }

  unlockUser() {
    if (this.adminService.selectedUser && this.adminService.selectedUser.id) {
      this.dialogService.showSpinner();
      this.adminService.updateUser(this.adminService.selectedUser.id, 
        "unlock", '').subscribe({
          next: (resp) => {
            this.dialogService.closeSpinner();
            if (resp.headers.get('token') !== null) {
              this.authService.setToken(resp.headers.get('token') as string);
            }
            if (resp.body && resp.body !== null) {
              this.adminService.selectedUser = new User(resp.body.user);
              let found = false;
              for (let i=0; i < this.adminService.allUsers.length && !found; i++) {
                if (this.adminService.allUsers[i].id === resp.body.user?.id) {
                  found = true;
                  this.adminService.allUsers[i] = new User(resp.body.user);
                }
              }
              this.users = this.adminService.allUsers;
              this.userlist.users = this.users;
              this.setUserForm();
            }
          },
          error: (err) => {
            this.dialogService.closeSpinner();
            this.formError = transformErrorString(err);
          }
        })
      }
  }

  updateUserField(field: string) {
    if (this.adminService.selectedUser && this.adminService.selectedUser.id) {
      let value = '';
      switch (field.toLowerCase()) {
        case "email":
          value = this.userForm.value.email;
          break;
        case "first":
          value = this.userForm.value.first;
          break;
        case "middle":
          value = this.userForm.value.middle;
          break;
        case "last":
          value = this.userForm.value.last;
          break;
        case "geoint":
          value = field;
          if (this.userForm.value.geoint) {
            field = 'addgroup';
          } else {
            field = 'removegroup';
          }
          break;
        case "xint":
          value = field;
          if (this.userForm.value.xint) {
            field = 'addgroup';
          } else {
            field = 'removegroup';
          }
          break;
        case "ddsa":
          value = "mist";
          if (this.userForm.value.ddsa) {
            field = 'addgroup';
          } else {
            field = 'removegroup';
          }
          break;
        case "admin":
          value = field;
          if (this.userForm.value.admin) {
            field = 'addgroup';
          } else {
            field = 'removegroup';
          }
          break;
      }
      this.dialogService.showSpinner();
      this.adminService.updateUser(this.adminService.selectedUser.id, 
        field, value).subscribe({
          next: (resp) => {
            this.dialogService.closeSpinner();
            if (resp.headers.get('token') !== null) {
              this.authService.setToken(resp.headers.get('token') as string);
            }
            if (resp.body && resp.body !== null) {
              this.adminService.selectedUser = new User(resp.body.user);
              let found = false;
              for (let i=0; i < this.adminService.allUsers.length && !found; i++) {
                if (this.adminService.allUsers[i].id === resp.body.user?.id) {
                  found = true;
                  this.adminService.allUsers[i] = new User(resp.body.user);
                }
              }
              this.users = this.adminService.allUsers;
              this.userlist.users = this.users;
              this.setUserForm();
            }
          },
          error: (err) => {
            this.dialogService.closeSpinner();
            this.formError = transformErrorString(err);
          }
        })
    }
  }

  clearUser() {
    this.userForm.reset();
    this.passwordForm.reset();
  }

  setUserForm() {
    if (this.adminService.selectedUser) {
      this.userForm.controls['email']
        .setValue(this.adminService.selectedUser.emailAddress);
      this.userForm.controls['first']
        .setValue(this.adminService.selectedUser.firstName);
      this.userForm.controls['middle']
        .setValue(this.adminService.selectedUser.middleName);
      this.userForm.controls['last']
        .setValue(this.adminService.selectedUser.lastName);
      this.passwordForm.controls['password'].setValue('');
      this.passwordForm.controls['password2'].setValue('');
      this.userForm.controls['geoint'].setValue(this.adminService.selectedUser
        .isInGroup('metrics', 'GEOINT'));
      this.userForm.controls['xint'].setValue(this.adminService.selectedUser
        .isInGroup('metrics', 'XINT'));
      this.userForm.controls['ddsa'].setValue(this.adminService.selectedUser
        .isInGroup('metrics', 'MIST'));
      this.userForm.controls['admin'].setValue(this.adminService.selectedUser
        .isInGroup('metrics', 'ADMIN'));
      this.showUnlock = (this.adminService.selectedUser.badAttempts >= 2);
    } else {
      this.userForm.controls['email'].setValue('');
      this.userForm.controls['first'].setValue('');
      this.userForm.controls['middle'].setValue('');
      this.userForm.controls['last'].setValue('');
      this.passwordForm.controls['password'].setValue('');
      this.passwordForm.controls['password2'].setValue('');
      this.userForm.controls['geoint'].setValue(false);
      this.userForm.controls['xint'].setValue(false);
      this.userForm.controls['ddsa'].setValue(false);
      this.userForm.controls['admin'].setValue(false);
      this.showUnlock = false;
    }
  }
  
  getPasswordError(): string {
    let answer: string = ''
    if (this.userForm.get('password')?.hasError('required')) {
      answer = "Password is Required";
    }
    if (this.userForm.get('password')?.hasError('passwordStrength')) {
      if (answer !== '') {
        answer += ', ';
      }
      answer += "Password doesn't meet minimum requirements";
    }
    if (answer === '' && this.getVerifyError() === '') {
      this.userForm
    }
    return answer;
  }

  getVerifyError(): string {
    let answer: string = ''
    if (this.userForm.get('password2')?.hasError('required')) {
      answer = "Password is Required";
    }
    if (this.userForm.get('password2')?.hasError('matching')) {
      if (answer !== '') {
        answer += ', ';
      }
      answer += "Password doesn't match";
    }
    return answer;
  }

  setPassword() {
    if (this.userForm.valid) {
      const passwd = this.passwordForm.value.password;
      const payload = { id: this.adminService.selectedUser?.id, password: passwd };
      const url = '/metrics/api/v1/user/password';
      this.dialogService.showSpinner();
      this.httpClient.put<IMessage>(url, payload)
        .subscribe({
          next: (data) => { 
            this.dialogService.closeSpinner();
            this.formError = data.message;
            if (data.message.toLowerCase() === 'password changed') {
              this.passwordForm.controls['password'].setValue(undefined);
              this.passwordForm.controls['password2'].setValue(undefined);
            }
          },
          error: error => {
            this.dialogService.closeSpinner();
            this.formError = `${error.status} - ${transformErrorString(error)}`;
          }
        });
    }
  }

  showUnlockButton(): boolean {
    let answer = false;
    if (this.adminService.selectedUser 
      && this.adminService.selectedUser.badAttempts > 2) {
      answer = true;
    }
    return answer;
  }

  verifyDeletion(): void {
    const dialogRef = this.dialog.open(DeleteUserDialogComponent, {
      width: '250px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.toLowerCase() === 'yes') {
        const userid = this.adminService.selectedUser?.id;
        this.dialogService.showSpinner();
        this.adminService.deleteUser()
          .subscribe({
            next: (resp) => {
              this.dialogService.closeSpinner();
              if (resp.headers.get('token') !== null) {
                this.authService.setToken(resp.headers.get('token') as string);
              }
              this.adminService.selectedUser = undefined;
              let found = false;
              for (let i=0; i < this.adminService.allUsers.length && !found; i++) {
                if (this.adminService.allUsers[i].id === userid) {
                  this.adminService.allUsers.splice(i, 1);
                }
              }
              this.clearUser();
            },
            error: (err) => {
              this.dialogService.closeSpinner();
              console.log(err);
            }
          })
      }
    });
  }

  verifyPurge(): void {
    const dialogRef = this.dialog.open(PurgeDialogComponent, {
      width: '250px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.toLowerCase() === 'yes') {
        const fDate = new Date(this.purgeForm.value.purgedate);
        const pDate = new Date(Date.UTC(fDate.getFullYear(), fDate.getMonth(),
          fDate.getDate()));

        if (this.purgeForm.value.mission) {
          this.dialogService.showSpinner();
          this.adminService.purgeMissions(pDate)
            .subscribe({
              next: (resp) => {
                this.dialogService.closeSpinner();
                if (resp.headers.get('token') !== null) {
                  this.authService.setToken(resp.headers.get('token') as string);
                }
              },
              error: (err) => {
                this.dialogService.closeSpinner();
                console.log(err);
              }
            });
        }
        if (this.purgeForm.value.outages) {
          this.dialogService.showSpinner();
          this.adminService.purgeOutages(pDate)
          .subscribe({
            next: (resp) => {
              this.dialogService.closeSpinner();
              if (resp.headers.get('token') !== null) {
                this.authService.setToken(resp.headers.get('token') as string);
              }
            },
            error: (err) => {
              this.dialogService.closeSpinner();
              console.log(err);
            }
          });
        }
      }
      this.purgeForm.reset();
    });
  }
}
