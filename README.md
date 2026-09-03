# full-stack-auth-posts-management
# Full-Stack Authentication & Posts Management System

A full-stack web application built with **React.js, Redux Toolkit, Node.js, Express.js, and MySQL**. The application provides secure user authentication, role-based access, protected routes, and complete Posts CRUD functionality with server-side pagination.

## 🚀 Tech Stack

### Frontend

* React.js
* JavaScript (ES6+)
* Redux Toolkit
* React Router
* Axios
* HTML5
* CSS3
* Material UI
* Vite

### Backend

* Node.js
* Express.js
* JWT Authentication
* bcrypt
* REST APIs
* Middleware
* API Error Handling

### Database

* MySQL
* SQL
* CRUD Operations
* LIMIT / OFFSET Pagination

### Tools

* Git
* GitHub
* Postman
* VS Code

## ✨ Features

### Authentication

* User registration
* User login
* Secure password hashing using bcrypt
* JWT-based authentication
* Authentication middleware
* Protected routes
* Logout functionality

### Authorization

* Role-based access control
* User dashboard
* Superadmin dashboard
* Protected API endpoints

### Posts Management

* Create posts
* View posts
* Update posts
* Delete posts
* Server-side pagination
* API response and error handling

### Frontend

* Responsive user interface
* Reusable React components
* Redux Toolkit state management
* Form validation
* REST API integration using Axios
* Protected navigation using React Router

## 📁 Project Structure

```text
full-stack-auth-posts-management/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── package-lock.json
│   ├── eslint.config.js
│   └── vite.config.js
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── models/
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
│
├── database/
│   └── schema.sql
│
├── .gitignore
└── README.md
```

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/YOUR-USERNAME/full-stack-auth-posts-management.git
cd full-stack-auth-posts-management
```

### 2. Setup the Backend

```bash
cd backend
npm install
```

Create a `.env` file inside the backend folder:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_database_password
DB_NAME=posts_management
JWT_SECRET=your_jwt_secret
```

> Do not upload your actual `.env` file or secret values to GitHub.

Start the backend:

```bash
npm start
```

or, if your project uses nodemon:

```bash
npm run dev
```

### 3. Setup the Database

Open MySQL and execute the SQL script:

```text
database/schema.sql
```

Make sure the database name and credentials match your backend `.env` configuration.

### 4. Setup the Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

The backend will normally run at:

```text
http://localhost:5000
```

## 🔐 Security

The project demonstrates:

* bcrypt password hashing
* JWT authentication
* Protected routes
* Role-based authorization
* Environment variables for sensitive configuration
* API authentication middleware

**Never commit passwords, JWT secrets, API keys, or other credentials to GitHub.**

## 📌 Learning Outcomes

Through this project, I gained practical experience in:

* Building React applications
* Managing global state using Redux Toolkit
* Creating and consuming REST APIs
* Implementing authentication and authorization
* Connecting React with Node.js and Express
* Working with MySQL databases
* Implementing CRUD operations
* Implementing server-side pagination
* Debugging frontend and backend integration issues
* Using Git and GitHub for version control

## 👨‍💻 Author

**Mandala Vishnu Vardhan Reddy**

Frontend Developer
React.js | JavaScript | Redux Toolkit | REST APIs

Hyderabad, Telangana, India
