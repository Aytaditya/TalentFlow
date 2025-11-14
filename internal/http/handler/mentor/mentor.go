package mentor

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

func AddMentor(storage *storage.Sqlite) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var details types.Mentor
		err := json.NewDecoder(r.Body).Decode(&details)
		if err != nil {
			response.WriteResponse(w, http.StatusInternalServerError, map[string]string{"error": "Invalid Json Format"})
			return
		}
		if errors.Is(err, io.EOF) {
			response.WriteResponse(w, http.StatusInternalServerError, map[string]string{"error": "Empty Json Body"})
			return
		}
		id, err1 := storage.AddMentor(&details.Name, &details.Email, &details.Department)
		if err1 != nil {
			response.WriteResponse(w, http.StatusInternalServerError, map[string]string{"error": err1.Error()})
			return
		}

		response.WriteResponse(w, http.StatusOK, map[string]string{"id": fmt.Sprint(id)})

	}
}

func FetchMentors(storage *storage.Sqlite) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		mentors, err := storage.GetMentors()
		if err != nil {
			response.WriteResponse(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
			return
		}
		response.WriteResponse(w, http.StatusOK, mentors)
	}
}
