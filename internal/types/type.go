package types

import "github.com/golang-jwt/jwt/v5"

type Signup struct {
	Email    string `json:"email"`
	Username string `json:"username"`
	Password string `json:"password"`
}

type CustomClaims struct {
	ID    int64  `json:"id"`
	Email string `json:"email"`
	jwt.RegisteredClaims
}
