package handlers

import (
	"Package-Tracker/database"
	"Package-Tracker/models"
	"encoding/json"
	"log"
	"net/http"
)

func IsSeller(req *http.Request) bool {
	id, err := GetIDFromToken(req)
	if err != nil {
		panic(err)
	}
	role, err := GetRoleFromID(id)
	if err != nil {
		panic(err)
	}
	if role == "seller" {
		return true
	}
	return false
}

func CreateOrder(writer http.ResponseWriter, req *http.Request) {
	if !IsSeller(req) {
		http.Error(writer, "Unauthorized", http.StatusUnauthorized)
		return
	}
	var order models.Order
	err := json.NewDecoder(req.Body).Decode(&order)
	if err != nil {
		http.Error(writer, "Invalid request payload", http.StatusBadRequest)
		return
	}
	if order.DropOffLocation == "" {
		http.Error(writer, "Drop off location is required", http.StatusBadRequest)
		return
	}
	if order.PickupLocation == "" {
		http.Error(writer, "Pickup location is required", http.StatusBadRequest)
		return
	}

	if len(order.Items) == 0 {
		http.Error(writer, "at least 1 item is needed", http.StatusBadRequest)
		return
	}
	// ------------------------------------
	for i := 0; i < len(order.Items); i++ {
		// check if item exists in items table
		var item models.Item
		if err := database.DB.Where("id = ?", order.Items[i].ID).First(&item).Error; err != nil {
			http.Error(writer, "Item(s) does not exist", http.StatusBadRequest)
			return
		}
	}

	// ------------------------------------
	if order.DeliveryTime == "" {
		http.Error(writer, "Delivery time is required", http.StatusBadRequest)
		return
	}

	// --------------------------------------------------

	// get id from token
	id, err := GetIDFromToken(req)
	if err != nil {
		http.Error(writer, "Could not get user ID "+err.Error(), http.StatusInternalServerError)
		return
	}
	order.SellerID = id

	// --------------------------------------------------
	// save the order
	if err := database.DB.Create(&order).Error; err != nil {
		http.Error(writer, "Could not create order", http.StatusInternalServerError)
		return
	}

	writer.WriteHeader(http.StatusCreated)
	json.NewEncoder(writer).Encode(order)
}

func GetUserOrders(writer http.ResponseWriter, req *http.Request) {
	if !IsSeller(req) {
		http.Error(writer, "Unauthorized", http.StatusUnauthorized)
		return
	}

	id, err := GetIDFromToken(req)
	if err != nil {
		http.Error(writer, "Could not get user ID "+err.Error(), http.StatusInternalServerError)
		return
	}

	var orders []models.Order
	if err := database.DB.Where("seller_id = ?", id).Preload("Items").Find(&orders).Error; err != nil {
		http.Error(writer, "Could not get orders "+err.Error(), http.StatusInternalServerError)
		return
	}

	type OrderSummary struct {
		ID        int64  `json:"order_id"`
		UserID    int    `json:"seller_id"`
		CourierID *int   `json:"courier_id"`
		Status    string `json:"status"`
		Number    int    `json:"number_of_items"`
	}

	if len(orders) == 0 {
		writer.WriteHeader(http.StatusOK)
		json.NewEncoder(writer).Encode("No orders found")
		return
	}

	var orderSummaries []OrderSummary
	for _, order := range orders {
		orderSummaries = append(orderSummaries, OrderSummary{
			ID:        int64(order.ID),
			UserID:    order.SellerID,
			CourierID: order.CourierID,
			Status:    order.Status,
			Number:    len(order.Items),
		})
	}

	writer.Header().Set("Content-Type", "application/json")
	writer.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(writer).Encode(orderSummaries); err != nil {
		http.Error(writer, "Could not encode response "+err.Error(), http.StatusInternalServerError)
	}
}

func ViewUserOrderDetails(writer http.ResponseWriter, req *http.Request) {
	if !IsSeller(req) {
		http.Error(writer, "Unauthorized", http.StatusUnauthorized)
		return
	}
	id, err := GetIDFromToken(req)
	if err != nil {
		http.Error(writer, "Could not get user ID "+err.Error(), http.StatusInternalServerError)
		log.Printf("Error getting user ID from token: %v", err)
		return
	}

	var order models.Order
	orderID := req.URL.Query().Get("id")
	if orderID == "" {
		http.Error(writer, "Order ID is required", http.StatusBadRequest)
		return
	}

	if err := database.DB.Where("id = ? AND seller_id = ?", orderID, id).Preload("Items").First(&order).Error; err != nil {
		http.Error(writer, "Could not get order", http.StatusInternalServerError)
		log.Printf("Error fetching order: %v", err)
		return
	}

	json.NewEncoder(writer).Encode(order)
}
