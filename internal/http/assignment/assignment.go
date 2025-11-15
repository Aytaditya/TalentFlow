package assignment

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

func AddAssignment(storage *storage.Sqlite) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var details types.Assignment
		err := json.NewDecoder(r.Body).Decode(&details)
		if err != nil {
			response.WriteResponse(w, http.StatusInternalServerError, map[string]string{"error": "Invalid Json Format"})
			return
		}
		if errors.Is(err, io.EOF) {
			response.WriteResponse(w, http.StatusInternalServerError, map[string]string{"error": "Empty Json Body"})
			return
		}
		id, err1 := storage.AddAssignment(&details.InternId, &details.ProjectId, &details.Remarks)
		if err1 != nil {
			response.WriteResponse(w, http.StatusInternalServerError, map[string]string{"error": err1.Error()})
			return
		}
		response.WriteResponse(w, http.StatusOK, map[string]string{"id": fmt.Sprint(id)})
	}
}

func AllAssignments(storage *storage.Sqlite) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		assignments, err := storage.GetAssignmets()
		if err != nil {
			response.WriteResponse(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
			return
		}
		response.WriteResponse(w, http.StatusOK, assignments)
	}
}
