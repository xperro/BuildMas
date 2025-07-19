# BuildMas – Construction Estimation App

> A full-stack web application to manage construction estimates and clients for construction companies.

![TypeScript](https://img.shields.io/badge/TypeScript-blue?logo=typescript)
![React](https://img.shields.io/badge/React-20232a?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?logo=postgresql)
![Docker](https://img.shields.io/badge/Docker-blue?logo=docker)
![Material UI](https://img.shields.io/badge/Material--UI-007FFF?logo=mui)

---

## Demo: Start Everything Automatically

This project includes a ready-to-go `run.sh` script for one-line startup.

### Requirements
- Docker
- Docker Compose
- Bash (Unix/Mac/Linux, or Git Bash on Windows)

### Run the app
```bash
./run.sh
```

> Make sure Docker is running before executing the script.

This will:
- Build the **backend**, **frontend**, and **PostgreSQL** DB containers
- Launch the app on [http://localhost:3000](http://localhost:3000)
- Backend will be available at [http://localhost:3001](http://localhost:3001)

---

## Tech Stack

| Layer      | Tech                                                                 |
|------------|----------------------------------------------------------------------|
| Frontend   | ![React](https://img.shields.io/badge/-React-61DAFB?logo=react) + ![TypeScript](https://img.shields.io/badge/-TypeScript-3178c6?logo=typescript) + ![Material UI](https://img.shields.io/badge/-MUI-007FFF?logo=mui) |
| Backend    | ![Node.js](https://img.shields.io/badge/-Node.js-339933?logo=node.js) + Express + ![TypeScript](https://img.shields.io/badge/-TS-3178c6?logo=typescript) |
| Database   | ![PostgreSQL](https://img.shields.io/badge/-PostgreSQL-336791?logo=postgresql) with Prisma ORM |
| Containerization | ![Docker](https://img.shields.io/badge/-Docker-blue?logo=docker) + Docker Compose |

---

## Project Structure

```txt
BuildMas/
├── backend/               # Node.js + Express + Prisma + API logic
├── frontend/              # React + TypeScript + Material UI + Routing
├── postman/               # Example Postman collection for API
├── docker-compose.yml     # Services orchestration
├── run.sh                 # One-liner launch script
└── README.md              # You're here
```

---

## Features

-  **Basic auth** (mocked user context)
-  **Clients & Estimates management**
-  Dynamic **Materials input & cost calculation**
-  **Status transitions** with color-coded labels:
- `Initiated` → `In Progress` → `Completed`
-  Materials only stored in localStorage (not persisted)
-  Confirmation before marking estimate as completed
-  Full Docker support for local dev

---

## API Testing (Postman)

You’ll find a sample Postman collection under `/postman/postman.json`.

You can import it into [Postman](https://www.postman.com/) and test endpoints such as:
- `GET /clients`
- `POST /estimates`
- `PUT /estimates/:id`
- etc.

> For production-grade API docs, Swagger/OpenAPI is recommended.

---

## In Case `run.sh` Fails

Try running manually:

```bash
# Clean containers and images
docker-compose down -v --remove-orphans
docker rmi buildmas_backend || true

# Rebuild and run
docker-compose up --build
```

- Frontend: http://localhost:3000  
- Backend: http://localhost:3001


## Author

Made with ❤️ for the BuildMas Technical Test  
Jorge Aguilera
Contact: [aguileracontacto@gmail.com] 

---