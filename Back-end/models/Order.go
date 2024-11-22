package models

import "time"

type Order struct {
	ID              int       `json:"id" gorm:"primary_key"`
	SellerID        int       `json:"seller_id" gorm:"not null"` // Reference to the seller
	CourierID       *int      `json:"courier_id"`                // Nullable until courier is assigned
	PickupLocation  string    `json:"pickup_location" gorm:"not null"`
	DropOffLocation string    `json:"dropoff_location" gorm:"not null"`
	DeliveryTime    string    `json:"delivery_time"`
	Status          string    `json:"status" gorm:"default:'pending'"` // Order status
	CreatedAt       time.Time `json:"created_at"`

	// Relationships
	Items []Item `json:"items" gorm:"many2many:order_items;"` // Many-to-many with items
}

// string representation of the model
func (o Order) String() string {
	return "Order ID: " + string(o.ID) + " Seller ID: " + string(o.SellerID) + " Pickup Location: " + o.PickupLocation + " Dropoff Location: " + o.DropOffLocation + " Delivery Time: " + o.DeliveryTime + " Status: " + o.Status + " Created At: " + o.CreatedAt.String()
}
