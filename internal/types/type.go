package types

import "github.com/golang-jwt/jwt/v5"

type Signup struct {
	Email    string `json:"email"`
	Username string `json:"username"`
	Password string `json:"password"`
}

type Login struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type CustomClaims struct {
	ID    int64  `json:"id"`
	Email string `json:"email"`
	jwt.RegisteredClaims
}

type Intern struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	MentorId int64  `json:"mentor_id"`
}

type Mentor struct {
	Name       string `json:"name"`
	Email      string `json:"email"`
	Department string `json:"department"`
}

type ReturnMentor struct {
	Id         int64  `json:"id"`
	Name       string `json:"name"`
	Department string `json:"department"`
}

type ReturnIntern struct {
	ID          int64  `json:"id"`
	Name        string `json:"name"`
	Email       string `json:"email"`
	Status      string `json:"status"`
	MentorId    string `json:"mentor_id"`
	MentorName  string `json:"mentor_name"`
	MentorEmail string `json:"mentor_email"`
}
