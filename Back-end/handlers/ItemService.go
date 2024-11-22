package handlers

import (
	"Package-Tracker/database"
	"Package-Tracker/models"
	"encoding/json"
	"net/http"
)

// Get all items
func ViewItems(writer http.ResponseWriter, req *http.Request) {
	var items []models.Item
	if err := database.DB.Find(&items).Error; err != nil {
		http.Error(writer, "Could not get items "+err.Error(), http.StatusInternalServerError)
		return
	}
	json.NewEncoder(writer).Encode(items)
}
