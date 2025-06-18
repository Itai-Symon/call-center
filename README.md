# Call Center Management System

A comprehensive call center management platform. This system enables efficient call handling, task management, and organizational structure during normal operations and emergency situations.

## 🎯 Project Overview

This application provides two main interfaces:
- **Admin Panel**: For managers to configure tags and system settings
- **User Interface**: For call center employees to manage incoming calls and tasks

## ✨ Features

### Core Functionality
- **Call Management**: Create, view, and track call records with detailed information
- **Dynamic Tag System**: Organize calls with customizable tags that update across all records when modified
- **Task Management**: Create and track tasks linked to specific calls with status updates
- **Real-time Synchronization**: Changes to tags reflect immediately across all existing records
- **Intuitive Interface**: Clean, responsive design optimized for call center workflow

### User Roles
- **Admin (Manager)**: Configure tags, manage system settings
- **User (Employee)**: Handle calls, create tasks, update call status

## 🛠️ Tech Stack

### Frontend
- **React 18.2.0** with TypeScript 5.2.2
- **Vite 5.1.0** - Fast development and build tool
- **Tailwind CSS 3.4.1** - Modern styling framework
- **Lucide React** - Icon library

### Backend
- **FastAPI** - High-performance Python web framework
- **SQLAlchemy** - Database ORM
- **Pydantic** - Data validation and serialization
- **SQLite** - Lightweight database
- **Uvicorn** - ASGI server

### Deployment
- **Render** - Backend hosting ([API Endpoint](https://yoav-call-center.onrender.com))
- **Vercel** - Frontend hosting ([Live App](https://call-center-sooty.vercel.app))

## 📁 Project Structure

```
call-center/
├── backend/
│   └── app/
│       ├── data/           # Database files
│       ├── models/         # SQLAlchemy database models
│       ├── routers/        # API route handlers
│       ├── schemas/        # Pydantic data schemas
│       ├── database.py     # Database configuration
│       ├── main.py         # FastAPI application entry point
│       └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── types/          # TypeScript type definitions
│   │   ├── App.tsx         # Main application component
│   │   └── main.tsx        # Application entry point
│   ├── package.json
│   └── vite.config.ts
└── render.yaml             # Deployment configuration
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v22.16.0)
- **Python** (v3.11.9)
- **npm** or **yarn**

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend/app
   ```

2. **Create and activate virtual environment:**
   ```bash
   python -m venv venv
   
   # On Windows:
   venv\Scripts\activate
   
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables:**
   Create `.env` file in `backend/app/` directory:
   ```env
   DATABASE_URL=sqlite:///./data/callcenter.db
   ALLOWED_ORIGINS=http://localhost:5173,https://call-center-sooty.vercel.app
   ```

5. **Start the backend server:**
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

   Backend API available at: `http://localhost:8000`  
   API Documentation: `http://localhost:8000/docs`

   **Live Deployment:**
   - API Endpoint: `https://yoav-call-center.onrender.com`
   - API Documentation: `https://yoav-call-center.onrender.com/docs`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create `.env` file in `frontend/` directory:
   ```env
   # For local development
   VITE_API_BASE_URL=http://localhost:8000
   
   # For production (update with your frontend domain)
   VITE_API_BASE_URL=https://yoav-call-center.onrender.com
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

   **Development:** `http://localhost:5173`  
   **Production:** `https://call-center-sooty.vercel.app`

## 📖 Usage Guide

### For Administrators
1. Access the admin panel to create and manage tags
2. Tags can be renamed and will automatically update across all existing calls
3. Configure system settings and monitor overall call center activity

### For Call Center Employees
1. View the list of open call records on the main dashboard
2. Create new calls or select existing ones to manage
3. Assign relevant tags to categorize calls
4. Create tasks associated with calls and track their progress
5. Update task status: Open → In Progress → Completed

## 🔌 API Endpoints

### Tags Management
- `GET /tags/` - Retrieve all tags
- `POST /tags/` - Create new tag
- `PUT /tags/{id}` - Update existing tag
- `DELETE /tags/{id}` - Delete tag

### Call Management
- `GET /calls/` - Retrieve all calls
- `GET /calls/{id}` - Get specific call details
- `POST /calls/` - Create new call record
- `PUT /calls/{id}` - Update call information

### Task Management
- `GET /tasks/` - Retrieve all tasks
- `GET /tasks/call/{call_id}` - Get tasks for specific call
- `POST /tasks/` - Create new task
- `PUT /tasks/{id}` - Update task status

## 🧪 Development Commands

### Frontend Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Backend Development
```bash
uvicorn main:app --reload    # Start with auto-reload
```

## 🚀 Deployment

### Backend (Render)
1. Connect your repository to Render
2. Configure environment variables in Render dashboard
3. Deploy using the provided `render.yaml` configuration

### Frontend (Vercel)
1. Connect repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy with automatic builds on push
