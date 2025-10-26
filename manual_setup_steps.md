# Manual Database Setup Steps

## 1. Connect to PostgreSQL
psql -U postgres

## 2. Create the databases
CREATE DATABASE todo_app;
CREATE DATABASE todo_app_test;

## 3. Connect to the main database
\c todo_app;

## 4. Create the todos table
CREATE TABLE IF NOT EXISTS todos (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

## 5. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_todos_completed ON todos(completed);
CREATE INDEX IF NOT EXISTS idx_todos_created_at ON todos(created_at DESC);

## 6. Create function to auto-update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

## 7. Create trigger for auto-updating updated_at
CREATE TRIGGER update_todos_updated_at
    BEFORE UPDATE ON todos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

## 8. Insert sample data (optional)
INSERT INTO todos (title, description, completed) VALUES
    ('Welcome to TodoMaster!', 'This is your first todo item. You can edit or delete it.', false),
    ('Learn PostgreSQL', 'Set up and learn how to use PostgreSQL database.', false),
    ('Build React Components', 'Create reusable React components.', true),
    ('Style with Tailwind CSS', 'Apply clean styling with Tailwind.', true);

## 9. Verify the setup
SELECT * FROM todos ORDER BY created_at DESC;

## 10. Set up test database (repeat steps 3-7 for todo_app_test)
\c todo_app_test;
-- Repeat table creation and setup commands

## 11. Exit PostgreSQL
\q