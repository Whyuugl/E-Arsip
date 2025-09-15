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

const dummyUsers = [
  { username: 'admin', password: 'admin123' },
  { username: 'user1', password: 'user123' },
  { username: 'user2', password: 'user456' }
];

async function createDummyUsers() {
  const client = await pool.connect();
  
  try {
    console.log('🚀 Creating dummy users for testing...\n');
    
    for (const user of dummyUsers) {
      try {
        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(user.password, saltRounds);
        
        // Insert user
        const result = await client.query(
          'INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id, username, created_at',
          [user.username, hashedPassword]
        );
        
        console.log(`✅ User created: ${user.username} (ID: ${result.rows[0].id})`);
        console.log(`   Password: ${user.password}`);
        console.log(`   Created: ${result.rows[0].created_at}\n`);
        
      } catch (error) {
        if (error.code === '23505') { // Unique violation
          console.log(`⚠️  User "${user.username}" already exists, skipping...\n`);
        } else {
          console.error(`❌ Error creating user "${user.username}":`, error.message);
        }
      }
    }
    
    console.log('🎯 Dummy users ready for testing!');
    console.log('\n📋 Login credentials:');
    console.log('┌──────────┬──────────┐');
    console.log('│ Username │ Password │');
    console.log('├──────────┼──────────┤');
    console.log('│ admin    │ admin123 │');
    console.log('│ user1    │ user123  │');
    console.log('│ user2    │ user456  │');
    console.log('└──────────┴──────────┘');
    
  } catch (error) {
    console.error('❌ Error in createDummyUsers:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

createDummyUsers();
