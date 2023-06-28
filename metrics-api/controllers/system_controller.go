package controllers

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
	"os"

	systemdata "github.com/erneap/metrics-api/models/systemData"
	"github.com/gin-gonic/gin"
)

func GetSystemInfo(c *gin.Context) {
	jsonFile, err := os.Open("initial.json")
	if err != nil {
		log.Println(err)
	}

	log.Println("Opened Initial Data JSON File")
	defer jsonFile.Close()

	// read all the data of the jsonFile into a byteArray
	byteArray, err := ioutil.ReadAll(jsonFile)
	if err != nil {
		log.Println(err)
	}
	jsonString := string(byteArray)

	// set a variable for the system info
	var systemInfo systemdata.SystemInfo

	// unmarshall the json data into the system info struct
	err = json.Unmarshal([]byte(jsonString), &systemInfo)
	if err != nil {
		log.Println(err)
	}

	c.JSON(http.StatusOK, systemInfo)
}
