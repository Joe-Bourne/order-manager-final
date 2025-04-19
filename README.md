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
## 📸 Screenshots

### 🏠 Home Page  
Displays a list of customers.

<img src="https://github.com/user-attachments/assets/ddabf0a9-2dac-45d9-bb5e-f0e31f8bdd18" alt="HomePage" width="600"/>

---

### ➕ Create Customer  
Press the **Create Customer** button to add new customers.

<img src="https://github.com/user-attachments/assets/853a1f69-d7f8-49ed-9933-cce24b2b5b44" alt="AddCustomer" width="600"/>

---

### 📋 View Orders  
Click the customer row or press **View Orders** to see their orders.

<img src="https://github.com/user-attachments/assets/ec571b1b-35f3-4314-b67a-a7b08c2822bb" alt="CustomerOrders" width="600"/>

---

### 🛒 Add Order  
Press **Add Order** to create a new order.

<img src="https://github.com/user-attachments/assets/3a3921ee-7b3c-4266-8cb2-eff9575b73ef" alt="AddOrder" width="600"/>

---

### ✏️ Edit or Delete Customer  
Press **Edit Customer** to update or remove a customer.

<img src="https://github.com/user-attachments/assets/3f3dd2b1-cae2-4158-9c40-94d50a70f1ec" alt="EditCustomer" width="600"/>




