# Alternative Database Setup Methods

## Method 1: If you don't have a PostgreSQL password set

If you just installed PostgreSQL and haven't set a password for the 'postgres' user:

1. **Find your PostgreSQL installation directory** (usually in Program Files)
2. **Open Command Prompt as Administrator**
3. **Navigate to PostgreSQL bin directory**:
   ```cmd
   cd "C:\Program Files\PostgreSQL\17\bin"
   ```
4. **Start PostgreSQL service** (if not running):
   ```cmd
   net start postgresql-x64-17
   ```
5. **Connect using peer authentication**:
   ```cmd
   psql -U postgres
   ```

## Method 2: Set a password for postgres user

1. **Connect to PostgreSQL**:
   ```cmd
   psql -U postgres
   ```
2. **Set password**:
   ```sql
   ALTER USER postgres PASSWORD 'your_password_here';
   ```
3. **Update your .env file** with the password

## Method 3: Create a new database user (recommended)

1. **Connect as postgres**:
   ```cmd
   psql -U postgres
   ```
2. **Create new user**:
   ```sql
   CREATE USER todo_user WITH PASSWORD 'todo_password';
   ```
3. **Grant privileges**:
   ```sql
   ALTER USER todo_user CREATEDB;
   ```
4. **Update .env file** to use the new user

## Method 4: Use pgAdmin (GUI)

If you have pgAdmin installed:
1. Open pgAdmin
2. Connect to your PostgreSQL server
3. Right-click "Databases" → Create → Database
4. Name it "todo_app"
5. Repeat for "todo_app_test"
6. Run the table creation SQL in Query Tool

## Method 5: Environment-based setup

You can also create a .pgpass file in your home directory:
```
hostname:port:database:username:password
localhost:5432:*:postgres:your_password
```