import { HttpClient, HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { IGroundOutage } from '../models/interfaces/groundOutage';
import { IGroundSystem } from '../models/systems';
import { UpdateRequest } from '../models/web';
import { AuthService } from '../services/auth.service';
import { DialogService } from '../services/dialog-service.service';
import { MissionService } from '../services/mission.service';
import { OutageService } from '../services/outage.service';
import { DeleteOutageDialogComponent } from './delete-outage-dialog/delete-outage-dialog.component';

@Component({
  selector: 'app-ground-outage',
  templateUrl: './ground-outage.component.html',
  styleUrls: ['./ground-outage.component.scss']
})
export class GroundOutageComponent {
  outageForm: FormGroup;
  groundSystems: string[] = [];
  enclaves: string[] = [];
  refreshList: Subject<void> = new Subject<void>();

  constructor(
    public outageService: OutageService,
    public authService: AuthService,
    protected dialogService: DialogService,
    private fb: FormBuilder,
    protected httpClient: HttpClient,
    private dialog: MatDialog
  ) {
    this.outageForm = fb.group({
      system: '',
      enclave: '',
      outagedate: new Date(),
      outagenumber: '',
      outagetime: 0,
      duringmission: false,
      subsystems: '',
      reference: 'FIX_',
      majorarea: '',
      problem: '',
      fixaction: ''
    });
    this.getSystems();
    this.outageService.changesMade.next();
  }

  getSystems(): IGroundSystem[] {
    if (this.outageService.systemInfo 
      && this.outageService.systemInfo.groundSystems) {
      return this.outageService.systemInfo.groundSystems;
    }
    return [];
  }

  clearOutage() {
    this.outageForm.reset();
  }

  getSystemEnclaves(): string[] {
    let answer: string[] = [];
    if (this.outageService.systemInfo
      && this.outageService.systemInfo.groundSystems) {
      this.outageService.systemInfo.groundSystems.forEach(gs => {
        if (gs.id === this.outageForm.value.system) {
          answer = gs.enclaves;
        }
      });
    }
    return answer;
  }

  getOutagesForDate(): IGroundOutage[] {
    let answer: IGroundOutage[] = [];
    const outDate = new Date(this.outageForm.value.outagedate);
    const reqDate = new Date(Date.UTC(outDate.getFullYear(), outDate.getMonth(),
      outDate.getDate()));
   
    if (this.outageForm.value.system !== null 
      && this.outageForm.value.system !== '') {
      this.outageService.allOutages.forEach(gndOut => {
        if (gndOut.groundSystem.toLowerCase() 
          === this.outageForm.value.system.toLowerCase()) {
          if (gndOut.classification === this.outageForm.value.enclave) {
            if (new Date(gndOut.outageDate).getTime() === reqDate.getTime()) {
              answer.push(gndOut);
            }
          }
        }
      });
    }
    return answer;
  }

  selectOutageById(id: string) {
    this.outageService.allOutages.forEach(gndOut => {
      if (gndOut.id && gndOut.id === id) {
        this.outageService.selectedOutage = gndOut;
        this.setOutage();
      }
    })
  }

  selectOutage() {
    const outDate = new Date(this.outageForm.value.outagedate);
    const reqDate = new Date(Date.UTC(outDate.getFullYear(), outDate.getMonth(),
      outDate.getDate()));

    if (this.outageForm.value.outagenumber !== '') {
      const outageNumber = Number(this.outageForm.value.outagenumber);
      if (outageNumber > 0) {
        this.outageService.allOutages.forEach(gndOut => {
          if (gndOut.groundSystem.toLowerCase() 
            === this.outageForm.value.system.toLowerCase()) {
            if (gndOut.classification === this.outageForm.value.enclave) {
              if (new Date(gndOut.outageDate).getTime() === reqDate.getTime()) {
                if (gndOut.outageNumber === outageNumber) {
                  this.outageService.selectedOutage = gndOut;
                  this.setOutage();
                }
              }
            }
          }
        });
      } else {
        this.dialogService.showSpinner();
        this.outageService.createOutage(this.outageForm.value.system,
          this.outageForm.value.enclave, reqDate)
          .subscribe({
            next: (resp) => {
              this.dialogService.closeSpinner();
              if (resp.headers.get('token') !== null) {
                this.authService.setToken(resp.headers.get('token') as string);
              }
              const data = resp.body;
              if (data && data !== null) {
                this.outageService.selectedOutage = data;
                this.outageService.allOutages.push(data);
                this.setOutage();
              }
            },
            error: (err) => {
              this.dialogService.closeSpinner();
              console.log(err);
            }
          })
      }
    } else {
      this.outageForm.reset();
    }
  }

  setOutage() {
    if (this.outageService.selectedOutage) {
      this.outageForm.controls['system'].setValue(
        this.outageService.selectedOutage.groundSystem.toUpperCase());
      this.outageForm.controls['enclave'].setValue(
        this.outageService.selectedOutage.classification);
      this.outageForm.controls['outagedate'].setValue(
        new Date(this.outageService.selectedOutage.outageDate)
      );
      this.outageForm.controls['outagenumber'].setValue(
        this.outageService.selectedOutage.outageNumber);
      this.outageForm.controls['outagetime'].setValue(
        this.outageService.selectedOutage.outageMinutes);
      this.outageForm.controls['duringmission'].setValue(
        this.outageService.selectedOutage.missionOutage);
      this.outageForm.controls['subsystems'].setValue(
        this.outageService.selectedOutage.subSystem);
      this.outageForm.controls['reference'].setValue(
        this.outageService.selectedOutage.referenceId);
      this.outageForm.controls['majorarea'].setValue(
        this.outageService.selectedOutage.majorSystem);
      this.outageForm.controls['problem'].setValue(
        this.outageService.selectedOutage.problem);
      this.outageForm.controls['fixaction'].setValue(
        this.outageService.selectedOutage.fixAction);
    } else {
      const system = this.outageForm.value.system;
      const enclave = this.outageForm.value.enclave;
      const outageDate = new Date(this.outageForm.value.outagedate);
      const outagenum = this.outageForm.value.outagenumber;
      this.outageForm.controls['system'].setValue(system);
      this.outageForm.controls['enclave'].setValue(enclave);
      this.outageForm.controls['outagedate'].setValue(outageDate);
      this.outageForm.controls['outagenumber'].setValue(outagenum);
      this.outageForm.controls['outagetime'].setValue(0);
      this.outageForm.controls['duringmission'].setValue(false);
      this.outageForm.controls['subsystems'].setValue('');
      this.outageForm.controls['reference'].setValue('Fix_');
      this.outageForm.controls['majorarea'].setValue('');
      this.outageForm.controls['problem'].setValue('');
      this.outageForm.controls['fixaction'].setValue('');
    }
  }

  updateOutage(field: string) {
    if (this.outageService.selectedOutage) {
      let update: UpdateRequest = {
        id: this.outageService.selectedOutage.id as string,
        field: field,
        value: '',
      }
      switch (field.toLowerCase()) {
        case "outagetime":
          update.field = "minutes";
          update.value = this.outageForm.value.outagetime;
          break;
        case "duringmission":
          update.field = "missionoutage";
          update.value = this.outageForm.value.duringmission;
          break;
        case "subsystems":
          update.field = "subsystem";
          update.value = this.outageForm.value.subsystems;
          break;
        case "reference":
          update.value = this.outageForm.value.reference;
          break;
        case "majorarea":
          update.field = "majorsystem";
          update.value = this.outageForm.value.majorarea;
          break;
        case "problem":
          update.value = this.outageForm.value.problem;
          break;
        case "fixaction":
          update.value = this.outageForm.value.fixaction;
          break;
      }
      console.log(update.value);
      const url = '/metrics/api/v1/outage/';
      this.dialogService.showSpinner();
      this.httpClient.put<IGroundOutage>(url, update, {observe: 'response'})
        .subscribe({
          next: (resp) => {
            this.dialogService.closeSpinner();
            if (resp.headers.get('token') !== null) {
              this.authService.setToken(resp.headers.get('token') as string);
            }
            const data = resp.body;
            if (data && data !== null) {
              this.outageService.selectedOutage = data;
              for (let i=0; i < this.outageService.allOutages.length; i++) {
                if (this.outageService.allOutages[i].id === data.id) {
                  this.outageService.allOutages[i] = data;
                }
              }
              this.outageService.changesMade.next();
            }
          },
          error: (err) => {
            this.dialogService.closeSpinner();
            console.log(err);
          }
        });
    }
  }
  
  verifyDeletion(): void {
    const dialogRef = this.dialog.open(DeleteOutageDialogComponent, {
      width: '250px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.toLowerCase() === 'yes') {
        this.dialogService.showSpinner();
        const outageid = this.outageService.selectedOutage?.id;
        this.outageService.deleteOutage()
          .subscribe({
            next: (resp) => {
              this.dialogService.closeSpinner();
              if (resp.headers.get('token') !== null) {
                this.authService.setToken(resp.headers.get('token') as string);
              }
              this.outageService.selectedOutage = undefined;
              let found = false;
              for (let i=0; i < this.outageService.allOutages.length && !found; i++) {
                if (this.outageService.allOutages[i].id === outageid) {
                  this.outageService.allOutages.splice(i, 1);
                }
              }
              this.clearOutage();
              this.outageService.changesMade.next();
            },
            error: (err) => {
              this.dialogService.closeSpinner();
              console.log(err);
            }
          })
      }
    });
  }
}
