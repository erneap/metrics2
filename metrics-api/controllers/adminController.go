package controllers

import (
	"context"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/erneap/metrics-api/middleware"
	"github.com/erneap/metrics-api/models/config"
	"github.com/erneap/metrics-api/models/interfaces"
	"github.com/erneap/metrics-api/models/web"
	"github.com/erneap/metrics-api/services"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func GetAllUsers(c *gin.Context) {
	var users []interfaces.User

	tUsers, err := services.GetUsers()
	if err != nil {
		c.JSON(http.StatusBadRequest, web.Message{Message: err.Error()})
		return
	}

	for _, user := range tUsers {
		badd := false
		for _, wg := range user.Workgroups {
			if strings.Contains(strings.ToLower(wg), "metrics") {
				badd = true
			}
		}
		if badd {
			users = append(users, user)
		}
	}

	c.JSON(http.StatusOK, users)
}

func GetUser(c *gin.Context) {
	id := c.Param("id")
	oId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, web.Message{Message: err.Error()})
		return
	}

	user := services.GetUser(oId)

	c.JSON(http.StatusOK, user)
}

func CreateUser(c *gin.Context) {
	var data web.CreateUser

	if err := c.ShouldBindJSON(&data); err != nil {
		c.JSON(http.StatusBadRequest,
			web.Message{Message: "Trouble with request"})
		return
	}

	user := services.CreateUser(data.EmailAddress, data.FirstName,
		data.MiddleName, data.LastName, data.Password)
	for _, wg := range data.Workgroups {
		if strings.Contains(wg, "-") {
			parts := strings.Split(wg, "-")
			if !user.IsInGroup(parts[0], parts[1]) {
				user.Workgroups = append(user.Workgroups, wg)
			}
		} else {
			if !user.IsInGroup("metrics", wg) {
				ngp := "metrics-" + wg
				user.Workgroups = append(user.Workgroups, ngp)
			}
		}
	}
	services.UpdateUser(*user)
	c.JSON(http.StatusOK, user)
}

func UpdateUser(c *gin.Context) {
	var data web.UpdateRequest

	if err := c.ShouldBindJSON(&data); err != nil {
		c.JSON(http.StatusBadRequest,
			web.AuthenticationResponse{User: &interfaces.User{},
				Token: "", Exception: "Trouble with request"})
		return
	}

	id, err := primitive.ObjectIDFromHex(data.ID)
	if err != nil {
		c.JSON(http.StatusBadRequest,
			web.AuthenticationResponse{User: &interfaces.User{},
				Token: "", Exception: "Couldn't convert to ObjectID"})
		return
	}
	user := services.GetUser(id)

	switch strings.ToLower(data.Field) {
	case "email", "emailaddress":
		user.EmailAddress = data.StringValue()
	case "first", "firstname":
		user.FirstName = data.StringValue()
	case "middle", "middlename":
		user.MiddleName = data.StringValue()
	case "last", "lastname":
		user.LastName = data.StringValue()
	case "password":
		user.SetPassword(data.StringValue())
	case "unlock":
		user.BadAttempts = 0
	case "addgroup":
		wg := data.StringValue()
		if strings.Contains(wg, "-") {
			parts := strings.Split(wg, "-")
			if !user.IsInGroup(parts[0], parts[1]) {
				user.Workgroups = append(user.Workgroups, wg)
			}
		} else {
			if !user.IsInGroup("metrics", wg) {
				user.Workgroups = append(user.Workgroups, "metrics-"+wg)
			}
		}
	case "removegroup":
		wg := data.StringValue()
		replace := -1
		if !strings.Contains(wg, "-") {
			wg = "metrics-" + wg
		}
		for i, gp := range user.Workgroups {
			if strings.EqualFold(gp, wg) {
				replace = i
			}
		}
		if replace >= 0 {
			user.Workgroups = append(user.Workgroups[:replace],
				user.Workgroups[replace+1:]...)
		}
	}

	err = services.UpdateUser(*user)
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusNotFound,
			web.AuthenticationResponse{User: &interfaces.User{},
				Token: "", Exception: "Problem Updating Database"})
		return
	}
	tokenString, _ := middleware.CreateToken(user.ID, user.EmailAddress)
	c.JSON(http.StatusOK, web.AuthenticationResponse{
		User: user, Token: tokenString, Exception: ""})
}

func DeleteUser(c *gin.Context) {
	id := c.Param("id")
	oId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, web.Message{Message: err.Error()})
		return
	}

	err = services.DeleteUser(oId)
	if err != nil {
		c.JSON(http.StatusBadRequest, web.Message{Message: err.Error()})
		return
	}
	c.JSON(http.StatusOK, web.Message{Message: "User Deleted"})
}

// methods for purging old mission and outage data
func PurgeMissions(c *gin.Context) {
	mDate := c.Param("msndate")
	msndate, err := time.ParseInLocation("2006-01-02", mDate, time.UTC)
	if err != nil {
		c.JSON(http.StatusBadRequest, web.Message{Message: "Problem with purge date: " + err.Error()})
		return
	}
	filter := bson.M{"missionDate": bson.M{"$lt": msndate}}
	_, err = config.GetCollection(config.DB, "metrics", "missions").DeleteMany(
		context.TODO(), filter)
	if err != nil {
		c.JSON(http.StatusBadRequest, web.Message{Message: "Problem Purging Records: " +
			err.Error()})
		return
	}
	c.JSON(http.StatusOK, web.Message{Message: "Mission Purge complete"})
}

func PurgeOutages(c *gin.Context) {
	mDate := c.Param("msndate")
	msndate, err := time.ParseInLocation("2006-01-02", mDate, time.UTC)
	if err != nil {
		c.JSON(http.StatusBadRequest, web.Message{Message: "Problem with purge date: " + err.Error()})
		return
	}
	filter := bson.M{"missionDate": bson.M{"$lt": msndate}}
	_, err = config.GetCollection(config.DB, "metrics", "groundoutages").DeleteMany(
		context.TODO(), filter)
	if err != nil {
		c.JSON(http.StatusBadRequest, web.Message{Message: "Problem Purging Records: " +
			err.Error()})
		return
	}
	c.JSON(http.StatusOK, web.Message{Message: "Ground Outage Purge complete"})
}
