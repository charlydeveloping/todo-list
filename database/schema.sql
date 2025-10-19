-- PostgreSQL schema for To-Do List app

CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
);

-- Sample data (optional)
-- INSERT INTO tasks (title, completed) VALUES ('Primera tarea', false);
