package main

import (
	"Package-Tracker/database"
	"Package-Tracker/handlers"
	"Package-Tracker/models"
	"github.com/gorilla/mux"
	"golang.org/x/crypto/bcrypt"
	"log"
	"net/http"
)

// CORS Middleware
func enableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Allowing specific origins (in this case localhost:4200, where Angular is running)
		w.Header().Set("Access-Control-Allow-Origin", "https://front-moheie-dev.apps.rm2.thpm.p1.openshiftapps.com")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		// If it's a preflight OPTIONS request, respond with OK and return
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		// Proceed to the next handler
		next.ServeHTTP(w, r)
	})
}

func main() {
	router := mux.NewRouter()

	// user routes
	router.HandleFunc("/register", handlers.RegisterUser).Methods("POST")
	router.HandleFunc("/login", handlers.Login).Methods("POST")
	router.HandleFunc("/order/create", handlers.CreateOrder).Methods("POST")
	router.HandleFunc("/order/myorders", handlers.GetUserOrders).Methods("GET")
	router.HandleFunc("/order/view", handlers.ViewUserOrderDetails).Methods("GET")
	router.HandleFunc("/items", handlers.ViewItems).Methods("GET")

	// courier routes
	router.HandleFunc("/order/assigned", handlers.ViewAssignedOrders).Methods("GET")
	router.HandleFunc("/order/updatestatus", handlers.UpdateOrderStatus).Methods("PUT")
	router.HandleFunc("/order/accept", handlers.AcceptOrder).Methods("PUT")
	router.HandleFunc("/order/decline", handlers.DeclineOrder).Methods("PUT")

	//admin routes
	router.HandleFunc("/order/viewall", handlers.ViewAllOrders).Methods("GET")
	router.HandleFunc("/order", handlers.ViewFilteredOrder).Methods("GET")
	router.HandleFunc("/order/assign", handlers.AssignOrder).Methods("PUT")
	router.HandleFunc("/order/delete", handlers.DeleteOrder).Methods("DELETE")
	router.HandleFunc("/order/update", handlers.UpdateOrderDetails).Methods("PUT")
	router.HandleFunc("/courier/viewall", handlers.GetCouriers).Methods("GET")

	// Apply the CORS middleware to the router
	corsRouter := enableCORS(router)

	// Connect to the database
	database.ConnectDB()
	items := []models.Item{
		{ID: "1", Name: "Laptop"},
		{ID: "2", Name: "Phone"},
		{ID: "3", Name: "Headphones"},
		{ID: "4", Name: "Keyboard"},
		{ID: "5", Name: "Mouse"},
		{ID: "6", Name: "Monitor"},
		{ID: "7", Name: "Tablet"},
		{ID: "8", Name: "Smartwatch"},
		{ID: "9", Name: "Camera"},
		{ID: "10", Name: "Speaker"},
	}

	pass, _ := bcrypt.GenerateFromPassword([]byte("admin"), bcrypt.DefaultCost)
	// Create a default admin user
	user := models.User{
		ID:       1,
		Name:     "admin",
		Email:    "admin@gmail.com",
		Password: string(pass),
		Role:     "admin",
		Phone:    "0123456789",
	}

	//check if user already exists
	var existingUser models.User
	result := database.DB.Where("id = ?", user.ID).First(&existingUser)
	if result.RowsAffected == 0 {
		// User does not exist, insert it
		if err := database.DB.Create(&user).Error; err != nil {
			log.Printf("Failed to insert user : %v", err)
		} else {
			log.Println("Inserted user")
		}
	} else {
		log.Println("User already loaded in DB")
	}

	// Check if the item already exists in the database
	var existingItem models.Item
	result = database.DB.Where("id = ?", items[0].ID).First(&existingItem)

	if result.RowsAffected == 0 {
		// Item does not exist, insert it
		if err := database.DB.Create(&items).Error; err != nil {
			log.Printf("Failed to insert items : %v", err)
		} else {
			log.Println("Inserted items")
		}
	} else {
		log.Println("Items already loaded in DB")
	}

	// Start the server on port 8080
	if err := http.ListenAndServe(":8080", corsRouter); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
