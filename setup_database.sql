-- Database Setup Script for Todo App
-- Run this script as PostgreSQL superuser (postgres)

-- Create database
CREATE DATABASE todo_app;

-- Create test database
CREATE DATABASE todo_app_test;

-- Connect to the main database
\c todo_app;

-- Create todos table
CREATE TABLE IF NOT EXISTS todos (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create an index on completed status for better query performance
CREATE INDEX IF NOT EXISTS idx_todos_completed ON todos(completed);

-- Create an index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_todos_created_at ON todos(created_at DESC);

-- Create a function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_todos_updated_at ON todos;
CREATE TRIGGER update_todos_updated_at
    BEFORE UPDATE ON todos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data (optional)
INSERT INTO todos (title, description, completed) VALUES
    ('Welcome to TodoMaster!', 'This is your first todo item. You can edit or delete it.', false),
    ('Learn PostgreSQL', 'Set up and learn how to use PostgreSQL database for your applications.', false),
    ('Build React Components', 'Create reusable React components for your todo application.', true),
    ('Style with Tailwind CSS', 'Apply clean and modern styling using Tailwind CSS utilities.', true);

-- Display created table structure
\d todos;

-- Show sample data
SELECT * FROM todos ORDER BY created_at DESC;

-- Connect to test database and create the same table structure
\c todo_app_test;

CREATE TABLE IF NOT EXISTS todos (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_todos_completed ON todos(completed);
CREATE INDEX IF NOT EXISTS idx_todos_created_at ON todos(created_at DESC);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_todos_updated_at ON todos;
CREATE TRIGGER update_todos_updated_at
    BEFORE UPDATE ON todos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Confirmation message
SELECT 'Database setup completed successfully!' as message;