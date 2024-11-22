package models

import "time"

type User struct {
	ID        int       `json:"id" gorm:"primary_key"`
	Name      string    `json:"name" gorm:"not null"`
	Email     string    `json:"email" gorm:"unique;not null"`
	Role      string    `json:"role" gorm:"type:enum('seller', 'courier', 'admin');not null"`
	Phone     string    `json:"phone" gorm:"not null"`
	Password  string    `json:"password" gorm:"not null"`
	CreatedAt time.Time `json:"created_at"`

	// Relationships
	OrdersCreated   []Order `json:"orders_created" gorm:"foreignKey:SellerID"`    // Seller relationship
	OrdersDelivered []Order `json:"orders_delivered" gorm:"foreignKey:CourierID"` // Courier relationship
}
