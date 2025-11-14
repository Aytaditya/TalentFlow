package Interns

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"strconv"

	"github.com/Aytaditya/slotwise/internal/response"
	"github.com/Aytaditya/slotwise/internal/storage"
	"github.com/Aytaditya/slotwise/internal/types"
)

func AddIntern(storage *storage.Sqlite) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var details types.Intern
		err := json.NewDecoder(r.Body).Decode(&details)
		if errors.Is(err, io.EOF) {
			response.WriteResponse(w, http.StatusInternalServerError, map[string]string{"error": "Empty Body"})
			return
		}
		if err != nil {
			response.WriteResponse(w, http.StatusInternalServerError, map[string]string{"error": "Invalid Json Fomat"})
			return
		}

		id, err1 := storage.AddIntern(&details.Name, &details.Email, &details.MentorId)
		if err1 != nil {
			response.WriteResponse(w, http.StatusInternalServerError, map[string]string{"error": err1.Error()})
			return
		}

		response.WriteResponse(w, http.StatusOK, map[string]string{"id": fmt.Sprint(id)})

	}
}

func FetchInterns(storage *storage.Sqlite) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		interns, err := storage.GetInterns()
		if err != nil {
			response.WriteResponse(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
			return
		}
		response.WriteResponse(w, http.StatusOK, interns)
	}
}

func UpdateIntern(storage *storage.Sqlite) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		id := r.PathValue("internId")
		fmt.Println(id)
		var details types.UpdateIntern
		err := json.NewDecoder(r.Body).Decode(&details)
		if errors.Is(err, io.EOF) {
			response.WriteResponse(w, http.StatusInternalServerError, map[string]string{"error": "Empty Body"})
			return
		}
		if err != nil {
			response.WriteResponse(w, http.StatusInternalServerError, map[string]string{"error": "Invalid Json Fomat"})
			return
		}

		InternId, convErr := strconv.ParseInt(id, 10, 64)
		if convErr != nil {
			response.WriteResponse(w, http.StatusBadRequest, map[string]string{"error": "Invalid note ID"})
			return
		}

		err1 := storage.UpdateIntern(&InternId, &details.Name, &details.Email, &details.MentorId, &details.Status)
		if err1 != nil {
			response.WriteResponse(w, http.StatusInternalServerError, map[string]string{"error": err1.Error()})
			return
		}
		response.WriteResponse(w, http.StatusOK, map[string]string{"message": "Intern updated successfully"})
	}
}
