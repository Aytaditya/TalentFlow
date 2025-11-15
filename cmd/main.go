package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/Aytaditya/slotwise/internal/config"
	"github.com/Aytaditya/slotwise/internal/http/assignment"
	"github.com/Aytaditya/slotwise/internal/http/auth"
	Interns "github.com/Aytaditya/slotwise/internal/http/handler"
	"github.com/Aytaditya/slotwise/internal/http/handler/mentor"
	"github.com/Aytaditya/slotwise/internal/http/handler/project"
	"github.com/Aytaditya/slotwise/internal/storage"
)

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func main() {
	cfg := config.MustLoad()

	storage, err1 := storage.ConnectDB(cfg)
	if err1 != nil {
		log.Fatal("Failed to connect to db")
	}

	router := http.NewServeMux()

	router.HandleFunc("GET /", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Hello, World!"))
	})

	router.HandleFunc("POST /api/signup", auth.Signup(storage))
	router.HandleFunc("POST /api/login", auth.Login(storage))
	router.HandleFunc("POST /api/add-mentor", mentor.AddMentor(storage))
	router.HandleFunc("GET /api/all-intern", Interns.FetchInterns(storage))
	router.HandleFunc("GET /api/all-mentor", mentor.FetchMentors(storage))
	router.HandleFunc("GET /api/all-project", project.AllProjects(storage))
	router.HandleFunc("GET /api/all-assignment", assignment.AllAssignments(storage))
	router.HandleFunc("PUT /api/update-intern/{internId}", Interns.UpdateIntern(storage))
	router.HandleFunc("PUT /api/update-mentor/{mentorId}", mentor.UpdateMentor(storage))
	router.HandleFunc("PUT /api/update-project/{projectId}", project.UpdateProject(storage))
	router.HandleFunc("DELETE /api/delete-mentor/{mentorId}", mentor.DeleteMentor(storage))
	router.HandleFunc("DELETE /api/delete-intern/{internId}", Interns.DeleteIntern(storage))
	router.HandleFunc("DELETE /api/delete-project/{projectId}", project.DeleteProject(storage))
	router.HandleFunc("POST /api/add-intern", Interns.AddIntern(storage))
	router.HandleFunc("POST /api/add-project", project.AddProject(storage))
	router.HandleFunc("POST /api/add-assignment", assignment.AddAssignment(storage))

	server := http.Server{
		Handler: corsMiddleware(router), // CORS enabled here
		Addr:    cfg.Address,
	}

	fmt.Println("Server Running at:", cfg.HttpServer.Address)

	err := server.ListenAndServe()
	if err != nil {
		panic(err)
	}
}
