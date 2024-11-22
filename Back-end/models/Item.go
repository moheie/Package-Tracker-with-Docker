package models

type Item struct {
	ID   string `json:"id" gorm:"primary_key"`
	Name string `json:"name" gorm:"not null"`
}
