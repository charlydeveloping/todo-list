# Backend (Express + PostgreSQL)

## Setup
1. Copy `.env.example` to `.env` and edit values.
2. Ensure PostgreSQL is running and accessible with the given credentials.
3. Run migrations: create the `tasks` table using `database/schema.sql` at repo root or let the server auto-create on start.

## Scripts
- dev: start with file watch
- start: start server

## API
Base path: `/api`

- GET /tasks
- POST /tasks { title }
- PATCH /tasks/:id { title?, completed? }
- DELETE /tasks/:id
