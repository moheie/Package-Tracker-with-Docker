package handlers

import (
	"Package-Tracker/database"
	"Package-Tracker/models"
	"encoding/json"
	"net/http"
	"strconv"
)

func IsAdmin(req *http.Request) bool {
	id, err := GetIDFromToken(req)
	if err != nil {
		panic(err)
	}
	role, err := GetRoleFromID(id)
	if err != nil {
		panic(err)
	}
	if role == "admin" {
		return true
	}
	return false
}

func ViewAllOrders(writer http.ResponseWriter, req *http.Request) {
	if !IsAdmin(req) {
		http.Error(writer, "Unauthorized", http.StatusUnauthorized)
		return
	}
	// Get all orders
	orders := []models.Order{}
	database.DB.Preload("Items").Find(&orders)
	json.NewEncoder(writer).Encode(orders)
}

func ViewFilteredOrder(writer http.ResponseWriter, req *http.Request) {
	if !IsAdmin(req) {
		http.Error(writer, "Unauthorized", http.StatusUnauthorized)
		return
	}

	// Get the courier_id query parameter
	courierID := req.URL.Query().Get("courier_id")

	// If courier_id is not provided, return an error
	if courierID == "" {
		http.Error(writer, "courier_id is required", http.StatusBadRequest)
		return
	}

	cid, err := strconv.Atoi(courierID)
	if err != nil {
		http.Error(writer, "Invalid courier ID", http.StatusBadRequest)
		return
	}

	// Get orders filtered by courier_id
	orders := []models.Order{}
	query := database.DB.Preload("Items").Where("courier_id = ?", cid)
	query.Find(&orders)
	json.NewEncoder(writer).Encode(orders)
}

func DeleteOrder(writer http.ResponseWriter, req *http.Request) {
	if !IsAdmin(req) && !IsSeller(req) {
		http.Error(writer, "Unauthorized", http.StatusUnauthorized)
		return
	}

	orderID := req.URL.Query().Get("id")
	if orderID == "" {
		http.Error(writer, "Order ID is required", http.StatusBadRequest)
		return
	}

	id, err := strconv.Atoi(orderID)
	if err != nil {
		http.Error(writer, "Invalid order ID", http.StatusBadRequest)
		return
	}

	// Start a transaction
	tx := database.DB.Begin()
	if tx.Error != nil {
		http.Error(writer, "Could not start transaction", http.StatusInternalServerError)
		return
	}

	// Find the order
	var order models.Order
	if err := tx.Preload("Items").First(&order, id).Error; err != nil {
		tx.Rollback()
		http.Error(writer, "Order not found", http.StatusNotFound)
		return
	}
	if order.Status != "pending" && !IsSeller(req) {
		tx.Rollback()
		http.Error(writer, "Order cannot be deleted", http.StatusBadRequest)
		return
	}

	// Clear the many-to-many relationship from the join table
	if err := tx.Model(&order).Association("Items").Clear(); err != nil {
		tx.Rollback()
		http.Error(writer, "Could not delete order items from join table", http.StatusInternalServerError)
		return
	}

	// Delete the order by ID
	if err := tx.Delete(&order).Error; err != nil {
		tx.Rollback()
		http.Error(writer, "Could not delete order", http.StatusInternalServerError)
		return
	}

	// Commit the transaction
	if err := tx.Commit().Error; err != nil {
		http.Error(writer, "Could not commit transaction", http.StatusInternalServerError)
		return
	}

	writer.WriteHeader(http.StatusOK)
	json.NewEncoder(writer).Encode(map[string]string{"message": "Order deleted successfully"})
}

func AssignOrder(writer http.ResponseWriter, req *http.Request) {
	if !IsAdmin(req) {
		http.Error(writer, "Unauthorized", http.StatusUnauthorized)
		return
	}

	orderID := req.URL.Query().Get("oid")
	courierID := req.URL.Query().Get("cid")

	if orderID == "" {
		http.Error(writer, "Order ID is required", http.StatusBadRequest)
		return
	}
	if courierID == "" {
		http.Error(writer, "Courier ID is required", http.StatusBadRequest)
		return
	}

	oid, err := strconv.Atoi(orderID)
	if err != nil {
		http.Error(writer, "Invalid order ID", http.StatusBadRequest)
		return
	}
	cid, err := strconv.Atoi(courierID)
	if err != nil {
		http.Error(writer, "Invalid courier ID", http.StatusBadRequest)
		return
	}

	// Get the courier
	var courier models.User
	if err := database.DB.First(&courier, cid).Error; err != nil {
		http.Error(writer, "Courier not found", http.StatusNotFound)
		return
	}

	// Check if the user is a courier
	if courier.Role != "courier" {
		http.Error(writer, "User is not a courier", http.StatusBadRequest)
		return
	}

	// Get the order
	var order models.Order
	if err := database.DB.First(&order, oid).Error; err != nil {
		http.Error(writer, "Order not found", http.StatusNotFound)
		return
	}

	// Assign the order to the courier
	order.CourierID = &cid
	if order.Status != "pending" {
		order.Status = "pending"
	}
	if err := database.DB.Save(&order).Error; err != nil {
		http.Error(writer, "Could not assign order", http.StatusInternalServerError)
		return
	}

	writer.WriteHeader(http.StatusOK)
	msg := "Order no." + strconv.Itoa(order.ID) + " assigned to " + courier.Name
	json.NewEncoder(writer).Encode(map[string]string{"message": msg})
}

func UpdateOrderDetails(writer http.ResponseWriter, req *http.Request) {
	if !IsAdmin(req) {
		http.Error(writer, "Unauthorized", http.StatusUnauthorized)
		return
	}

	orderID := req.URL.Query().Get("id")
	if orderID == "" {
		http.Error(writer, "Order ID is required", http.StatusBadRequest)
		return
	}

	id, err := strconv.Atoi(orderID)
	if err != nil {
		http.Error(writer, "Invalid order ID", http.StatusBadRequest)
		return
	}

	// Get the order
	var order models.Order
	if err := database.DB.First(&order, id).Error; err != nil {
		http.Error(writer, "Order not found", http.StatusNotFound)
		return
	}

	// Decode the request body
	var updatedOrder models.Order
	if err := json.NewDecoder(req.Body).Decode(&updatedOrder); err != nil {
		http.Error(writer, "Could not decode request body", http.StatusBadRequest)
		return
	}

	// Update the order
	if updatedOrder.PickupLocation != "" {
		order.PickupLocation = updatedOrder.PickupLocation
	}
	if updatedOrder.DropOffLocation != "" {
		order.DropOffLocation = updatedOrder.DropOffLocation
	}
	if updatedOrder.DeliveryTime != "" {
		order.DeliveryTime = updatedOrder.DeliveryTime
	}
	if updatedOrder.Status != "" {
		order.Status = updatedOrder.Status
	}
	if updatedOrder.Items != nil {
		// Clear existing items
		if err := database.DB.Model(&order).Association("Items").Clear(); err != nil {
			http.Error(writer, "Could not clear existing items", http.StatusInternalServerError)
			return
		}
		// Add new items
		for _, item := range updatedOrder.Items {
			order.Items = append(order.Items, item)
		}
	}

	if err := database.DB.Save(&order).Error; err != nil {
		http.Error(writer, "Could not update order", http.StatusInternalServerError)
		return
	}

	writer.WriteHeader(http.StatusOK)
	json.NewEncoder(writer).Encode(map[string]string{"message": "Order updated successfully"})
}
