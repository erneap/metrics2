package web

import (
	"fmt"
	"strconv"

	"github.com/erneap/metrics-api/models/interfaces"
)

type AuthenticationRequest struct {
	EmailAddress string `json:"emailAddress"`
	Password     string `json:"password"`
}

type AuthenticationResponse struct {
	User      *interfaces.User `json:"user,omitempty"`
	Token     string           `json:"token"`
	Exception string           `json:"exception"`
}

type UpdateRequest struct {
	ID    string `json:"id"`
	Field string `json:"field"`
	Value string `json:"value"`
}

func (ur *UpdateRequest) StringValue() string {
	return ur.Value
}

func (ur *UpdateRequest) NumberValue() uint {
	num, err := strconv.ParseUint(ur.Value, 10, 32)
	if err != nil {
		fmt.Println(err.Error())
	}
	return uint(num)
}

func (ur *UpdateRequest) BooleanValue() bool {
	answer, err := strconv.ParseBool(ur.Value)
	if err != nil {
		return false
	}
	return answer
}

type ChangePasswordRequest struct {
	ID       string `json:"id"`
	Password string `json:"password"`
}

type Message struct {
	Message string `json:"message"`
}
