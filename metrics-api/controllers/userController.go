package controllers

import (
	"log"
	"net/http"
	"strings"

	"github.com/erneap/metrics-api/middleware"
	"github.com/erneap/metrics-api/models/interfaces"
	"github.com/erneap/metrics-api/models/web"
	"github.com/erneap/metrics-api/services"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func Login(c *gin.Context) {
	var data web.AuthenticationRequest

	if err := c.ShouldBindJSON(&data); err != nil {
		c.JSON(http.StatusBadRequest,
			web.AuthenticationResponse{User: &interfaces.User{},
				Token: "", Exception: "Trouble with request"})
		return
	}

	user, err := services.GetUserByEmail(data.EmailAddress)
	if err != nil {
		c.JSON(http.StatusNotFound,
			web.AuthenticationResponse{User: &interfaces.User{},
				Token: "", Exception: "User not found"})
		return
	}
	if err := user.Authenticate(data.Password); err != nil {
		exception := err.Error()
		err := services.UpdateUser(*user)
		if err != nil {
			c.JSON(http.StatusNotFound,
				web.AuthenticationResponse{User: &interfaces.User{},
					Token: "", Exception: "Problem Updating Database"})
			return
		}
		c.JSON(http.StatusUnauthorized,
			web.AuthenticationResponse{User: &interfaces.User{},
				Token: "", Exception: exception})
		return
	}
	err = services.UpdateUser(*user)
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusNotFound,
			web.AuthenticationResponse{User: &interfaces.User{},
				Token: "", Exception: "Problem Updating Database"})
		return
	}

	// create token
	tokenString, err := middleware.CreateToken(user.ID, user.EmailAddress)
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusNotFound,
			web.AuthenticationResponse{User: &interfaces.User{},
				Token: "", Exception: "Problem creating JWT Token"})
		return
	}

	c.JSON(http.StatusOK, web.AuthenticationResponse{User: user,
		Token: tokenString, Exception: ""})
}

// this function will be used to update a user's password at their request
func ChangePassword(c *gin.Context) {
	var data web.ChangePasswordRequest

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

	err = user.SetPassword(data.Password)
	if err != nil {
		c.JSON(http.StatusBadRequest,
			web.AuthenticationResponse{User: &interfaces.User{},
				Token: "", Exception: err.Error()})
		return
	}

	err = services.UpdateUser(*user)
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusNotFound,
			web.AuthenticationResponse{User: &interfaces.User{},
				Token: "", Exception: "Problem Updating Database"})
		return
	}
	c.JSON(http.StatusOK, web.Message{Message: "Password Changed"})
}

func ChangeUser(c *gin.Context) {
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
