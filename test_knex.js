require('dotenv').config();
const knex = require('knex');
const config = require('./knexfile');

async function testKnexConnection() {
  console.log('🔍 Testing Knex configuration...');
  
  try {
    const db = knex(config.development);
    console.log('✅ Knex instance created successfully');
    
    // Test connection
    await db.raw('SELECT 1 as test');
    console.log('✅ Database connection test passed');
    
    // Test todos query
    const todos = await db('todos').select('*').limit(3);
    console.log(`✅ Found ${todos.length} todos in database`);
    todos.forEach(todo => {
      console.log(`  - ${todo.id}: ${todo.title} (${todo.completed ? 'completed' : 'pending'})`);
    });
    
    await db.destroy();
    console.log('✅ Connection closed successfully');
    
  } catch (error) {
    console.error('❌ Knex connection failed:');
    console.error('Error:', error.message);
    console.error('Code:', error.code);
    
    if (error.message.includes('insecure')) {
      console.log('\n💡 SSL Issue detected. Checking configuration...');
      console.log('DB_HOST:', process.env.DB_HOST);
      console.log('DATABASE_URL set:', !!process.env.DATABASE_URL);
      console.log('Config:', JSON.stringify(config.development.connection, null, 2));
    }
  }
}

testKnexConnection();