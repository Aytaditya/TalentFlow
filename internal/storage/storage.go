package storage

import (
	"database/sql"
	"fmt"

	"github.com/Aytaditya/slotwise/internal/config"
	_ "github.com/mattn/go-sqlite3"
)

type Sqlite struct {
	DB *sql.DB
}

func ConnectDB(config *config.Config) (*Sqlite, error) {
	// db is instance
	fmt.Println(config.Address)
	db, err := sql.Open("sqlite3", config.StoragePath)
	if err != nil {
		return nil, err
	}

	// creating admin table TABLE 1
	_, er := db.Exec(`CREATE TABLE IF NOT EXISTS Admin (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		username TEXT NOT NULL UNIQUE,
		email TEXT NOT NULL UNIQUE,
		password TEXT NOT NULL
	)`)

	if er != nil {
		return nil, er
	}

	// creating buddy table TABLE 2
	_, ok := db.Exec(`CREATE TABLE IF NOT EXISTS Mentors (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
  		name TEXT NOT NULL,
  		email TEXT UNIQUE NOT NULL,
  		department TEXT
	)`)

	if ok != nil {
		return nil, ok
	}

	// creating table for interns
	_, er1 := db.Exec(`CREATE TABLE IF NOT EXISTS Interns (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'active',
  mentor_id INTEGER,
  FOREIGN KEY(mentor_id) REFERENCES mentors(id)
	)`)

	if er1 != nil {
		return nil, er1
	}

	// creating table for projects
	_, er2 := db.Exec(`CREATE TABLE IF NOT EXISTS Projects (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
  		name TEXT NOT NULL,
  		description TEXT,
  		status TEXT DEFAULT 'ongoing',
  		start_date TEXT,
  		end_date TEXT
	)`)

	if er2 != nil {
		return nil, er2
	}

	_, er3 := db.Exec(`CREATE TABLE IF NOT EXISTS Assignments (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
  intern_id INTEGER,
  project_id INTEGER,
  progress INTEGER DEFAULT 0,
  remarks TEXT,
  FOREIGN KEY (intern_id) REFERENCES interns(id),
  FOREIGN KEY (project_id) REFERENCES projects(id)
	)`)

	if er3 != nil {
		return nil, er3
	}

	return &Sqlite{DB: db}, nil
}
