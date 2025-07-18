# BuildMas – Construction Estimation App

A full-stack web application to manage construction estimates and clients.

##  Running the project Automatically (BASH RUN.SH INCLUDED IN ROOT SOURCE).
-----------------------------------------------

Demo Instructions
Required DOCKER
Clone this repo

You can run the project using bash run.sh (required docker installed before run)

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



##  If run.sh Fails

Alternative run project instrucctions

# Clean up in case of cache or orphaned containers
docker-compose down -v --remove-orphans
docker rmi buildmas_backend || true

# Build and start the stack
docker-compose up --build

Backend is ready at: http://localhost:3001

##  POSTMAN ENDPOINT

This project includes postman.json to import backends calls, this is a example.
In real project its recommended to use swagger for example.
