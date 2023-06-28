import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ReportType, Report, ReportPeriod } from '../models/systems';
import { ReportRequest } from '../models/web';
import { DialogService } from '../services/dialog-service.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent {
  reports: string[] = ["Msn Summary", "Draw", "XINT"];
  periods: string[] = ['Daily', 'Weekly', 'Monthly', 'Annual', 'Custom'];
  includes: string[] = ['Full Report', 'GEOINT Only', 'SYERS Only', 'DDSA Only', 
    'XINT Only'];

  reportForm: FormGroup

  constructor(
    protected httpClient: HttpClient,
    protected dialogService: DialogService,
    private fb: FormBuilder
  ) {
    this.reportForm = fb.group({
      report: 'Msn Summary',
      period: 'Weekly',
      limits: 'Full Report',
      startDate: new Date(),
      endDate: new Date(),
      daily: false,
    })
  }

  createReport() {
    const url = '/metrics/api/v1/reports';
    const start = new Date(this.reportForm.value.startDate);
    let request: ReportRequest = {
      report: Report.MSN_SUMMARY,
      reportPeriod: ReportPeriod.WEEKLY,
      reportType: ReportType.FULL_REPORT,
      startDate: new Date(Date.UTC(start.getFullYear(), start.getMonth(), 
        start.getDate())),
      endDate: undefined,
      includeDaily: this.reportForm.value.daily,
    }
    switch (this.reportForm.value.report) {
      case "Msn Summary":
        request.report = Report.MSN_SUMMARY;
        break;
      case "Draw":
        request.report = Report.DRAW;
        break;
      case "XINT":
        request.report = Report.XINT;
        break;
    }
    switch (this.reportForm.value.period) {
      case "Daily":
        request.reportPeriod = ReportPeriod.DAILY;
        break;
      case "Weekly":
        request.reportPeriod = ReportPeriod.WEEKLY;
        break;
      case "Monthly":
        request.reportPeriod = ReportPeriod.MONTHLY;
        break;
      case "Annual":
        request.reportPeriod = ReportPeriod.ANNUAL;
        break;
      case "Custom":
        request.reportPeriod = ReportPeriod.CUSTOM;
        break;
    }
    switch (this.reportForm.value.limits) {
      case "Full Report":
        request.reportType = ReportType.FULL_REPORT;
        break;
      case "GEOINT Only":
        request.reportType = ReportType.GEOINT_ONLY;
        break;
      case "SYERS Only":
        request.reportType = ReportType.SYERS_ONLY;
        break;
      case "DDSA Only":
        request.reportType = ReportType.MIST_ONLY;
        break;
      case "XINT Only":
        request.reportType = ReportType.XINT_ONLY;
        break;
    }
    if (request.reportPeriod === ReportPeriod.CUSTOM) {
      const end = new Date(this.reportForm.value.endDate);
      request.endDate = new Date(Date.UTC(end.getFullYear(), end.getMonth(),
        end.getDate(), 23, 59, 59, 999));
    }
    this.dialogService.showSpinner();
    this.httpClient.post(url, request, { responseType: "blob", observe: 'response'})
      .subscribe(file => {
        if (file.body) {
          const blob = new Blob([file.body], 
            {type: 'application/vnd.openxmlformat-officedocument.spreadsheetml.sheet'});
          let contentDisposition = file.headers.get('Content-Disposition');
          let parts = contentDisposition?.split(' ');
          let fileName = '';
          parts?.forEach(pt => {
            if (pt.startsWith('filename')) {
              let fParts = pt.split('=');
              if (fParts.length > 1) {
                fileName = fParts[1];
              }
            }
          });
          if (!fileName) {
            fileName = 'MsnSummary.xlsx';
          }
          const url = window.URL.createObjectURL(blob);
          
          const a: HTMLAnchorElement = document.createElement('a') as HTMLAnchorElement;
          a.href = url;
          a.download = fileName;
          document.body.appendChild(a);
          a.click();

          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          this.dialogService.closeSpinner();
        }
      })
  }

  createSupervisorReview() {
    
  }
}
