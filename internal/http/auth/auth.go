package auth

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"

	"github.com/Aytaditya/slotwise/internal/response"
	"github.com/Aytaditya/slotwise/internal/storage"
	"github.com/Aytaditya/slotwise/internal/types"
)

func Signup(storage *storage.Sqlite) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var details types.Signup
		err := json.NewDecoder(r.Body).Decode(&details)
		if errors.Is(err, io.EOF) {
			fmt.Println("Empty body")
			response.WriteResponse(w, http.StatusBadRequest, map[string]string{"error": "Empty request body"})
			return
		}
		if err != nil {
			response.WriteResponse(w, http.StatusBadRequest, map[string]string{"error": "Invalid Json Format"})
			return
		}
		fmt.Println(details)
		id, token, err1 := storage.Signup(&details.Username, &details.Email, &details.Password)
		if err1 != nil {
			response.WriteResponse(w, http.StatusInternalServerError, map[string]string{"error": err1.Error()})
			return
		}
		response.WriteResponse(w, 200, map[string]string{"id": fmt.Sprint(id), "token": token})
	}
}

func Login(instance *storage.Sqlite) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var details types.Login
		err := json.NewDecoder(r.Body).Decode(&details)
		if errors.Is(err, io.EOF) {
			fmt.Println("Empty body")
			response.WriteResponse(w, http.StatusBadRequest, map[string]string{"error": "Empty request body"})
			return
		}
		if err != nil {
			response.WriteResponse(w, http.StatusBadRequest, map[string]string{"error": "Invalid Json Format"})
			return
		}

		id, token, err1 := instance.Login(&details.Email, &details.Password)
		if err1 != nil {
			response.WriteResponse(w, http.StatusInternalServerError, map[string]string{"error": err1.Error()})
			return
		}

		response.WriteResponse(w, http.StatusOK, map[string]string{"id": fmt.Sprint(id), "token": token})
	}
}
