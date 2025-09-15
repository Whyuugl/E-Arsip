const bcrypt = require('bcryptjs');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'arsip_kependudukan',
  password: process.env.DB_PASSWORD || 'admin',
  port: parseInt(process.env.DB_PORT || '5432'),
});

async function createUser(username = 'admin', password = 'admin123') {
  const client = await pool.connect();
  
  try {
    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Insert user
    const result = await client.query(
      'INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id, username, created_at',
      [username, hashedPassword]
    );
    
    console.log('✅ User created successfully:');
    console.log('Username:', result.rows[0].username);
    console.log('Password:', password);
    console.log('ID:', result.rows[0].id);
    console.log('Created at:', result.rows[0].created_at);
    console.log('\n⚠️  IMPORTANT: Change the default password after first login!');
    
  } catch (error) {
    if (error.code === '23505') { // Unique violation
      console.log(`❌ User already exists with username "${username}"`);
    } else {
      console.error('❌ Error creating user:', error.message);
    }
  } finally {
    client.release();
    await pool.end();
  }
}

// Get command line arguments
const args = process.argv.slice(2);
const username = args[0] || 'admin';
const password = args[1] || 'admin123';

console.log(`Creating user with username: "${username}" and password: "${password}"`);
createUser(username, password);
