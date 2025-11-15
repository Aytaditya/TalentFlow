package project

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

func AddProject(storage *storage.Sqlite) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var details types.Project
		err := json.NewDecoder(r.Body).Decode(&details)
		if err != nil {
			response.WriteResponse(w, http.StatusInternalServerError, map[string]string{"error": "Invalid Json Format"})
		}
		if errors.Is(err, io.EOF) {
			response.WriteResponse(w, http.StatusInternalServerError, map[string]string{"error": "Empty Json Body"})
			return
		}
		id, err1 := storage.AddProject(&details.Name, &details.Description, &details.StartDate, &details.EndDate)
		if err1 != nil {
			response.WriteResponse(w, http.StatusInternalServerError, map[string]string{"error": err1.Error()})
		}
		response.WriteResponse(w, http.StatusOK, map[string]string{"id": fmt.Sprint(id)})
	}
}

func AllProjects(storage *storage.Sqlite) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		projects, err := storage.GetProjects()
		if err != nil {
			response.WriteResponse(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
			return
		}
		response.WriteResponse(w, http.StatusOK, projects)
	}
}

func UpdateProject(storage *storage.Sqlite) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		id := r.PathValue("projectId")
		if id == "" {
			response.WriteResponse(w, http.StatusBadRequest, map[string]string{"error": "projectId is required"})
			return
		}
		conId, err := strconv.ParseInt(id, 10, 64)
		if err != nil {
			response.WriteResponse(w, http.StatusBadRequest, map[string]string{"error": "invalid projectId"})
			return
		}
		var details types.UpdateProject
		err1 := json.NewDecoder(r.Body).Decode(&details)
		if err1 != nil {
			response.WriteResponse(w, http.StatusInternalServerError, map[string]string{"error": "Invalid Json Format"})
			return
		}
		if errors.Is(err1, io.EOF) {
			response.WriteResponse(w, http.StatusInternalServerError, map[string]string{"error": "Empty Json Body"})
			return
		}

		err2 := storage.UpdateProject(&conId, &details.Name, &details.Description, &details.Status, &details.StartDate, &details.EndDate)

		if err2 != nil {
			response.WriteResponse(w, http.StatusInternalServerError, map[string]string{"error": err2.Error()})
			return
		}

		response.WriteResponse(w, http.StatusOK, map[string]string{"message": "Project updated successfully"})

	}
}

func DeleteProject(storage *storage.Sqlite) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		id := r.PathValue("projectId")
		if id == "" {
			response.WriteResponse(w, http.StatusInternalServerError, map[string]string{"error": "projectId is required"})
			return
		}
		conId, err := strconv.ParseInt(id, 10, 64)
		if err != nil {
			response.WriteResponse(w, http.StatusBadRequest, map[string]string{"error": "invalid projectId"})
			return
		}
		err1 := storage.DeleteProject(&conId)
		if err1 != nil {
			response.WriteResponse(w, http.StatusInternalServerError, map[string]string{"error": err1.Error()})
			return
		}
		response.WriteResponse(w, http.StatusOK, map[string]string{"message": "Project deleted successfully"})
	}
}
