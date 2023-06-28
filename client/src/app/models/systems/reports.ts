export enum ReportType {
  FULL_REPORT = "FULL REPORT",
  GEOINT_ONLY = "GEOINT",
  SYERS_ONLY = "SYERS",
  XINT_ONLY = "XINT",
  MIST_ONLY = "DDSA",
}

export enum ReportPeriod {
  DAILY = 1,
  WEEKLY = 7,
  MONTHLY = 31,
  ANNUAL = 365,
  CUSTOM = 0,
}

export enum Report {
  MSN_SUMMARY = "Mission Summary",
  DRAW = "DRAW Summary",
  XINT = "XINT Summary",
}
