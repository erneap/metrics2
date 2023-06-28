import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { transformErrorString } from '../models/common';
import { ISystemInfo } from '../models/systems';
import { GroundOutage, IGroundOutage } from '../models/interfaces/groundOutage';
import { CacheService } from './cache.service';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OutageService extends CacheService {
  systemInfo: ISystemInfo | undefined;
  allOutages: IGroundOutage[] = [];
  selectedOutage: IGroundOutage | undefined = undefined;
  changesMade: Subject<void> = new Subject<void>();

  constructor(
    protected httpClient: HttpClient 
  ) {
    super();
    if (!this.systemInfo) {
      this.pullSystemInfo();
    }

    // get all outages from database
    this.pullAllOutages();
  }

  public pullSystemInfo() {
    this.httpClient.get<ISystemInfo>('/metrics/api/v1/system')
      .subscribe({
        next: data => {
          if (!this.systemInfo) {
            this.systemInfo = data;
          }
        },
        error: error => {
          this.systemInfo = undefined;
          alert(transformErrorString(error));
        },

      });
  }

  public SystemInfoToString(): string {
    if (this.systemInfo) {
      return JSON.stringify(this.systemInfo);
    }
    return '';
  }

  public pullAllOutages() {
    this.allOutages = [];
    const url = '/metrics/api/v1/outage/';
    this.httpClient.get<IGroundOutage[]>(url)
      .subscribe({
        next: data => {
        this.allOutages = data;
        },
        error: err => {
          console.log(err)
        }
      });
  }

  public getOutagesForWeek(outdate: Date): Observable<HttpResponse<IGroundOutage[]>> {
    const url = `/metrics/api/v1/outage/byweek/${this.getDateString(outdate)}`
    return this.httpClient.get<IGroundOutage[]>(url, { observe: 'response'})
  }

  public getOutagesForPeriod(sDate: Date, eDate: Date): 
    Observable<HttpResponse<IGroundOutage[]>> {
    const url = `/metrics/api/v1/outage/byperiod/`
      + `${this.getDateString(sDate)}/${this.getDateString(eDate)}`;
    return this.httpClient.get<IGroundOutage[]>(url, { observe: 'response'})
  }

  private getDateString(date: Date): string {
    let outageDate = `${date.getFullYear()}-`;
    if (date.getMonth() + 1 < 10) {
      outageDate += "0";
    }
    outageDate += `${date.getMonth() + 1}-`;
    if (date.getDate() < 10) {
      outageDate += "0";
    }
    outageDate += `${date.getDate()}`
    return outageDate;
  }

  public createOutage(system: string, enclave: string, outagedate: Date)
    : Observable<HttpResponse<IGroundOutage>> {
    const newOutage: IGroundOutage = {
      groundSystem: system,
      classification: enclave,
      outageDate: new Date(outagedate),
      outageNumber: 0,
      outageMinutes: 0,
      missionOutage: false,
      subSystem: '',
      referenceId: '',
      majorSystem: '',
      problem: '',
      fixAction: '',
    };

    const outDate = new Date(outagedate);
    const reqDate = new Date(Date.UTC(outDate.getFullYear(), outDate.getMonth(),
      outDate.getDate()));
    let outNum = 0;
    this.allOutages.forEach(gndOut => {
      const gDate = new Date(gndOut.outageDate);
      if (gndOut.groundSystem === system && gndOut.classification === enclave
        && gDate.getDate() === reqDate.getTime()) {
          if (gndOut.outageNumber > outNum) {
            outNum = gndOut.outageNumber;
          }
        }
    });
    newOutage.outageNumber = outNum + 1;
    const url = '/metrics/api/v1/outage/';
    return this.httpClient.post<IGroundOutage>(url, newOutage, 
      {observe: 'response'});
  }

  deleteOutage(): Observable<HttpResponse<Object>> {
    const url = `/metrics/api/v1/outage/${this.selectedOutage?.id}`;
    return this.httpClient.delete(url, {observe: 'response'});
  }
}
