import { NextApiRequest, NextApiResponse } from 'next';
import { loginUser } from '../../../lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: 'Username and password are required'
      });
    }

    // Attempt login
    const result = await loginUser({ username, password });

    if (!result) {
      return res.status(401).json({
        success: false,
        error: 'Invalid username or password'
      });
    }

    // Set HTTP-only cookie for token
    res.setHeader('Set-Cookie', [
      `token=${result.token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Strict`
    ]);

    // Return success response
    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        id: result.user.id,
        username: result.user.username,
        created_at: result.user.created_at
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}
