package controllers

import (
	"context"
	"log"
	"net/http"
	"sort"
	"strconv"
	"strings"
	"time"

	"github.com/erneap/metrics-api/middleware"
	"github.com/erneap/metrics-api/models/config"
	"github.com/erneap/metrics-api/models/interfaces"
	systemdata "github.com/erneap/metrics-api/models/systemData"
	"github.com/erneap/metrics-api/models/web"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func GetMissionsByDate(c *gin.Context) {
	msnDate := c.Param("msndate")

	var tmissions []interfaces.Mission

	startDate, err := time.ParseInLocation("2006-01-02", msnDate, time.UTC)
	if err != nil {
		c.JSON(http.StatusBadRequest, web.MissionResponse{Missions: tmissions,
			Exception: err.Error()})
		return
	}
	endDate := startDate.Add(24 * time.Hour)

	filter := bson.M{"missionDate": bson.M{"$gte": startDate, "$lt": endDate}}
	cursor, err := config.GetCollection(config.DB, "metrics", "missions").Find(context.TODO(),
		filter)
	if err != nil {
		c.JSON(http.StatusNotFound, web.MissionResponse{Missions: tmissions,
			Exception: err.Error()})
		return
	}

	if err = cursor.All(context.TODO(), &tmissions); err != nil {
		c.JSON(http.StatusNotFound, web.MissionResponse{Missions: tmissions,
			Exception: err.Error()})
		return
	}

	var missions []interfaces.Mission

	for _, msn := range tmissions {
		msn.Decrypt()
		missions = append(missions, msn)
	}
	c.JSON(http.StatusOK, web.MissionResponse{Missions: missions, Exception: ""})
}

func GetMissionsByDates(c *gin.Context) {
	sDate := c.Param("startdate")
	eDate := c.Param("enddate")

	var tmissions []interfaces.Mission

	startDate, err := time.ParseInLocation("2006-01-02", sDate, time.UTC)
	if err != nil {
		c.JSON(http.StatusBadRequest, web.MissionResponse{Missions: tmissions,
			Exception: err.Error()})
		return
	}
	endDate, err := time.ParseInLocation("2006-01-02", eDate, time.UTC)
	if err != nil {
		c.JSON(http.StatusBadRequest, web.MissionResponse{Missions: tmissions,
			Exception: err.Error()})
		return
	}
	endDate = endDate.AddDate(0, 0, 1)

	filter := bson.M{"missionDate": bson.M{"$gte": startDate, "$lt": endDate}}
	cursor, err := config.GetCollection(config.DB, "metrics", "missions").Find(context.TODO(),
		filter)
	if err != nil {
		c.JSON(http.StatusNotFound, web.MissionResponse{Missions: tmissions,
			Exception: err.Error()})
		return
	}

	if err = cursor.All(context.TODO(), &tmissions); err != nil {
		c.JSON(http.StatusNotFound, web.MissionResponse{Missions: tmissions,
			Exception: err.Error()})
		return
	}

	var missions []interfaces.Mission

	for _, msn := range tmissions {
		msn.Decrypt()
		missions = append(missions, msn)
	}

	c.JSON(http.StatusOK, web.MissionResponse{Missions: missions, Exception: ""})
}

func GetMissionsByDateAndPlatform(c *gin.Context) {
	msnDate := c.Param("msndate")
	platform := c.Param("platform")

	var tmissions []interfaces.Mission

	startDate, err := time.ParseInLocation("2006-01-02", msnDate, time.UTC)
	if err != nil {
		c.JSON(http.StatusBadRequest, web.MissionResponse{Missions: tmissions,
			Exception: err.Error()})
		return
	}
	endDate := startDate.Add(24 * time.Hour)

	filter := bson.M{"missionDate": bson.M{"$gte": startDate, "$lt": endDate},
		"platformID": platform}
	cursor, err := config.GetCollection(config.DB, "metrics", "missions").Find(context.TODO(),
		filter)
	if err != nil {
		c.JSON(http.StatusNotFound, web.MissionResponse{Missions: tmissions,
			Exception: err.Error()})
		return
	}

	if err = cursor.All(context.TODO(), &tmissions); err != nil {
		c.JSON(http.StatusNotFound, web.MissionResponse{Missions: tmissions,
			Exception: err.Error()})
		return
	}

	var missions []interfaces.Mission

	for _, msn := range tmissions {
		msn.Decrypt()
		missions = append(missions, msn)
	}
	c.JSON(http.StatusOK, web.MissionResponse{Missions: missions, Exception: ""})
}

func GetMissionByDatePlatformAndSortie(c *gin.Context) {
	msnDate := c.Param("msndate")
	platform := c.Param("platform")
	tsortie, _ := strconv.ParseUint(c.Param("sortie"), 10, 32)
	sortie := uint(tsortie)

	var mission interfaces.Mission

	startDate, err := time.ParseInLocation("2006-01-02", msnDate, time.UTC)
	if err != nil {
		c.JSON(http.StatusBadRequest, web.Message{Message: err.Error()})
		return
	}
	endDate := startDate.Add(24 * time.Hour)

	log.Println(startDate)
	log.Println(endDate)

	filter := bson.M{"missionDate": bson.M{"$gte": startDate, "$lt": endDate},
		"platformID": platform, "sortieID": sortie}
	err = config.GetCollection(config.DB, "metrics", "missions").FindOne(context.TODO(),
		filter).Decode(&mission)
	if err != nil {
		c.JSON(http.StatusNotFound, web.Message{Message: err.Error()})
		return
	}
	mission.Decrypt()
	c.JSON(http.StatusOK, mission)
}

func GetMissionByID(c *gin.Context) {
	id := c.Param("id")
	oID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, web.Message{Message: err.Error()})
		return
	}

	var mission interfaces.Mission

	filter := bson.M{"_id": oID}
	err = config.GetCollection(config.DB, "metrics", "missions").FindOne(context.TODO(),
		filter).Decode(&mission)
	if err != nil {
		c.JSON(http.StatusNotFound, web.Message{Message: err.Error()})
		return
	}
	mission.Decrypt()
	c.JSON(http.StatusOK, mission)
}

func CreateMission(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	var data web.CreateMission
	defer cancel()

	if err := c.ShouldBindJSON(&data); err != nil {
		c.JSON(http.StatusBadRequest,
			web.Message{Message: "Trouble with request"})
		return
	}

	msn := interfaces.Mission{
		ID:          primitive.NewObjectID(),
		MissionDate: data.MissionDate,
		PlatformID:  data.PlatformID,
		SortieID:    data.SortieID,
		MissionData: &interfaces.MissionData{
			Exploitation:   data.Exploitation,
			PrimaryDCGS:    data.PrimaryDCGS,
			Communications: data.Communications,
			TailNumber:     data.TailNumber,
			MissionOverlap: data.Overlap,
			Executed:       data.Executed,
			Aborted:        data.Aborted,
			Cancelled:      data.Cancelled,
			IndefDelay:     data.IndefDelay,
		},
	}

	initial := middleware.InitialData()
	for _, plat := range initial.Platforms {
		if strings.EqualFold(plat.ID, data.PlatformID) {
			for _, sen := range data.Sensors {
				sensor := interfaces.MissionSensor{
					SensorID: sen,
				}
				for _, pSen := range plat.Sensors {
					if strings.EqualFold(sen, pSen.ID) {
						for _, exp := range pSen.Exploitations {
							log.Printf("PSen: %s - Data: %s\n", exp.Exploitation, data.Exploitation)
							if strings.Contains(strings.ToLower(exp.Exploitation), strings.ToLower(data.Exploitation)) {
								log.Println(pSen.GeneralType)
								sensor.SensorType = pSen.GeneralType
								sensor.SortID = pSen.SortID
								sensor.SensorOutage = interfaces.MissionSensorOutage{}
								sensor.GroundOutage = 0
								sensor.PreflightMinutes = exp.StandardTimes.PreflightMinutes
								sensor.ScheduledMinutes = exp.StandardTimes.ScheduledMinutes
								sensor.PostflightMinutes = exp.StandardTimes.PostflightMinutes
							}
						}
						for _, img := range pSen.ImageTypes {
							imgType := systemdata.ImageType{
								ID:     img.ID,
								SortID: img.SortID,
							}
							if len(img.Subtypes) > 0 {
								for _, sImg := range img.Subtypes {
									sImgType := systemdata.ImageType{
										ID:     sImg.ID,
										SortID: sImg.SortID,
									}
									imgType.Subtypes = append(imgType.Subtypes, sImgType)
								}
							}
							sensor.Images = append(sensor.Images, imgType)
						}
					}
				}
				msn.MissionData.Sensors = append(msn.MissionData.Sensors, sensor)
			}
		}
	}
	msn.Encrypt()
	_, err := config.GetCollection(config.DB, "metrics", "missions").InsertOne(ctx, msn)
	if err != nil {
		c.JSON(http.StatusNotModified, web.Message{Message: err.Error()})
	}

	c.JSON(http.StatusCreated, msn)
}

func UpdateMission(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	var data web.UpdateMission
	defer cancel()

	if err := c.ShouldBindJSON(&data); err != nil {
		c.JSON(http.StatusBadRequest,
			web.Message{Message: "Trouble with request"})
		return
	}

	id, err := primitive.ObjectIDFromHex(data.ID)
	if err != nil {
		c.JSON(http.StatusBadRequest, web.Message{Message: "Trouble created object ID"})
		return
	}

	filter := bson.M{"_id": id}
	var mission interfaces.Mission
	err = config.GetCollection(config.DB, "metrics", "missions").FindOne(ctx, filter).
		Decode(&mission)
	if err != nil {
		c.JSON(http.StatusNotFound, web.Message{Message: err.Error()})
		return
	}
	mission.Decrypt()

	switch strings.ToLower(data.Field) {
	case "msndate", "missiondate":
		mission.MissionDate = data.DateValue()
	case "platform", "platformid":
		mission.PlatformID = data.StringValue()
	case "sortie", "sortieid":
		mission.SortieID = data.NumberValue()
	case "exploitation":
		mission.MissionData.Exploitation = data.StringValue()
		resetSensorList(&mission)
	case "dcgs", "primary", "primarydcgs":
		mission.MissionData.PrimaryDCGS = data.StringValue()
	case "communications":
		mission.MissionData.Communications = data.StringValue()
	case "tail", "tailno", "tailnumber":
		mission.MissionData.TailNumber = data.StringValue()
	case "overlap", "msnoverlap", "missionoverlap":
		mission.MissionData.MissionOverlap = data.NumberValue()
	case "comments":
		mission.MissionData.Comments = data.StringValue()
	case "isexecuted":
		switch strings.ToLower(data.StringValue()) {
		case "executed":
			mission.MissionData.Executed = true
			mission.MissionData.Cancelled = false
			mission.MissionData.Aborted = false
			mission.MissionData.IndefDelay = false
		case "cancelled":
			mission.MissionData.Executed = false
			mission.MissionData.Cancelled = true
			mission.MissionData.Aborted = false
			mission.MissionData.IndefDelay = false
		case "aborted":
			mission.MissionData.Executed = false
			mission.MissionData.Cancelled = false
			mission.MissionData.Aborted = true
			mission.MissionData.IndefDelay = false
		case "indefdelay":
			mission.MissionData.Executed = false
			mission.MissionData.Cancelled = false
			mission.MissionData.Aborted = false
			mission.MissionData.IndefDelay = true
		default:
			mission.MissionData.Executed = false
			mission.MissionData.Cancelled = false
			mission.MissionData.Aborted = false
			mission.MissionData.IndefDelay = false
		}
	case "aborted":
		mission.MissionData.Aborted = data.BooleanValue()
	case "indef", "indefdelay":
		mission.MissionData.IndefDelay = data.BooleanValue()
	case "change", "changesensor", "changeimint", "changeimintsensor", "imintsensor":
		found := false
		for pos := 0; pos < len(mission.MissionData.Sensors) && !found; pos++ {
			sen := mission.MissionData.Sensors[pos]
			if sen.SensorType == systemdata.GEOINT {
				found = true
				mission.MissionData.Sensors = append(mission.MissionData.Sensors[:pos],
					mission.MissionData.Sensors[pos+1:]...)
			}
		}
		for _, plat := range middleware.InitialData().Platforms {
			if strings.EqualFold(plat.ID, mission.PlatformID) {
				for _, pSen := range plat.Sensors {
					if pSen.GeneralType == systemdata.GEOINT &&
						strings.EqualFold(pSen.ID, data.StringValue()) {
						for _, exp := range pSen.Exploitations {
							if strings.Contains(strings.ToLower(exp.Exploitation),
								strings.ToLower(mission.MissionData.Exploitation)) {
								sensor := interfaces.MissionSensor{
									SensorID:          pSen.ID,
									SensorType:        pSen.GeneralType,
									PreflightMinutes:  exp.StandardTimes.PreflightMinutes,
									ScheduledMinutes:  exp.StandardTimes.ScheduledMinutes,
									PostflightMinutes: exp.StandardTimes.PostflightMinutes,
									ExecutedMinutes:   0,
									AdditionalMinutes: 0,
									FinalCode:         0,
									KitNumber:         "",
									SensorOutage: interfaces.MissionSensorOutage{
										TotalOutageMinutes:     0,
										PartialLBOutageMinutes: 0,
										PartialHBOutageMinutes: 0,
									},
									GroundOutage: 0,
									HasHap:       false,
									TowerID:      0,
									SortID:       pSen.SortID,
									Comments:     "",
								}
								if len(pSen.ImageTypes) > 0 {
									for _, img := range pSen.ImageTypes {
										imgType := systemdata.ImageType{
											ID:     img.ID,
											SortID: img.SortID,
										}
										if len(img.Subtypes) > 0 {
											for _, sImg := range img.Subtypes {
												sType := systemdata.ImageType{
													ID:     sImg.ID,
													SortID: sImg.SortID,
												}
												imgType.Subtypes = append(imgType.Subtypes, sType)
											}
										}
										sensor.Images = append(sensor.Images, imgType)
									}
								}
								mission.MissionData.Sensors = append(mission.MissionData.Sensors,
									sensor)
								sort.Sort(interfaces.ByMissionSensor(mission.MissionData.Sensors))
							}
						}
					}
				}
			}
		}
	default:
		c.JSON(http.StatusBadRequest, web.Message{Message: "Unknown Field"})
		return
	}
	mission.Encrypt()
	_, err = config.GetCollection(config.DB, "metrics", "missions").ReplaceOne(ctx,
		filter, mission)
	if err != nil {
		c.JSON(http.StatusBadRequest, web.Message{Message: err.Error()})
		return
	}
	c.JSON(http.StatusOK, mission)
}

func resetSensorList(mission *interfaces.Mission) {
	var newSensorList []interfaces.MissionSensor
	if len(mission.MissionData.Sensors) > 0 {
		// look for GEOINT sensor and copy over to new slice
		imintSensor := false
		for _, sen := range mission.MissionData.Sensors {
			if sen.SensorType == systemdata.GEOINT && !imintSensor {
				newSensorList = append(newSensorList, sen)
				imintSensor = true
			}
		}

		for _, plat := range middleware.InitialData().Platforms {
			if strings.EqualFold(mission.PlatformID, plat.ID) {
				for _, pSen := range plat.Sensors {
					for _, exp := range pSen.Exploitations {
						if strings.Contains(strings.ToLower(exp.Exploitation),
							strings.ToLower(mission.MissionData.Exploitation)) {
							if pSen.GeneralType == systemdata.GEOINT {
								if !imintSensor {
									sensor := interfaces.MissionSensor{
										SensorID:          pSen.ID,
										SensorType:        pSen.GeneralType,
										PreflightMinutes:  exp.StandardTimes.PreflightMinutes,
										ScheduledMinutes:  exp.StandardTimes.ScheduledMinutes,
										PostflightMinutes: exp.StandardTimes.PostflightMinutes,
										ExecutedMinutes:   0,
										AdditionalMinutes: 0,
										FinalCode:         0,
										KitNumber:         "",
										SensorOutage: interfaces.MissionSensorOutage{
											TotalOutageMinutes:     0,
											PartialLBOutageMinutes: 0,
											PartialHBOutageMinutes: 0,
										},
										GroundOutage: 0,
										HasHap:       false,
										TowerID:      0,
										SortID:       pSen.SortID,
										Comments:     "",
									}
									if len(pSen.ImageTypes) > 0 {
										for _, img := range pSen.ImageTypes {
											imgType := systemdata.ImageType{
												ID:     img.ID,
												SortID: img.SortID,
											}
											if len(img.Subtypes) > 0 {
												for _, sImg := range img.Subtypes {
													sType := systemdata.ImageType{
														ID:     sImg.ID,
														SortID: sImg.SortID,
													}
													imgType.Subtypes = append(imgType.Subtypes, sType)
												}
											}
											sensor.Images = append(sensor.Images, imgType)
										}
									}
									newSensorList = append(newSensorList, sensor)
								}
							} else {
								sensor := interfaces.MissionSensor{
									SensorID:          pSen.ID,
									SensorType:        pSen.GeneralType,
									PreflightMinutes:  exp.StandardTimes.PreflightMinutes,
									ScheduledMinutes:  exp.StandardTimes.ScheduledMinutes,
									PostflightMinutes: exp.StandardTimes.PostflightMinutes,
									ExecutedMinutes:   0,
									AdditionalMinutes: 0,
									FinalCode:         0,
									KitNumber:         "",
									SensorOutage: interfaces.MissionSensorOutage{
										TotalOutageMinutes:     0,
										PartialLBOutageMinutes: 0,
										PartialHBOutageMinutes: 0,
									},
									GroundOutage: 0,
									HasHap:       false,
									TowerID:      0,
									SortID:       pSen.SortID,
									Comments:     "",
								}
								newSensorList = append(newSensorList, sensor)
							}
						}
					}
				}
			}
		}
	}
	sort.Sort(interfaces.ByMissionSensor(newSensorList))
	mission.MissionData.Sensors = nil
	mission.MissionData.Sensors = newSensorList

}

func UpdateMissionSensor(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	var data web.UpdateMission
	defer cancel()

	if err := c.ShouldBindJSON(&data); err != nil {
		c.JSON(http.StatusBadRequest,
			web.Message{Message: "Trouble with request"})
		return
	}

	id, err := primitive.ObjectIDFromHex(data.ID)
	if err != nil {
		c.JSON(http.StatusBadRequest, web.Message{Message: "Trouble created object ID"})
		return
	}

	filter := bson.M{"_id": id}
	var mission interfaces.Mission
	err = config.GetCollection(config.DB, "metrics", "missions").FindOne(ctx, filter).
		Decode(&mission)
	if err != nil {
		c.JSON(http.StatusNotFound, web.Message{Message: err.Error()})
		return
	}
	mission.Decrypt()

	for pos, sen := range mission.MissionData.Sensors {
		if strings.EqualFold(sen.SensorID, data.SensorID) {
			switch strings.ToLower(data.Field) {
			case "preflight", "preflightminutes", "premission":
				sen.PreflightMinutes = data.NumberValue()
			case "scheduled", "scheduledminutes":
				sen.ScheduledMinutes = data.NumberValue()
			case "executed", "executedminutes":
				sen.ExecutedMinutes = data.NumberValue()
			case "postflight", "postflightminutes", "postmission":
				sen.PostflightMinutes = data.NumberValue()
			case "additional", "additionalminutes":
				sen.AdditionalMinutes = data.NumberValue()
			case "final", "code", "finalcode":
				sen.FinalCode = data.NumberValue()
			case "kit", "kitnumber":
				log.Println(data.StringValue())
				sen.KitNumber = data.StringValue()
			case "sensor", "sensortotal", "sensorout":
				sen.SensorOutage.TotalOutageMinutes = data.NumberValue()
			case "hb", "partialhb":
				sen.SensorOutage.PartialHBOutageMinutes = data.NumberValue()
			case "lb", "partiallb":
				sen.SensorOutage.PartialLBOutageMinutes = data.NumberValue()
			case "ground", "groundtotal", "groundout":
				sen.GroundOutage = data.NumberValue()
			case "tower", "towerid":
				sen.TowerID = data.NumberValue()
			case "comments", "comment":
				sen.Comments = data.StringValue()
			case "hap", "hashap":
				sen.HasHap = data.BooleanValue()
			default:
				c.JSON(http.StatusBadRequest, web.Message{Message: "Unknown Field"})
				return
			}
			mission.MissionData.Sensors[pos] = sen
		}
	}
	mission.Encrypt()
	_, err = config.GetCollection(config.DB, "metrics", "missions").ReplaceOne(ctx,
		filter, mission)
	if err != nil {
		c.JSON(http.StatusBadRequest, web.Message{Message: err.Error()})
		return
	}
	c.JSON(http.StatusOK, mission)
}

func UpdateMissionSensorImages(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	var data web.UpdateMission
	defer cancel()

	if err := c.ShouldBindJSON(&data); err != nil {
		c.JSON(http.StatusBadRequest,
			web.Message{Message: "Trouble with request"})
		return
	}

	id, err := primitive.ObjectIDFromHex(data.ID)
	if err != nil {
		c.JSON(http.StatusBadRequest, web.Message{Message: "Trouble created object ID"})
		return
	}

	filter := bson.M{"_id": id}
	var mission interfaces.Mission
	err = config.GetCollection(config.DB, "metrics", "missions").FindOne(ctx, filter).
		Decode(&mission)
	if err != nil {
		c.JSON(http.StatusNotFound, web.Message{Message: err.Error()})
		return
	}
	mission.Decrypt()

	for _, sen := range mission.MissionData.Sensors {
		if sen.SensorID == data.SensorID {
			for _, img := range sen.Images {
				if img.ID == data.ImageTypeID {
					if data.ImageSubTypeID != "" {
						for _, stype := range img.Subtypes {
							if stype.ID == data.ImageSubTypeID {
								switch strings.ToLower(data.Field) {
								case "collected":
									stype.Collected = data.NumberValue()
								case "notcollected":
									stype.NotCollected = data.NumberValue()
								default:
									c.JSON(http.StatusBadRequest, web.Message{Message: "Unknown Field"})
									return
								}
							}
						}
					} else {
						switch strings.ToLower(data.Field) {
						case "collected":
							img.Collected = data.NumberValue()
						case "notcollected":
							img.NotCollected = data.NumberValue()
						default:
							c.JSON(http.StatusBadRequest, web.Message{Message: "Unknown Field"})
							return
						}
					}
				}
			}
		}
	}
	mission.Encrypt()
	_, err = config.GetCollection(config.DB, "metrics", "missions").ReplaceOne(ctx,
		filter, mission)
	if err != nil {
		c.JSON(http.StatusBadRequest, web.Message{Message: err.Error()})
		return
	}
	c.JSON(http.StatusOK, mission)
}

func DeleteMission(c *gin.Context) {
	id := c.Param("id")
	oId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, web.Message{Message: "Trouble created object ID"})
		return
	}

	filter := bson.M{"_id": oId}

	result, err := config.GetCollection(config.DB, "metrics", "missions").DeleteOne(
		context.TODO(), filter)
	if err != nil {
		c.JSON(http.StatusBadRequest, web.Message{Message: err.Error()})
		return
	}
	if result.DeletedCount <= 0 {
		c.JSON(http.StatusNotFound, web.Message{Message: "Mission for ID not found"})
		return
	}
	c.JSON(http.StatusOK, web.Message{Message: "Mission Deleted"})
}
