# Talent Flow - Internship Management System

![Talent Flow](https://img.shields.io/badge/Platform-Web%20Application-blue)
![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20TailwindCSS-61dafb)
![Backend](https://img.shields.io/badge/Backend-Go%20(Golang)-00ADD8)
![Database](https://img.shields.io/badge/Database-SQLite-003B57)

A comprehensive internship management system designed to streamline mentor-intern relationships, project assignments, and progress tracking in organizational settings.

## 🌟 Features

### 👥 User Management
- **Mentor Management**: Add, view, update, and delete mentors
- **Intern Management**: Complete CRUD operations for interns
- **Role-based Access**: Admin-level control over all entities

### 📋 Project Management
- **Project Lifecycle**: Create, assign, and track projects
- **Status Tracking**: Ongoing, Completed, and Overdue project states
- **Progress Monitoring**: Visual progress indicators and timelines

### 🎯 Assignment System
- **Smart Assignments**: Assign projects to interns with specific remarks
- **Progress Tracking**: Binary completion system (0 = Pending, 1 = Completed)
- **Real-time Updates**: Live assignment status updates

### 📊 Dashboard & Analytics
- **Real-time Statistics**: Live counts and metrics
- **Visual Charts**: Progress bars and status distribution
- **Activity Feed**: Recent system activities and updates
- **Auto-refresh**: Automatic data updates every 30 seconds

## 🛠️ Technology Stack

### Frontend
- **React** - Modern UI library
- **TailwindCSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **Axios** - HTTP client for API calls

### Backend
- **Go (Golang)** - High-performance backend language
- **SQLite** - Lightweight, file-based database
- **YAML Configuration** - Flexible configuration management

### Database Schema
The system manages four main entities:
- **Mentors**: Name, email, department
- **Interns**: Name, email, status, mentor relationship
- **Projects**: Name, description, dates, status
- **Assignments**: Intern-Project relationships with progress tracking

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v20 or higher)
- Go (v1.19 or higher)

### Backend Setup

1. **Clone Project and Go into Directory**
```bash
git clone https://github.com/Aytaditya/TalentFlow
cd TalenFlow
```

2. **Install Go dependencies**
```bash
go mod tidy
```

3. **Configure the application**
   - Update `config/local.yaml` with your settings:
```yaml
environment: "dev"
storage_path: "storage/storage.db"
http_server:
    address: "localhost:8082"
```

4. **Run the backend server**
 ```bash
   go run cmd/main.go --config config/local.yaml
```
   Server runs on `http://localhost:8082`

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
   npm install
   ```

3. **Start development server**
```bash
   npm run dev
```
   Application runs on `http://localhost:5173`

## 🎮 Usage Guide

### Dashboard
- View real-time statistics of mentors, interns, and projects
- Monitor intern activity status and project completion rates
- Track recent system activities

### Managing Mentors
1. Navigate to **Mentors** section
2. Click **"Add Mentor"** to create new mentor profiles
3. Fill in name, email, and department details
4. View all mentors in **"View All"** tab
5. Edit or delete mentors as needed

### Managing Interns
1. Go to **Interns** section
2. Use **"Add Intern"** to register new interns
3. Assign mentors from dropdown selection
4. Track intern status (Active/Inactive)
5. Bulk operations available in list view

### Project Management
1. Access **Projects** section
2. Create projects with name, description, and timelines
3. Set project status: Ongoing, Completed, or Overdue
4. Monitor project progress with visual indicators

### Assignment System
1. Navigate to **Assignments**
2. Assign projects to interns with specific instructions
3. Track completion status (Pending/Completed)
4. Update progress and remarks as work advances

## 🔌 API Endpoints

### Mentors
- `GET /api/all-mentor` - Fetch all mentors
- `POST /api/add-mentor` - Create new mentor
- `PUT /api/update-mentor/{id}` - Update mentor details
- `DELETE /api/delete-mentor/{id}` - Remove mentor

### Interns
- `GET /api/all-intern` - Fetch all interns
- `POST /api/add-intern` - Create new intern
- `PUT /api/update-intern/{id}` - Update intern details
- `DELETE /api/delete-intern/{id}` - Remove intern

### Projects
- `GET /api/all-project` - Fetch all projects
- `POST /api/add-project` - Create new project
- `PUT /api/update-project/{id}` - Update project details
- `DELETE /api/delete-project/{id}` - Remove project

### Assignments
- `GET /api/all-assignment` - Fetch all assignments
- `POST /api/add-assignment` - Create new assignment
- `PUT /api/update-assignment/{id}` - Update assignment progress
- `DELETE /api/delete-assignment/{id}` - Remove assignment

## ⚙️ Configuration

### Backend Configuration Files

**config/local.yaml** (Development):
```yaml
environment: "dev"
storage_path: "storage/storage.db"
http_server:
  address: "localhost:8082"
```

**config/production.yaml** (Production):
```yaml
server:
  port: 8080
  host: "0.0.0.0"
  env: "production"

database:
  driver: "sqlite"
  dsn: "/var/lib/talentflow/talentflow.db"

cors:
  allowed_origins:
    - "https://yourdomain.com"
  allowed_methods:
    - "GET"
    - "POST"
    - "PUT"
    - "DELETE"
```

### Running with Different Configurations

**Development:**
```bash
go run cmd/main.go --config config/local.yaml
```

**Production:**
```bash
go run cmd/main.go --config config/production.yaml
```

**Custom config:**
```bash
go run cmd/main.go --config /path/to/your/config.yaml
```

## 🎨 UI/UX Features

- **Dark Theme**: Eye-friendly dark color scheme
- **Responsive Design**: Works on desktop and mobile devices
- **Smooth Animations**: CSS transitions and hover effects
- **Loading States**: Visual feedback during operations
- **Error Handling**: User-friendly error messages
- **Confirmation Dialogs**: Safe delete operations
