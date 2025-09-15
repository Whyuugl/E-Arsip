import bcrypt from 'bcryptjs';
import jwt, { type Secret, type SignOptions } from 'jsonwebtoken';
import pool from './database';

const JWT_SECRET: Secret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN: SignOptions['expiresIn'] = (process.env.JWT_EXPIRES_IN as SignOptions['expiresIn']) || '7d';

export interface User {
  id: number;
  username: string;
  created_at: Date;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  password: string;
}

// Hash password
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

// Verify password
export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

// Generate JWT token
export const generateToken = (user: User): string => {
  const options: SignOptions = { expiresIn: JWT_EXPIRES_IN };
  return jwt.sign(
    { 
      id: user.id, 
      username: user.username
    },
    JWT_SECRET,
    options
  );
};

// Verify JWT token
export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// Get user by username
export const getUserByUsername = async (username: string): Promise<User | null> => {
  try {
    const result = await pool.query(
      'SELECT id, username, created_at FROM users WHERE username = $1',
      [username]
    );
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return result.rows[0];
  } catch (error) {
    console.error('Error getting user by username:', error);
    return null;
  }
};

// Get user by ID
export const getUserById = async (id: number): Promise<User | null> => {
  try {
    const result = await pool.query(
      'SELECT id, username, created_at FROM users WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return result.rows[0];
  } catch (error) {
    console.error('Error getting user by ID:', error);
    return null;
  }
};

// Get user password hash
export const getUserPasswordHash = async (username: string): Promise<string | null> => {
  try {
    const result = await pool.query(
      'SELECT password_hash FROM users WHERE username = $1',
      [username]
    );
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return result.rows[0].password_hash;
  } catch (error) {
    console.error('Error getting user password hash:', error);
    return null;
  }
};

// Create new user
export const createUser = async (userData: RegisterData): Promise<User | null> => {
  try {
    const hashedPassword = await hashPassword(userData.password);
    
    const result = await pool.query(
      `INSERT INTO users (username, password_hash) 
       VALUES ($1, $2) 
       RETURNING id, username, created_at`,
      [userData.username, hashedPassword]
    );
    
    return result.rows[0];
  } catch (error) {
    console.error('Error creating user:', error);
    return null;
  }
};

// Login user
export const loginUser = async (credentials: LoginCredentials): Promise<{ user: User; token: string } | null> => {
  try {
    const user = await getUserByUsername(credentials.username);
    if (!user) {
      return null;
    }
    
    const passwordHash = await getUserPasswordHash(credentials.username);
    if (!passwordHash) {
      return null;
    }
    
    const isValidPassword = await verifyPassword(credentials.password, passwordHash);
    if (!isValidPassword) {
      return null;
    }
    
    const token = generateToken(user);
    
    return { user, token };
  } catch (error) {
    console.error('Error logging in user:', error);
    return null;
  }
};
