package main

import (
	"github.com/erneap/metrics-api/controllers"
	"github.com/erneap/metrics-api/middleware"
	"github.com/erneap/metrics-api/models/config"
	"github.com/gin-gonic/gin"
)

func main() {
	// run database
	config.ConnectDB()

	// add routes
	router := gin.Default()
	api := router.Group("/metrics/api/v1")
	{
		api.GET("/system", controllers.GetSystemInfo)
		users := api.Group("/user")
		{
			users.POST("/login", controllers.Login)
			users.PUT("/password", middleware.CheckJWT(), controllers.ChangePassword)
			users.PUT("/changes", middleware.CheckJWT(), controllers.ChangeUser)
		}
		msns := api.Group("/missions")
		{
			msns.GET("/:msndate", middleware.CheckJWT(),
				controllers.GetMissionsByDate)
			msns.GET("/:msndate/:platform", middleware.CheckJWT(),
				controllers.GetMissionsByDateAndPlatform)
			msns.GET("/:msndate/:platform/:sortie", middleware.CheckJWT(),
				controllers.GetMissionByDatePlatformAndSortie)
		}
		msn := api.Group("/mission")
		{
			msn.GET("/:id", middleware.CheckJWT(), controllers.GetMissionByID)
			msn.GET("/dates/:startdate/:enddate", middleware.CheckJWT(),
				controllers.GetMissionsByDates)
			msn.POST("/", middleware.CheckJWT(), controllers.CreateMission)
			msn.PUT("/", middleware.CheckJWT(), controllers.UpdateMission)
			msn.PUT("/sensor", middleware.CheckJWT(), controllers.UpdateMissionSensor)
			msn.PUT("/sensor/image", middleware.CheckJWT(),
				controllers.UpdateMissionSensorImages)
			msn.DELETE("/:id", middleware.CheckJWT(), controllers.DeleteMission)
		}
		outages := api.Group("/outage")
		{
			outages.GET("/", middleware.CheckJWT(), controllers.GetAllOutages)
			outages.GET("/bydate/:date", middleware.CheckJWT(),
				controllers.GetAllOutagesByDate)
			outages.GET("/byweek/:start", middleware.CheckJWT(),
				controllers.GetAllOutagesByWeek)
			outages.GET("/byperiod/:start/:end", middleware.CheckJWT(),
				controllers.GetAllOutagesByPeriod)
			outages.GET("/bysystem/:system", middleware.CheckJWT(),
				controllers.GetAllOutagesBySystem)
			outages.GET("/:id", middleware.CheckJWT(), controllers.GetOutage)
			outages.POST("/", middleware.CheckJWT(), controllers.CreateOutage)
			outages.PUT("/", middleware.CheckJWT(), controllers.UpdateOutage)
			outages.DELETE("/:id", middleware.CheckJWT(), controllers.DeleteOutage)
		}
		admin := api.Group("/admin").Use(middleware.CheckJWT()).
			Use(middleware.CheckRole("metrics", "ADMIN"))
		{
			admin.GET("/", controllers.GetAllUsers)
			admin.GET("/:id", controllers.GetUser)
			admin.POST("/", controllers.CreateUser)
			admin.PUT("/", controllers.UpdateUser)
			admin.DELETE("/user/:id", controllers.DeleteUser)
			admin.DELETE("/missions/:msndate", controllers.PurgeMissions)
			admin.DELETE("/outages/:msndate", controllers.PurgeOutages)
		}
		api.POST("/reports", middleware.CheckJWT(), controllers.CreateReport)
	}

	// listen on port 3000
	router.Run(":3000")
}
