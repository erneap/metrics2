import { Component, Input } from '@angular/core';
import { Sensor } from '../sensors/abstractSensor';
import { IMissionSensor } from '../../models/interfaces/missionSensor';
import { GeneralSensorType } from '../../models/systems';
import { MissionService } from 'src/app/services/mission.service';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UpdateMission } from '../../models/web';
import { DialogService } from 'src/app/services/dialog-service.service';

@Component({
  selector: 'app-xint-sensor',
  templateUrl: './xint-sensor.component.html',
  styleUrls: ['./xint-sensor.component.scss']
})
export class XintSensorComponent extends Sensor {
  private _sensor?: IMissionSensor;
  @Input() missionid: string = '';
  @Input() 
  public set sensor(sen: IMissionSensor) {
    this._sensor = sen;
    this.setSensorInfo();
  }
  public get sensor() {
    if (this._sensor) {
      return this._sensor;
    } else {
      return {
        sensorID: 'Empty',
        sensorType: GeneralSensorType.OTHER,
        preflightMinutes: 0,
        scheduledMinutes: 0,
        executedMinutes: 0,
        postflightMinutes: 0,
        additionalMinutes: 0,
        finalCode: 0,
        kitNumber: '',
        sensorOutage: {
          totalOutageMinutes: 0,
          partialLBOutageMinutes: 0,
          partialHBOutageMinutes: 0,
        },
        groundOutage: 0,
        hasHap: false,
        towerID: undefined,
        comments: '',
        sortID: 0,
        images: [],
      };
    }
  }

  finalCodes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  towers = [ 1, 2, 3];
  commForm: FormGroup;

  constructor(
    public missionService: MissionService,
    public authService: AuthService,
    protected dialogService: DialogService,
    private fb: FormBuilder
  ) {  
    super();
    this.commForm = fb.group({
      kitnumber: '',
      finalcode: 0,
      premission: '0:00',
      scheduled: '0:00',
      executed: '0:00',
      postmission: '0:00',
      additional: '0:00',
      comments: '',
      hashap: false,
      tower: 0,
      sensortotal: 0,
      partialhb: 0,
      partiallb: 0,
      groundout: 0,
    })
  }

  clearComm() {
    this.commForm.controls['kitnumber'].setValue('');
    this.commForm.controls['finalcode'].setValue(-1);
    this.commForm.controls['premission'].setValue('0:00');
    this.commForm.controls['scheduled'].setValue('0:00');
    this.commForm.controls['executed'].setValue('0:00');
    this.commForm.controls['postmission'].setValue('0:00');
    this.commForm.controls["additional"].setValue('0:00');
    this.commForm.controls['sensortotal'].setValue(0);
    this.commForm.controls['partialhb'].setValue(0);
    this.commForm.controls['partiallb'].setValue(0);
    this.commForm.controls['groundout'].setValue(0);
    this.commForm.controls['hashap'].setValue(false);
    this.commForm.controls['tower'].setValue(-1);
    this.commForm.controls['comments'].setValue('');
  }

  setSensorInfo() {
    if (this.sensor) {
      console.log(JSON.stringify(this.sensor));
      this.commForm.controls['kitnumber'].setValue(this.sensor.kitNumber);
      this.commForm.controls['finalcode'].setValue(this.sensor.finalCode);
      this.commForm.controls['premission'].setValue(
        this.convertMinutesToTimeString(this.sensor.preflightMinutes)
      );
      this.commForm.controls['scheduled'].setValue(
        this.convertMinutesToTimeString(this.sensor.scheduledMinutes)
      );
      this.commForm.controls['executed'].setValue(
        this.convertMinutesToTimeString(this.sensor.executedMinutes)
      );
      this.commForm.controls['postmission'].setValue(
        this.convertMinutesToTimeString(this.sensor.postflightMinutes)
      );
      this.commForm.controls["additional"].setValue(
        this.convertMinutesToTimeString(this.sensor.additionalMinutes)
      );
      this.commForm.controls['sensortotal'].setValue(
        this.sensor.sensorOutage.totalOutageMinutes);
      this.commForm.controls['partialhb'].setValue(
        this.sensor.sensorOutage.partialHBOutageMinutes);
      this.commForm.controls['partiallb'].setValue(
        this.sensor.sensorOutage.partialLBOutageMinutes);
      this.commForm.controls['groundout'].setValue(this.sensor.groundOutage);
      this.commForm.controls['hashap'].setValue(this.sensor.hasHap);
      this.commForm.controls['tower'].setValue(this.sensor.towerID);
      this.commForm.controls['comments'].setValue(this.sensor.comments);
    } else {
      this.commForm.controls['kitnumber'].setValue('');
      this.commForm.controls['finalcode'].setValue(-1);
      this.commForm.controls['premission'].setValue('0:00');
      this.commForm.controls['scheduled'].setValue('0:00');
      this.commForm.controls['executed'].setValue('0:00');
      this.commForm.controls['postmission'].setValue('0:00');
      this.commForm.controls["additional"].setValue('0:00');
      this.commForm.controls['sensortotal'].setValue(0);
      this.commForm.controls['partialhb'].setValue(0);
      this.commForm.controls['partiallb'].setValue(0);
      this.commForm.controls['groundout'].setValue(0);
      this.commForm.controls['hashap'].setValue(false);
      this.commForm.controls['tower'].setValue(-1);
      this.commForm.controls['comments'].setValue('');
    }
  }

  updateSensor(field: string) {
    const update: UpdateMission = {
      id: this.missionid,
      sensorID: this.sensor.sensorID,
      field: field,
      value: '',
    };
    switch (field.toLowerCase()) {
      case 'kitnumber':
        update.value = this.commForm.value.kitnumber;
        break;
      case 'finalcode':
        update.value = String(this.commForm.value.finalcode);
        break;
      case 'premission':
        update.value = String(this.convertTimeStringToMinutes(
          this.commForm.value.premission));
        break;
      case 'scheduled':
        update.value = String(this.convertTimeStringToMinutes(
          this.commForm.value.scheduled));
        break;
      case 'executed':
        update.value = String(this.convertTimeStringToMinutes(
          this.commForm.value.executed));
        break;
      case 'postmission':
        update.value = String(this.convertTimeStringToMinutes(
          this.commForm.value.postmission));
        break;
      case 'additional':
        update.value = String(this.convertTimeStringToMinutes(
          this.commForm.value.additional));
        break;
      case 'sensorout':
        update.value = String(this.commForm.value.sensorout);
        break;
      case 'groundout':
        update.value = String(this.commForm.value.groundout);
        break;
      case 'hashap':
        update.value = (this.commForm.value.hashap) ? "true" : "false";
        break;
      case 'tower':
        update.value = String(this.commForm.value.tower);
        break;
      case 'comments':
        update.value = this.commForm.value.comments;
        break;
      case 'partialhb':
        update.value = String(this.commForm.value.partialhb);
        break;
      case 'partiallb':
        update.value = String(this.commForm.value.partiallb);
        break;
    }
    this.dialogService.showSpinner();
    this.missionService.updateMissionSensor(update)
      .subscribe({
        next: (resp) => {
          this.dialogService.closeSpinner();
          if (resp.headers.get('token') !== null) {
            this.authService.setToken(resp.headers.get('token') as string);
          }
          const data = resp.body;
          if (data && data !== null) {
            this.missionService.selectedMission = data;
            for (let i=0; i < this.missionService.missions.length; i++) {
              if (data.id === this.missionService.missions[i].id) {
                this.missionService.missions[i] = data;
              }
            }
          } else {
            this.missionService.selectedMission = undefined;
          }
          if (this.missionService.selectedMission 
            && this.missionService.selectedMission.missionData) {
            for (let i=0; 
              i < this.missionService.selectedMission.missionData.sensors.length; 
              i++) {
              if (this.missionService.selectedMission.missionData.sensors[i]
                .sensorType === this.sensor.sensorType) {
                this.sensor 
                  = this.missionService.selectedMission.missionData.sensors[i];
                this.setSensorInfo();
              }
            }
          }
        },
        error: (err) => {
          this.dialogService.closeSpinner();
          console.log(err);
        },
    });
  }
}
