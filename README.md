# 🧾 Order Manager

**Order Manager** is a full-stack demo application built with **React (TypeScript)** and **ASP.NET Core** to manage customers, orders, and products. 
It includes features like customer order tracking, order entry via modal forms, live API status monitoring, and responsive UI.

---

## 🚀 Features

- ✅ React frontend with routing and state management
- ✅ ASP.NET Core Web API
- ✅ SQL Server database with seed data and temporal tables
- ✅ Reusable custom hooks (`useOrders`)
- ✅ Live API status monitoring (`/ping`)
- ✅ Order entry via modal with client-side validation
- ✅ Error alerts and retry logic
- ✅ Dockerized for local development
- ✅ GitHub Actions for CI/CD (Docker build + publish to GHCR)

---

# 🐳 Running Order Manager Locally with Docker

This project includes everything you need to run the full Order Manager stack — frontend, backend, and database — using Docker.

---

## 📁 Project Structure

```
/
├── ordermanager.client/      # React frontend
├── OrderManager.Server/      # ASP.NET Core Web API backend
├── docker-compose.yml        # Docker services config
├── dockerfile                # Backend build instructions
└── DockerBuildAndRun.cmd     # Windows batch script to automate docker workflow
```

---

## 🚀 Getting Started

### 🔁 Option 1: Standard Docker Command (Cross-platform)
From the project root:

```bash
docker-compose up --build
```

This will:
- Build the ASP.NET Core backend
- Set up a SQL Server database with seed data
- Launch the React frontend

---

### 🪟 Option 2: One-Click for Windows

For Windows users, a convenience script is included:

```cmd
DockerBuildAndRun.cmd
```

Just double-click it or run in a terminal from the project root.  
This script builds the backend Docker image and starts the containers via `docker-compose`.

---

## 🌐 Access the App

- **Frontend (React)**: http://localhost:8080
- **Swagger**: http://localhost:8080/swagger
- **SQL Server**: localhost:1433

---


