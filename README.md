TEAM TASK MANAGER – FULL STACK APPLICATION
===========================================


PROJECT OVERVIEW
----------------
A web application where users can create projects, assign tasks, and track progress with role‑based access (Admin / Member).

FEATURES IMPLEMENTED
--------------------
- User Authentication (Signup / Login) with JWT stored in HTTP‑only cookies.
- Role‑Based Access Control: Admin (full CRUD on projects/tasks) vs Member (update only own task status).
- Project Management: create, edit, delete, add members (admin only).
- Task Management: create, assign to users, set due date, track status (todo / in‑progress / done).
- Dashboard: displays task statistics (total, by status, overdue) and recent tasks.
- Responsive UI built with React + Tailwind CSS.
- REST API with proper validation and database relationships (MongoDB).

TECHNOLOGY STACK
----------------
- Backend: Node.js, Express, MongoDB (Mongoose), JWT, bcryptjs
- Frontend: React, React Router, Axios, Tailwind CSS, React Hot Toast
- Database: MongoDB (local or Atlas)
- Deployment: Railway

LOCAL DEVELOPMENT SETUP
-----------------------
Prerequisites: Node.js (v18+), MongoDB (local or Atlas)

1. Clone the repository:
   git clone <your-repo-url>
   cd team-task-manager

2. Backend setup:
   cd backend
   npm install
   Create a .env file with:
     PORT=5000
     MONGO_URI=mongodb://localhost:27017/taskmanager
     JWT_SECRET=your_secret_key
     CLIENT_URL=http://localhost:3000
   Start backend: npm run dev

3. Frontend setup:
   cd frontend
   npm install
   Create a .env file with:
     REACT_APP_API_URL=http://localhost:5000/api
   Start frontend: npm start

4. Open http://localhost:3000 in your browser.

USAGE GUIDE
-----------
1. Sign up as an Admin (select "Admin" in role dropdown).
2. Log in with your credentials.
3. Create a project (Projects → + New Project). Add member emails (members must sign up first).
4. Create tasks (Tasks → + New Task). Assign to a member, set due date.
5. Log in as a Member (use a different browser / incognito). The member sees only tasks assigned to them and can change status (todo → in‑progress → done).
6. Dashboard shows task counts and overdue tasks.

DEPLOYMENT ON RAILWAY
---------------------
1. Push code to GitHub.
2. Log in to Railway.app → New Project → Deploy from GitHub repo.
3. Add two services:
   - Backend: root directory = "backend", add environment variables (PORT, MONGO_URI, JWT_SECRET, CLIENT_URL).
   - Frontend: root directory = "frontend", add environment variable REACT_APP_API_URL (pointing to backend live URL).
4. Railway will automatically build and deploy both services.
5. The live URL will be provided by Railway.

API ENDPOINTS (Selected)
------------------------
- POST   /api/auth/signup       – Register new user
- POST   /api/auth/login        – Login user
- POST   /api/auth/logout       – Logout user
- GET    /api/auth/me           – Get current user
- GET    /api/projects          – Get all projects (filtered by role)
- POST   /api/projects          – Create project (admin only)
- DELETE /api/projects/:id      – Delete project (admin only)
- GET    /api/tasks             – Get tasks (admin sees all, member sees assigned)
- POST   /api/tasks             – Create task (admin only)
- PUT    /api/tasks/:id/status  – Update task status (member only for own tasks)
- DELETE /api/tasks/:id         – Delete task (admin only)
- GET    /api/dashboard         – Get stats and recent tasks

KNOWN ISSUES & WORKAROUNDS
--------------------------
- If MongoDB Atlas gives "querySrv ECONNREFUSED", use the standard connection string (mongodb://) or switch to local MongoDB.
- If port 5000 is already in use, kill the process with:
    netstat -ano | findstr :5000
    taskkill /PID <PID> /F

<img width="880" height="659" alt="image" src="https://github.com/user-attachments/assets/81728b65-f195-4a8c-964b-39b2afc31ef0" />
<img width="1176" height="664" alt="image" src="https://github.com/user-attachments/assets/692787a5-4efd-4877-bc08-1678bf6a99f9" />


© 2026
