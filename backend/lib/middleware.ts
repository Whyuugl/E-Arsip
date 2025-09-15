import { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken, getUserById } from './auth';

export interface AuthenticatedRequest extends NextApiRequest {
  user?: {
    id: number;
    username: string;
    created_at: Date;
  };
}

export const withAuth = (handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>) => {
  return async (req: AuthenticatedRequest, res: NextApiResponse) => {
    try {
      // Get token from cookie
      const token = req.cookies.token;

      if (!token) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
      }

      // Verify token
      const decoded = verifyToken(token);
      if (!decoded) {
        return res.status(401).json({
          success: false,
          error: 'Invalid token'
        });
      }

      // Get user data
      const user = await getUserById(decoded.id);
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'User not found'
        });
      }

      // Add user to request
      req.user = {
        id: user.id,
        username: user.username,
        created_at: user.created_at
      };

      // Call the original handler
      return handler(req, res);

    } catch (error) {
      console.error('Auth middleware error:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  };
};

// Simple auth check without role-based access control
export const requireAuth = (handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>) => {
  return withAuth(handler);
};

