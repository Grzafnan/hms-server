import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthUser, JwtPayload } from '../../types';
import { sendError } from '../../utils/response';
declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return sendError(res, 'Access token required', null, 401);
  }

  jwt.verify(token, process.env.JWT_SECRET!, (err, decoded) => {
    if (err) {
      return sendError(res, 'Invalid or expired token', null, 403);
    }

    const payload = decoded as JwtPayload;
    req.user = {
      id: payload.userId,
      username: payload.username,
      role: payload.role,
      staffId: payload.staffId
    };
    next();
  });
};

export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return sendError(res, 'Authentication required', null, 401);
    }

    if (!roles.includes(req.user.role)) {
      return sendError(res, 'Insufficient permissions', null, 403);
    }

    next();
  };
};