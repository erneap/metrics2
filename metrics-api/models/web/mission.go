package web

import (
	"fmt"
	"strconv"
	"time"

	"github.com/erneap/metrics-api/models/interfaces"
)

type CreateMission struct {
	MissionDate    time.Time `json:"missionDate"`
	PlatformID     string    `json:"platformID"`
	SortieID       uint      `json:"sortieID"`
	Exploitation   string    `json:"exploitation"`
	PrimaryDCGS    string    `json:"primaryDCGS"`
	Communications string    `json:"communications"`
	TailNumber     string    `json:"tailNumber"`
	Overlap        uint      `json:"overlap"`
	Executed       bool      `json:"executed"`
	Aborted        bool      `json:"aborted"`
	Cancelled      bool      `json:"cancelled"`
	IndefDelay     bool      `json:"indefDelay"`
	Sensors        []string  `json:"sensors"`
}

type UpdateMission struct {
	ID             string `json:"id"`
	SensorID       string `json:"sensorID"`
	ImageTypeID    string `json:"imageTypeID"`
	ImageSubTypeID string `json:"imageSubTypeID"`
	Field          string `json:"field"`
	Value          string `json:"value"`
}

func (ur *UpdateMission) StringValue() string {
	return ur.Value
}

func (ur *UpdateMission) NumberValue() uint {
	num, err := strconv.ParseUint(ur.Value, 10, 32)
	if err != nil {
		fmt.Println(err.Error())
	}
	return uint(num)
}

func (ur *UpdateMission) BooleanValue() bool {
	answer, err := strconv.ParseBool(ur.Value)
	if err != nil {
		return false
	}
	return answer
}

func (ur *UpdateMission) DateValue() time.Time {
	answer, _ := time.ParseInLocation("2006-01-02", ur.Value, time.UTC)
	return answer
}

type MissionResponse struct {
	Missions  []interfaces.Mission `json:"missions"`
	Exception string               `json:"exception"`
}
