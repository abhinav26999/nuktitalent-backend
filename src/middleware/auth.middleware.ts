import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from '../interfaces/auth/jwt-payload.interface';
import { sendError } from '../utils/response';
import { STATUS_CODES } from "../utils/statusCodes";
import { APP_MESSAGES, STATUS_MESSAGES } from "../utils/statusMessages";
import { verifyToken } from "../utils/jwt";
import { Role } from '@prisma/client';
import prisma from '../db/db';


export interface AuthenticatedRequest extends Request {
  user?: JwtPayload & { role?: Role; email?: string , };
}

export const authenticate = (roles: Role[] = []) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(
        res,
        STATUS_CODES.UNAUTHORIZED,
        APP_MESSAGES.TOKEN_REQUIRED,
        STATUS_MESSAGES.UNAUTHORIZED
      );
    }

    const token = authHeader.split(' ')[1];

    try {
      
      const decoded = verifyToken(token, process.env.JWT_SECRET!) as JwtPayload;

    
      const user = await prisma.user.findFirst({ where: { id: decoded.userId } });
      if (!user) {
        return sendError(
          res,
          STATUS_CODES.NOT_FOUND,
          APP_MESSAGES.USER_NOT_FOUND,
          STATUS_MESSAGES.NOT_FOUND
        );
      }

      
      if (roles.length > 0 && !roles.includes(user.role)) {
        return sendError(
          res,
          STATUS_CODES.FORBIDDEN,
          APP_MESSAGES.FORBIDDEN,
          STATUS_MESSAGES.FORBIDDEN
        );
      }

      
      req.user = { ...decoded, role: user.role, email: user.email };

      next();
    } catch (err) {
      console.error('Authentication error:', err);
      return sendError(
        res,
        STATUS_CODES.UNAUTHORIZED,
        APP_MESSAGES.INVALID_EXPIRE_TOKEN,
        STATUS_MESSAGES.UNAUTHORIZED
      );
    }
  };
};

export default authenticate;
