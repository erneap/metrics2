import { Component, Input } from '@angular/core';
import { IMission, IMissionSensor, Mission } from 'src/app/models/interfaces';

@Component({
  selector: 'app-review-mission',
  templateUrl: './review-mission.component.html',
  styleUrls: ['./review-mission.component.scss']
})
export class ReviewMissionComponent {
  private _mission?: IMission;
  @Input() 
  public set mission(msn: IMission) {
    this._mission = msn;
    if (msn.missionData) {
      this.sensors = msn.missionData.sensors;
    }
  }
  get mission(): IMission {
    return (this._mission) ? this._mission : new Mission();
  }
  sensors: IMissionSensor[] = [];

  constructor() {}

  getComments(): string {
    let answer = '';
    if (this.mission.missionData?.aborted) {
      answer += 'Msn Aborted';
    } else if (this.mission.missionData?.cancelled) {
      answer += 'Msn Cancelled';
    } else if (this.mission.missionData?.indefDelay) {
      answer += 'Msn Indef Delay';
    }
    if (this.mission.missionData?.comments !== '') {
      if (answer !== '') {
        answer += ', ';
      }
      answer += this.mission.missionData?.comments;
    }
    return answer;
  }
}
