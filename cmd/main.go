package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/Aytaditya/slotwise/internal/config"
	"github.com/Aytaditya/slotwise/internal/http/auth"
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
