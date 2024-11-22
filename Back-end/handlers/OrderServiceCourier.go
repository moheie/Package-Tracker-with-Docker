package handlers

import (
	"Package-Tracker/database"
	"Package-Tracker/models"
	"encoding/json"
	"net/http"
	"strconv"
)

func IsCourier(req *http.Request) bool {
	id, err := GetIDFromToken(req)
	if err != nil {
		panic(err)
	}
	role, err := GetRoleFromID(id)
	if err != nil {
		panic(err)
	}
	if role == "courier" {
		return true
	}
	return false
}

func ViewAssignedOrders(writer http.ResponseWriter, req *http.Request) {
	if !IsCourier(req) {
		http.Error(writer, "Unauthorized", http.StatusUnauthorized)
		return
	}
	// Get all orders
	orders := []models.Order{}
	id, err := GetIDFromToken(req)
	if err != nil {
		http.Error(writer, "Invalid token", http.StatusBadRequest)
		return
	}
	database.DB.Where("courier_id = ?", id).Preload("Items").Find(&orders)
	json.NewEncoder(writer).Encode(orders)
}

func AcceptOrder(writer http.ResponseWriter, req *http.Request) {
	if !IsCourier(req) {
		http.Error(writer, "Unauthorized", http.StatusUnauthorized)
		return
	}

	orderID := req.URL.Query().Get("oid")
	if orderID == "" {
		http.Error(writer, "Order ID is required", http.StatusBadRequest)
		return
	}

	oid, err := strconv.Atoi(orderID)
	if err != nil {
		http.Error(writer, "Invalid order ID", http.StatusBadRequest)
		return
	}

	var order models.Order
	if err := database.DB.First(&order, oid).Error; err != nil {
		http.Error(writer, "Order not found", http.StatusNotFound)
		return
	}

	courierID, err := GetIDFromToken(req)
	if err != nil {
		http.Error(writer, "Invalid token", http.StatusBadRequest)
		return
	}

	if order.CourierID == nil || *order.CourierID != courierID {
		http.Error(writer, "Unauthorized: You are not assigned to this order", http.StatusUnauthorized)
		return
	}

	order.Status = "accepted"
	if err := database.DB.Save(&order).Error; err != nil {
		http.Error(writer, "Could not accept order", http.StatusInternalServerError)
		return
	}

	writer.WriteHeader(http.StatusOK)
	msg := "Order no." + strconv.Itoa(order.ID) + " accepted"
	json.NewEncoder(writer).Encode(map[string]string{"message": msg})
}

func DeclineOrder(writer http.ResponseWriter, req *http.Request) {
	if !IsCourier(req) {
		http.Error(writer, "Unauthorized", http.StatusUnauthorized)
		return
	}

	orderID := req.URL.Query().Get("oid")
	if orderID == "" {
		http.Error(writer, "Order ID is required", http.StatusBadRequest)
		return
	}

	oid, err := strconv.Atoi(orderID)
	if err != nil {
		http.Error(writer, "Invalid order ID", http.StatusBadRequest)
		return
	}

	var order models.Order
	if err := database.DB.First(&order, oid).Error; err != nil {
		http.Error(writer, "Order not found", http.StatusNotFound)
		return
	}

	courierID, err := GetIDFromToken(req)
	if err != nil {
		http.Error(writer, "Invalid token", http.StatusBadRequest)
		return
	}

	if order.CourierID == nil || *order.CourierID != courierID {
		http.Error(writer, "Unauthorized: You are not assigned to this order", http.StatusUnauthorized)
		return
	}

	order.CourierID = nil
	order.Status = "pending"
	if err := database.DB.Save(&order).Error; err != nil {
		http.Error(writer, "Could not decline order", http.StatusInternalServerError)
		return
	}

	writer.WriteHeader(http.StatusOK)
	msg := "Order no." + strconv.Itoa(order.ID) + " declined"
	json.NewEncoder(writer).Encode(map[string]string{"message": msg})
}

func UpdateOrderStatus(writer http.ResponseWriter, req *http.Request) {
	if !IsCourier(req) {
		http.Error(writer, "Unauthorized", http.StatusUnauthorized)
		return
	}

	status := req.URL.Query().Get("status")
	orderID := req.URL.Query().Get("oid")
	if orderID == "" {
		http.Error(writer, "Order ID is required", http.StatusBadRequest)
		return
	}
	if status == "" {
		http.Error(writer, "Status is required", http.StatusBadRequest)
		return
	}

	oid, err := strconv.Atoi(orderID)
	if err != nil {
		http.Error(writer, "Invalid order ID", http.StatusBadRequest)
		return
	}

	var order models.Order
	if err := database.DB.First(&order, oid).Error; err != nil {
		http.Error(writer, "Order not found", http.StatusNotFound)
		return
	}

	courierID, err := GetIDFromToken(req)
	if err != nil {
		http.Error(writer, "Invalid token", http.StatusBadRequest)
		return
	}

	if order.CourierID == nil || *order.CourierID != courierID {
		http.Error(writer, "Unauthorized: You are not assigned to this order", http.StatusUnauthorized)
		return
	}

	if order.Status == "pending" {
		http.Error(writer, "Order is not accepted", http.StatusBadRequest)
		return
	}

	order.Status = status
	if err := database.DB.Save(&order).Error; err != nil {
		http.Error(writer, "Could not update order status", http.StatusInternalServerError)
		return
	}

	writer.WriteHeader(http.StatusOK)
	msg := "Order no." + strconv.Itoa(order.ID) + " status updated to " + status
	json.NewEncoder(writer).Encode(map[string]string{"message": msg})
}
