package config

import (
	"flag"
	"fmt"
	"log"
	"os"

	"github.com/ilyakaznacheev/cleanenv"
)

type HttpServer struct {
	Address string `yaml:"address" env-default:"localhost:8080"`
}

type Config struct {
	Environment string `yaml:"environment" env:"ENV" env-required:"true"`
	StoragePath string `yaml:"storage_path" env:"STORAGE_PATH" env-required:"true"`
	HttpServer  `yaml:"http_server"`
}

func MustLoad() *Config {
	configPath := os.Getenv("ENV")
	if configPath == "" {
		flg := flag.String("config", "", "Path to configuration file")
		flag.Parse()
		configPath = *flg
		if configPath == "" {
			log.Fatal("Config path is required")
		}
	}
	_, err := os.Stat(configPath)
	if os.IsNotExist(err) {
		log.Fatalf("Failed to stat config file: %v", err)
	}

	var cfg Config
	er := cleanenv.ReadConfig(configPath, &cfg)
	if er != nil {
		log.Fatalf("Failed to read config file: %v", er)
	}

	fmt.Println("Config loaded successfully:", cfg)
	return &cfg

}
