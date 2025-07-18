# BuildMas – Construction Estimation App

A full-stack web application to manage construction estimates and clients.

## Tech Stack

- **Frontend**: React + TypeScript + Material UI
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Containerization**: Docker + Docker Compose

---

##   Getting Started

###   Requirements

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

---

##  Project Structure

BuildMas/
├── backend/ # Node.js + Express + Prisma
├── frontend/ # React + TypeScript + Material UI
├── docker-compose.yml
└── README.md


##  Running the project with Docker Compose

The entire application (PostgreSQL, backend and frontend) runs with one command:

docker-compose up --build

-----------------------------------------------

Demo Instructions (for evaluator)
Clone this repo

Run:docker-compose up --build

Backend is ready at: http://localhost:3001