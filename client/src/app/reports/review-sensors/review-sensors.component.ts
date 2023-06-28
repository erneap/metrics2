import { Component, Input } from '@angular/core';
import { IMissionSensor, MissionSensor } from 'src/app/models/interfaces';

@Component({
  selector: 'app-review-sensors',
  templateUrl: './review-sensors.component.html',
  styleUrls: ['./review-sensors.component.scss']
})
export class ReviewSensorsComponent {
  private _sensors: IMissionSensor[] = [];
  @Input()
  public set sensors(sens: IMissionSensor[]) {
    this._sensors = sens;
  }
  get sensors(): IMissionSensor[] {
    return this._sensors;
  }

  constructor() {}
}
