const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Database configuration
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'arsip_kependudukan', // Connect to default postgres db first
  password: process.env.DB_PASSWORD || 'admin',
  port: parseInt(process.env.DB_PORT || '5432'),
});

async function setupDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('🔧 Setting up database...');
    
    // Create database if it doesn't exist
    const dbName = process.env.DB_NAME || 'arsip_kependudukan';
    await client.query(`CREATE DATABASE ${dbName}`);
    console.log(`✅ Database '${dbName}' created successfully`);
    
  } catch (error) {
    if (error.code === '42P04') {
      console.log(`ℹ️  Database '${process.env.DB_NAME || 'arsip_kependudukan'}' already exists`);
    } else {
      console.error('❌ Error creating database:', error.message);
      throw error;
    }
  } finally {
    client.release();
  }
  
  // Now connect to the new database
  const appPool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'arsip_kependudukan',
    password: process.env.DB_PASSWORD || 'admin',
    port: parseInt(process.env.DB_PORT || '5432'),
  });
  
  const appClient = await appPool.connect();
  
  try {
    // Read and execute schema
    const schemaPath = path.join(__dirname, '../lib/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('📋 Executing schema...');
    await appClient.query(schema);
    console.log('✅ Schema executed successfully');
    
    console.log('🎉 Database setup completed!');
    console.log('\n📝 Default admin credentials:');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    
  } catch (error) {
    console.error('❌ Error executing schema:', error.message);
    throw error;
  } finally {
    appClient.release();
    await appPool.end();
  }
}

// Run setup
setupDatabase()
  .then(() => {
    console.log('\n✅ Database setup completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Database setup failed:', error);
    process.exit(1);
  });
