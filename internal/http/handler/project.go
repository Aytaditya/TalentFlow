package Interns

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
