import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MissionsHomeComponent } from './home/home.component';
import { MaterialModule } from '../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SensorsComponent } from './sensors/sensors.component';
import { ImintSensorComponent } from './imint-sensor/imint-sensor.component';
import { XintSensorComponent } from './xint-sensor/xint-sensor.component';
import { CommSensorComponent } from './comm-sensor/comm-sensor.component';
import { DeleteMissionDialogComponent } from './delete-mission-dialog/delete-mission-dialog.component';
import { NewMissionDialogComponent } from './new-mission-dialog/new-mission-dialog.component';
import { ChangeSortieIdDialogComponent } from './change-sortie-id-dialog/change-sortie-id-dialog.component';

@NgModule({
  declarations: [
    MissionsHomeComponent,
    SensorsComponent,
    ImintSensorComponent,
    XintSensorComponent,
    CommSensorComponent,
    DeleteMissionDialogComponent,
    NewMissionDialogComponent,
    ChangeSortieIdDialogComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class MissionsModule { }
