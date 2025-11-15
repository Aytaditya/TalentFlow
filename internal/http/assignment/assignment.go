package assignment

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

func UpdateAssignment(storage *storage.Sqlite) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		id := r.PathValue("assignmentId")
		if id == "" {
			response.WriteResponse(w, http.StatusBadRequest, map[string]string{"error": "assignmentId is required"})
			return
		}
		var details types.UpdateAssignment
		err := json.NewDecoder(r.Body).Decode(&details)
		if err != nil {
			response.WriteResponse(w, http.StatusInternalServerError, map[string]string{"error": "Invalid Json Format"})
			return
		}
		if errors.Is(err, io.EOF) {
			response.WriteResponse(w, http.StatusInternalServerError, map[string]string{"error": "Empty Json Body"})
			return
		}
		err1 := storage.UpdateAssignment(&details.InternId, &details.ProjectId, &details.Progress, &details.Remarks)
		if err1 != nil {
			response.WriteResponse(w, http.StatusInternalServerError, map[string]string{"error": err1.Error()})
			return
		}
		response.WriteResponse(w, http.StatusOK, map[string]string{"message": "Assignment updated successfully"})
	}
}

func DeleteAssignment(storage *storage.Sqlite) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		id := r.PathValue("assignmentId")
		if id == "" {
			response.WriteResponse(w, http.StatusBadRequest, map[string]string{"error": "assignmentId is required"})
			return
		}
		conId, err1 := strconv.ParseInt(id, 10, 64)
		if err1 != nil {
			response.WriteResponse(w, http.StatusBadRequest, map[string]string{"error": "invalid assignmentId"})
			return
		}
		err := storage.DeleteAssignment(&conId)
		if err != nil {
			response.WriteResponse(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
			return
		}
		response.WriteResponse(w, http.StatusOK, map[string]string{"message": "Assignment deleted successfully"})
	}
}
