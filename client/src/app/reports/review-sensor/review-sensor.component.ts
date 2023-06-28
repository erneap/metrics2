import { Component, Input } from '@angular/core';
import { IMissionSensor } from 'src/app/models/interfaces';

@Component({
  selector: 'app-review-sensor',
  templateUrl: './review-sensor.component.html',
  styleUrls: ['./review-sensor.component.scss']
})
export class ReviewSensorComponent {
  @Input() sensor: IMissionSensor = {
    sensorID: '',
    sensorType: undefined,
    preflightMinutes: 0,
    scheduledMinutes: 0,
    executedMinutes: 0,
    postflightMinutes: 0,
    additionalMinutes: 0,
    finalCode: -1,
    kitNumber: '',
    sensorOutage: {
      totalOutageMinutes: 0,
      partialLBOutageMinutes: 0,
      partialHBOutageMinutes: 0,
    },
    groundOutage: 0,
    hasHap: false,
    towerID: 0,
    sortID: 0,
    comments: '',
    images: [],
  }

  constructor() {}

  protected convertToHHMM(time?: number): string {
    let answer = '';
    if (time) {
      let hours = Math.floor(time / 60);
      let minutes = time - (hours * 60);
      if (hours < 10) {
        answer += "0";
      }
      answer += `${hours}:`;
      if (minutes < 10) {
        answer += "0";
      }
      answer += `${minutes}`;
    } 
    return answer;
  }
}
