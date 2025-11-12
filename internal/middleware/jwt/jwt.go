package jwt

import (
	"time"

	"github.com/Aytaditya/slotwise/internal/types"
	"github.com/golang-jwt/jwt/v5"
)

var jwtSecret = []byte("AdityaIsGoodBoy")

func CreateToken(userId int64, email string) (string, error) {
	claims := types.CustomClaims{
		ID:    userId,
		Email: email,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)), // 1 day expiry
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			Issuer:    "go-app",
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	return token.SignedString(jwtSecret)
}

func ValidateToken(token string) {

}
