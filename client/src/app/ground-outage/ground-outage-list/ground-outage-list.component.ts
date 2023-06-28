import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { IGroundOutage } from 'src/app/models/interfaces/groundOutage';
import { AuthService } from 'src/app/services/auth.service';
import { DialogService } from 'src/app/services/dialog-service.service';
import { OutageService } from 'src/app/services/outage.service';

@Component({
  selector: 'app-ground-outage-list',
  templateUrl: './ground-outage-list.component.html',
  styleUrls: ['./ground-outage-list.component.scss']
})
export class GroundOutageListComponent {
  @Output() selected = new EventEmitter<string>()
  startDate: Date = new Date();
  endDate: Date = new Date();
  listForm: FormGroup;
  outageList: IGroundOutage[];

  constructor(
    protected authService: AuthService,
    protected outageService: OutageService,
    protected dialogService: DialogService,
    private fb: FormBuilder
  ) {
    let now = new Date();
    this.endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    this.startDate = new Date(now.getFullYear(), 0, 1);
    // display for at least 365 days initially
    let days = Math.floor((this.endDate.getTime() - this.startDate.getTime()) 
      / (24 * 3600000));
    if (days < 365) {
      this.startDate = new Date(now.getFullYear() - 1, 0, 1);
    }
    this.listForm = fb.group({
      startdate: this.startDate,
      enddate: this.endDate,
    });
    this.outageList = [];
    this.getOutageList();
    this.outageService.changesMade.subscribe(() => {
      this.getOutageList();
    })
  }

  changeDate() {
    this.getOutageList();
  }

  selectOutage(value: string) {
    this.selected.emit(value);
  }

  getOutageList() {
    this.dialogService.showSpinner();
    this.outageService.getOutagesForPeriod(this.listForm.value.startdate,
      this.listForm.value.enddate)
      .subscribe({
        next: (resp) => {
          this.dialogService.closeSpinner();
          if (resp.headers.get('token') !== null) {
            this.authService.setToken(resp.headers.get('token') as string);
          }
          const data = resp.body;
          if (data && data !== null) {
            this.outageList = data;
          } else {
            this.outageList = [];
          }
        },
        error: (err) => {
          this.dialogService.closeSpinner();
          console.log(err);
        }
      })
  }
}
