package storage

import (
	"database/sql"
	"fmt"

	"github.com/Aytaditya/slotwise/internal/config"
	"github.com/Aytaditya/slotwise/internal/middleware/jwt"
	"github.com/Aytaditya/slotwise/internal/types"
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

func (sq *Sqlite) Login(email *string, password *string) (int64, string, error) {
	if email == nil || password == nil {
		return 0, "", fmt.Errorf("email or password cant be empty")
	}

	row := sq.DB.QueryRow("SELECT id,password FROM Admin where email=?", email)
	var id int64
	var dbPassword string

	err := row.Scan(&id, &dbPassword)
	if err == sql.ErrNoRows {
		return 0, "", fmt.Errorf("no user found with the given email")
	}
	if err != nil {
		return 0, "", err
	}

	// Compare the provided password with the stored hashed password
	err = bcrypt.CompareHashAndPassword([]byte(dbPassword), []byte(*password))
	if err != nil {
		return 0, "", fmt.Errorf("wrong password entered")
	}

	// now we will generate token
	token, err1 := jwt.CreateToken(id, *email)
	if err1 != nil {
		return 0, "", err1
	}
	return id, token, nil
}

func (sq *Sqlite) AddIntern(name *string, email *string, mentorId *int64) (int64, error) {

	if name == nil || email == nil || mentorId == nil {
		return 0, fmt.Errorf("field empty")
	}

	stmt, err := sq.DB.Prepare("INSERT INTO Interns (name,email,mentor_id) VALUES (?,?,?)")
	if err != nil {
		return 0, err
	}

	res, err1 := stmt.Exec(name, email, mentorId)
	if err1 != nil {
		return 0, err1
	}

	stmt.Close()

	id, err2 := res.LastInsertId()
	if err2 != nil {
		return 0, err2
	}

	return id, nil
}

func (sq *Sqlite) AddMentor(name *string, email *string, department *string) (int64, error) {
	if name == nil || email == nil || department == nil {
		return 0, fmt.Errorf("field missing")
	}

	stmt, err := sq.DB.Prepare("INSERT INTO Mentors (name,email,department) VALUES (?,?,?)")
	if err != nil {
		return 0, err
	}

	res, err1 := stmt.Exec(name, email, department)
	if err1 != nil {
		return 0, err1
	}

	stmt.Close()

	id, err2 := res.LastInsertId()
	if err2 != nil {
		return 0, err2
	}

	return id, nil
}

func (sq *Sqlite) GetMentors() ([]types.ReturnMentor, error) {
	rows, err := sq.DB.Query("SELECT id, name,department FROM Mentors")
	if err != nil {
		return nil, err
	}

	defer rows.Close()
	var mentors []types.ReturnMentor
	for rows.Next() {
		var mentor types.ReturnMentor // a single mentor will be appended into mentors
		err1 := rows.Scan(&mentor.Id, &mentor.Name, &mentor.Department)
		if err1 != nil {
			return nil, err1
		}
		mentors = append(mentors, mentor)
	}

	return mentors, nil
}

func (sq *Sqlite) GetInterns() ([]types.ReturnIntern, error) {
	rows, err := sq.DB.Query("SELECT a.id,a.name,a.email,a.status,a.mentor_id,b.name,b.email from Interns as a INNER JOIN Mentors as b on a.mentor_id=b.id ")
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var interns []types.ReturnIntern
	for rows.Next() {
		var intern types.ReturnIntern
		err1 := rows.Scan(&intern.ID,
			&intern.Name,
			&intern.Email,
			&intern.Status,
			&intern.MentorId,
			&intern.MentorName,
			&intern.MentorEmail)
		if err1 != nil {
			return nil, err1
		}

		interns = append(interns, intern)
	}
	return interns, nil
}
