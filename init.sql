-- Initialize TodoMaster Database

-- Create the task table if it doesn't exist
CREATE TABLE IF NOT EXISTS task (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create an index on the completed and created_at columns for better performance
CREATE INDEX IF NOT EXISTS idx_task_completed_created_at ON task(completed, created_at DESC);

-- Create a trigger to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_task_updated_at ON task;
CREATE TRIGGER update_task_updated_at
    BEFORE UPDATE ON task
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data for development (optional)
INSERT INTO task (title, description, completed) VALUES
    ('Welcome to TodoMaster', 'This is your first task. You can edit or delete it anytime.', FALSE),
    ('Complete project setup', 'Set up the development environment and database connections.', FALSE),
    ('Add new features', 'Implement additional features like categories, due dates, or priorities.', FALSE)
ON CONFLICT DO NOTHING;