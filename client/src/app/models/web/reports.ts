import { Report, ReportPeriod, ReportType } from "../systems";

export interface ReportRequest {
  report: string;
  reportType: string;
  reportPeriod: number;
  startDate: Date;
  endDate?: Date;
  includeDaily: boolean
}