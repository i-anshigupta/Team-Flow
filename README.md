# Ethara Platform - TeamFlow 🚀

Ethara is a modern, premium SaaS-style project management and workspace dashboard application built with the **MERN Stack** (MongoDB, Express, React, Node.js). It is designed with a heavy focus on high-end aesthetics, seamless micro-animations, and dynamic user experiences.

### 🌐 [Live Demo: TeamFlow on Railway](https://team-flow-production-3823.up.railway.app)

![TeamFlow Banner](https://img.shields.io/badge/MERN-Stack-blue?style=for-the-badge&logo=mongodb)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## ✨ Core Features

### 🎨 Stunning UI/UX & Dark Mode
- **Premium Aesthetics**: Glassmorphism, deep layered shadows, and high-fidelity gradients.
- **Dynamic Theming**: Instant, persistent toggle between a crisp Light Mode and a deep, immersive Dark Mode (Slate/Indigo palette).
- **Framer Motion Animations**: Smooth page transitions, hover scaling, and glowing pulse effects.

### 🔐 Secure Authentication & Session Management
- **JWT Authentication**: Secure login/signup system.
- **Password Recovery**: Integrated fallback allowing users to securely reset forgotten passwords using their Date of Birth and a personal Security Question / Answer configured during sign-up.
- **Refresh & Access Tokens**: Short-lived access tokens (15m) automatically refreshed silently in the background using HttpOnly refresh tokens (7d).
- **Security Middleware**: Backend protected by `helmet` and `express-rate-limit` (DDoS protection).

### 🛡️ Role-Based Access Control (RBAC)
The application differentiates users based on their roles:
- **Admin**: Has full access. Can view and manage the "Projects" tab, create new projects, and assign tasks. **Important: Only users registering with an internal `@ethara.in` email address are permitted to claim Admin privileges.**
- **User**: Restricted access. Can view their personal Dashboard, interact with assigned tasks, and edit their Profile, but cannot access global project management areas.
- **Implementation**: The backend explicitly validates the email domain upon registration to prevent external users from becoming admins. The frontend hides global components if `user.role !== 'admin'`.

### 📋 Workspace & Task Management
- **Interactive Dashboard**: Visual KPI cards tracking Active Projects, Assigned Tasks, Completed Tasks, and Overdue items.
- **Dynamic Task Statuses**: Easily shift tasks between "To Do", "In Progress", "In Review", and "Completed" with instant visual feedback.
- **Activity Feed**: Real-time logging of user actions (e.g., when a task status changes) displayed in a beautiful vertical timeline format.
- **Profile Management**: Update passwords, view security statuses, and automatic avatar initials generation if no photo is uploaded.

---

## 💻 Tech Stack

**Frontend (Client)**:
- React 18 + Vite
- Tailwind CSS (Styling)
- Framer Motion (Animations)
- React Router (Routing)
- Zustand / Context (State Management)
- Axios (API Client)
- React Hook Form (Form Handling)

**Backend (Server)**:
- Node.js + Express
- MongoDB + Mongoose
- JSON Web Tokens (JWT)
- Bcrypt (Password Hashing)
- Helmet & Express Rate Limit (Security)

---

## 🛠️ Setup & Installation

### Prerequisites
Make sure you have Node.js (v16+) and Git installed. You will also need a MongoDB database URL (either local or MongoDB Atlas).

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd Ethere_Project
```

### 2. Backend Setup
1. Open a terminal and navigate to the server folder:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Inside the `server` folder, create a `.env` file and add the following:
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://<your-username>:<your-password>@<your-cluster>.mongodb.net/<database-name>
   JWT_ACCESS_SECRET=your_super_secret_access_key
   JWT_REFRESH_SECRET=your_super_secret_refresh_key
   JWT_ACCESS_EXPIRES=15m
   JWT_REFRESH_EXPIRES=7d
   CLIENT_URL=http://localhost:5173
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup
1. Open a *new* terminal and navigate to the Frontend folder:
   ```bash
   cd Frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Inside the `Frontend` folder, create a `.env` file and add the following:
   ```env
   VITE_API_URL=http://localhost:5000
   ```
   *(Note: The `/api/v1` path is automatically appended in the Axios configuration, so you only need to provide the base host url.)*
4. Start the frontend development server:
   ```bash
   npm run dev
   ```

### 4. You're all set! 🎉
Visit `http://localhost:5173` in your browser. 
Register a new account to test out the User features, or update your role manually to `admin` in your MongoDB database to unlock the Admin project-creation features!

---

## 📌 Security Notes
- **Rate Limiting**: The API limits connections to 1000 requests per IP every 15 minutes to prevent brute-force and DDoS attacks.
- **Git Ignore**: Essential ignore files are included in both the `client` and `server` directories to ensure `.env` keys and heavy `node_modules` are never pushed to GitHub.
