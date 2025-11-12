package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/Aytaditya/slotwise/internal/config"
	"github.com/Aytaditya/slotwise/internal/storage"
)

func main() {
	cfg := config.MustLoad() // config file loaded

	// database connection
	_, err1 := storage.ConnectDB(cfg)
	if err1 != nil {
		log.Fatal("Failed to connect to db")
	}

	router := http.NewServeMux()

	router.HandleFunc("GET /", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Hello, World!"))
	})

	server := http.Server{
		Handler: router,
		Addr:    cfg.Address,
	}

	fmt.Println("Server Running at:", cfg.HttpServer.Address)

	err := server.ListenAndServe()
	if err != nil {
		panic(err)
	}

}
