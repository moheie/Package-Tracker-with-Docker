package database

import (
	"Package-Tracker/models"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"os"
)

var DB *gorm.DB

func ConnectDB() {
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		panic("No database URL provided")
	} else {
		println("Database URL: ", dsn)
	}
	DB, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("Failed to connect to database" + err.Error() + " \n dsn = " + dsn)
	}

	DB.AutoMigrate(&models.User{}, &models.Order{}, &models.Item{})
}
