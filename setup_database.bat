@echo off
echo ===================================
echo Todo App Database Setup
echo ===================================
echo.
echo This script will create the PostgreSQL databases for your Todo App.
echo You will need to enter your PostgreSQL password when prompted.
echo.
echo Creating databases: todo_app and todo_app_test
echo.
pause

echo Running database setup script...
psql -U postgres -f setup_database.sql

echo.
echo ===================================
echo Database setup completed!
echo ===================================
echo.
echo Your databases are now ready:
echo - Main database: todo_app
echo - Test database: todo_app_test
echo.
echo You can now start your backend server with: npm start
echo.
pause