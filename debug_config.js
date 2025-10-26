require('dotenv').config();
const config = require('./knexfile');

console.log('=== DEBUG: Knex Configuration ===');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DATABASE_URL set:', !!process.env.DATABASE_URL);
console.log('DATABASE_URL length:', process.env.DATABASE_URL ? process.env.DATABASE_URL.length : 0);

console.log('\n=== Development Config ===');
console.log(JSON.stringify(config.development, null, 2));

// Test the condition
const isNeon = process.env.DB_HOST && process.env.DB_HOST.includes('neon.tech');
console.log('\n=== Neon Detection ===');
console.log('Is Neon?:', isNeon);
console.log('DB_HOST includes neon.tech:', process.env.DB_HOST ? process.env.DB_HOST.includes('neon.tech') : false);

if (isNeon) {
  console.log('\n=== Using CONNECTION STRING ===');
  console.log('Connection string:', process.env.DATABASE_URL);
} else {
  console.log('\n=== Using INDIVIDUAL PARAMS ===');
  console.log('Host:', process.env.DB_HOST);
  console.log('User:', process.env.DB_USER);
  console.log('Database:', process.env.DB_NAME);
}