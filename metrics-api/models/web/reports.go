package web

import (
	"time"
)

type ReportRequest struct {
	Report       string    `json:"report"`
	ReportType   string    `json:"reportType"`
	ReportPeriod uint      `json:"reportPeriod"`
	StartDate    time.Time `json:"startDate"`
	EndDate      time.Time `json:"endDate,omitempty"`
	IncludeDaily bool      `json:"includeDaily"`
}
