# To-Do List App (Vue 3 + Express + PostgreSQL)

This is a simple full-stack To-Do List application.

- Frontend: Vue 3 + Vite + TailwindCSS
- Backend: Node.js + Express + PostgreSQL (pg)
- Database: PostgreSQL schema for `tasks`

Services:
- Backend runs at http://localhost:3000
- Frontend consumes API at http://localhost:3000/api (configurable via `VITE_API_BASE_URL`)

## Quick start

1. Create the database and table

See `database/schema.sql` and apply it to your PostgreSQL instance.

2. Backend
- Copy `backend/.env.example` to `backend/.env` and set variables
- Install deps and run

3. Frontend
- Copy `frontend/.env.example` to `frontend/.env` and set `VITE_API_BASE_URL`
- Install deps and run

Detailed steps are in each subfolder README sections below.

## Database

See `database/schema.sql` for the `tasks` table definition.

## Backend

- Express server exposes `/api/tasks` CRUD
- Input validation via `express-validator`
- PostgreSQL via `pg`

## Frontend

- Vue 3 + Vite app with Tailwind UI
- Create, list, toggle complete, and delete tasks
