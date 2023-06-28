package web

type CreateUser struct {
	EmailAddress string   `json:"emailAddress"`
	Password     string   `json:"password"`
	FirstName    string   `json:"firstName" bson:"firstName"`
	MiddleName   string   `json:"middleName,omitempty" bson:"middleName,omitempty"`
	LastName     string   `json:"lastName" bson:"lastName"`
	Workgroups   []string `json:"workgroups" bson:"workgroups"`
}
