const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: process.env.DB_HOST && process.env.DB_HOST.includes('neon.tech') ? { rejectUnauthorized: false } : false
});

async function testConnection() {
  try {
    console.log('🔍 Testing database connection...');
    console.log(`Host: ${process.env.DB_HOST}`);
    console.log(`Port: ${process.env.DB_PORT}`);
    console.log(`User: ${process.env.DB_USER}`);
    console.log(`Database: ${process.env.DB_NAME}`);
    
    const client = await pool.connect();
    console.log('✅ Connected to PostgreSQL successfully!');
    
    // Test if todos table exists
    const result = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'todos'
      );
    `);
    
    if (result.rows[0].exists) {
      console.log('✅ todos table exists!');
      
      // Count todos
      const count = await client.query('SELECT COUNT(*) FROM todos');
      console.log(`📊 Current todos count: ${count.rows[0].count}`);
      
      // Show sample todos
      const todos = await client.query('SELECT id, title, completed FROM todos LIMIT 3');
      console.log('📝 Sample todos:');
      todos.rows.forEach(todo => {
        console.log(`  ${todo.id}: ${todo.title} (${todo.completed ? 'completed' : 'pending'})`);
      });
    } else {
      console.log('❌ todos table does not exist. Please run setup_database.sql');
    }
    
    client.release();
    
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error(`Error: ${error.message}`);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Possible solutions:');
      console.log('1. Make sure PostgreSQL service is running');
      console.log('2. Check if port 5432 is correct');
      console.log('3. Verify host is localhost');
    } else if (error.code === '28P01') {
      console.log('\n💡 Authentication failed:');
      console.log('1. Check your DB_PASSWORD in .env file');
      console.log('2. Verify DB_USER is correct');
    } else if (error.code === '3D000') {
      console.log('\n💡 Database does not exist:');
      console.log('1. Run: CREATE DATABASE todo_app; in PostgreSQL');
      console.log('2. Or run the setup_database.sql script');
    }
  } finally {
    await pool.end();
  }
}

testConnection();