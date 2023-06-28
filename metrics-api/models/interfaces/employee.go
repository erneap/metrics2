package interfaces

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Employee struct {
	ID     primitive.ObjectID `json:"id" bson:"_id"`
	TeamID primitive.ObjectID `json:"team" bson:"team"`
	SiteID string             `json:"site" bson:"site"`
	UserID primitive.ObjectID `json:"userid" bson:"userid"`
	Email  string             `json:"email" bson:"email"`
	Name   EmployeeName       `json:"name" bson:"name"`
}

type ByEmployees []Employee

func (c ByEmployees) Len() int { return len(c) }
func (c ByEmployees) Less(i, j int) bool {
	if c[i].Name.LastName == c[j].Name.LastName {
		if c[i].Name.FirstName == c[j].Name.FirstName {
			return c[i].Name.MiddleName < c[j].Name.MiddleName
		}
		return c[i].Name.FirstName < c[j].Name.FirstName
	}
	return c[i].Name.LastName < c[j].Name.LastName
}
func (c ByEmployees) Swap(i, j int) { c[i], c[j] = c[j], c[i] }

type EmployeeName struct {
	FirstName  string `json:"first"`
	MiddleName string `json:"middle"`
	LastName   string `json:"last"`
	Suffix     string `json:"suffix"`
}
