const knex = require('knex');
const config = require('./knexfile');

async function markMigrationAsCompleted() {
  const db = knex(config.development);
  
  try {
    // Create knex_migrations table if it doesn't exist
    await db.raw(`
      CREATE TABLE IF NOT EXISTS knex_migrations (
        id serial primary key,
        name varchar(255),
        batch integer,
        migration_time timestamptz
      )
    `);
    
    // Insert our migration as completed
    await db('knex_migrations').insert({
      name: '20241026000001_create_todos_table.js',
      batch: 1,
      migration_time: new Date()
    });
    
    console.log('✅ Migration marked as completed successfully!');
    
    // Verify migration status
    const migrations = await db('knex_migrations').select('*');
    console.log('📋 Current migrations:');
    migrations.forEach(m => {
      console.log(`  ${m.name} - Batch ${m.batch} - ${m.migration_time}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await db.destroy();
  }
}

markMigrationAsCompleted();