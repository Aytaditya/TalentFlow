package storage

import (
	"database/sql"
	"fmt"

	"github.com/Aytaditya/slotwise/internal/config"
	"github.com/Aytaditya/slotwise/internal/middleware/jwt"
	_ "github.com/mattn/go-sqlite3"
	"golang.org/x/crypto/bcrypt"
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

func (sq *Sqlite) Signup(username *string, email *string, password *string) (int64, string, error) {
	if username == nil || password == nil || email == nil {
		return 0, "", fmt.Errorf("username, email and password must not be nil")
	}
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(*password), bcrypt.DefaultCost)
	if err != nil {
		return 0, "", fmt.Errorf("failed to hash password: %v", err)
	}

	stmt, err := sq.DB.Prepare("INSERT INTO Admin (username,email,password) VALUES (?,?,?)")
	if err != nil {
		return 0, "", err
	}
	res, err1 := stmt.Exec(username, email, string(hashedPassword))
	if err1 != nil {
		return 0, "", err1
	}
	stmt.Close()

	id, err2 := res.LastInsertId()
	if err2 != nil {
		return 0, "", err2
	}

	// now we will generate token
	token, err3 := jwt.CreateToken(id, *email)
	if err3 != nil {
		return 0, "", err3
	}

	return id, token, nil
}
