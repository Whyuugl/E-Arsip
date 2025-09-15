import { NextApiRequest, NextApiResponse } from 'next';
import { requireAuth, AuthenticatedRequest } from '../../lib/middleware';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  try {
    // User sudah terautentikasi karena menggunakan middleware requireAuth
    res.status(200).json({
      success: true,
      message: 'This is a protected endpoint',
      user: {
        id: req.user!.id,
        username: req.user!.username,
        created_at: req.user!.created_at
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Protected endpoint error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}

export default requireAuth(handler);
