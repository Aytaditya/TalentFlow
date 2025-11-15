package types

import "github.com/golang-jwt/jwt/v5"

type Signup struct {
	Email    string `json:"email"`
	Username string `json:"username"`
	Password string `json:"password"`
}

type Login struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type CustomClaims struct {
	ID    int64  `json:"id"`
	Email string `json:"email"`
	jwt.RegisteredClaims
}

type Intern struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	MentorId int64  `json:"mentor_id"`
}

type Mentor struct {
	Name       string `json:"name"`
	Email      string `json:"email"`
	Department string `json:"department"`
}

type ReturnMentor struct {
	Id         int64  `json:"id"`
	Name       string `json:"name"`
	Email      string `json:"email"`
	Department string `json:"department"`
}

type ReturnIntern struct {
	ID          int64  `json:"id"`
	Name        string `json:"name"`
	Email       string `json:"email"`
	Status      string `json:"status"`
	MentorId    string `json:"mentor_id"`
	MentorName  string `json:"mentor_name"`
	MentorEmail string `json:"mentor_email"`
}

type UpdateIntern struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	MentorId int64  `json:"mentor_id"`
	Status   string `json:"status"`
}

type Project struct {
	Name        string `json:"name"`
	Description string `json:"description"`
	StartDate   string `json:"start_date"`
	EndDate     string `json:"end_date"`
}

type ReturnProject struct {
	Id          int64  `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
	Status      string `json:"status"`
	StartDate   string `json:"start_date"`
	EndDate     string `json:"end_date"`
}

type UpdateProject struct {
	Name        string `json:"name"`
	Description string `json:"description"`
	Status      string `json:"status"`
	StartDate   string `json:"start_date"`
	EndDate     string `json:"end_date"`
}

type Assignment struct {
	InternId  int64  `json:"intern_id"`
	ProjectId int64  `json:"project_id"`
	Remarks   string `json:"remarks"`
}

type ReturnAssignment struct {
	Id          int64  `json:"id"`
	InternId    int64  `json:"intern_id"`
	InternName  string `json:"intern_name"`
	ProjectId   int64  `json:"project_id"`
	ProjectName string `json:"project_name"`
	Progress    int64  `json:"progress"`
	Remarks     string `json:"remarks"`
}

type UpdateAssignment struct {
	InternId  int64  `json:"intern_id"`
	ProjectId int64  `json:"project_id"`
	Progress  int64  `json:"progress"`
	Remarks   string `json:"remarks"`
}
