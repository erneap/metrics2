import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Mission } from 'src/app/models/interfaces';
import { ReviewDay } from 'src/app/models/web/reviewDay';
import { AuthService } from 'src/app/services/auth.service';
import { DialogService } from 'src/app/services/dialog-service.service';
import { MissionService } from 'src/app/services/mission.service';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewComponent {
  days: ReviewDay[] = [];
  start: Date = new Date();
  reviewForm: FormGroup;

  constructor (
    protected msnService: MissionService,
    protected dialogs: DialogService,
    protected authService: AuthService,
    private fb: FormBuilder
  ) {
    let d = new Date();
    this.start = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
    this.reviewForm = this.fb.group({
      startDate: [this.start, [Validators.required]],
    });
  }

  getMissionDays() {
    this.dialogs.showSpinner();
    this.days = [];
    this.start = this.reviewForm.value.startDate;
    let endDate = new Date(this.start.getTime() + ( 7 * 24 * 3600000))
    this.msnService.getMissionsByDates(this.start, endDate)
    .subscribe({
      next: (resp) => {
        this.dialogs.closeSpinner();
        if (resp.headers.get('token') !== null) {
          this.authService.setToken(resp.headers.get('token') as string);
        }
        const data = resp.body;
        let start = new Date(Date.UTC(this.start.getFullYear(), 
          this.start.getMonth(), this.start.getDate()));
        let end = new Date(start.getTime() + (7 * 24 * 3600000))
        while (start.getTime() < end.getTime()) {
          let tEnd = new Date(start.getTime() + (24 * 3600000));
          let day: ReviewDay = new ReviewDay();
          day.day = new Date(start);
          day.missions = [];
          data?.missions.forEach(msn => {
            const msnDate = new Date(msn.missionDate)
            if (msnDate.getTime() >= start.getTime()
              && msnDate.getTime() < tEnd.getTime()) {
              day.missions.push(new Mission(msn))
            }
          });
          this.days.push(day)
          start = new Date(start.getTime() + (24 * 3600000));
        }
      },
      error: (err) => {
        this.dialogs.closeSpinner();
        console.log(JSON.stringify(err))
      }
    })
  }
}
