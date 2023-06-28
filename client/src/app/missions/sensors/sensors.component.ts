import { Component, Input, ViewEncapsulation } from '@angular/core';
import { IMissionSensor } from '../../models/interfaces/missionSensor';
import { GeneralSensorType } from '../../models/systems';
import { AuthService } from 'src/app/services/auth.service';
import { MissionService } from 'src/app/services/mission.service';

@Component({
  selector: 'app-sensors',
  templateUrl: './sensors.component.html',
  styleUrls: ['./sensors.component.scss']
})
export class SensorsComponent {
  @Input() sensors: IMissionSensor[] = [];
  @Input() platform: string = '';
  @Input() missionid: string = '';
  @Input() exploit: string = "Primary";

  constructor(
    private authService: AuthService,
    private missionService: MissionService
  ) { }

  showTab(tabName: string): boolean {
    let bExploit = false;
    if (this.missionService.systemInfo && this.missionService.systemInfo.platforms) {
      this.missionService.systemInfo.platforms.forEach(plat => {
        if (plat.id.toLowerCase() === this.platform.toLowerCase()) {
          plat.sensors.forEach(pSen => {
            pSen.exploitations.forEach(pSenExp => {
              if (pSenExp.exploitation.toLowerCase().indexOf(
                this.exploit.toLowerCase()) >= 0) {
                switch (tabName.toLowerCase()) {
                  case "geoint":
                    if (pSenExp.showOnGEOINT || pSenExp.showOnGSEG) {
                      bExploit = true;
                    }
                    break;
                  case "xint":
                    if (pSenExp.showOnXINT) {
                      bExploit = true;
                    }
                    break;
                  case "mist":
                    if (pSenExp.showOnMIST) {
                      bExploit = true;
                    }
                    break;
                }
              }
            });
          });
        }
      });
    }
    let bRole = this.authService.hasRole(tabName) 
      || this.authService.hasRole("ADMIN");
    return bExploit && bRole;
  }

  getSensor(sensorType: string): IMissionSensor {
    let sensor: IMissionSensor = {
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
    this.sensors.forEach(sen => {
      switch (sensorType.toLowerCase()) {
        case "geoint":
          if (sen.sensorType === GeneralSensorType.GEOINT) {
            sensor = sen;
          }
          break;
        case "xint":
          if (sen.sensorType === GeneralSensorType.XINT) {
            sensor = sen;
          }
          break;
        case "mist":
          if (sen.sensorType === GeneralSensorType.MIST) {
            sensor = sen;
          }
      }
    });
    return sensor;
  }
}
