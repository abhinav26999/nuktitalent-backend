import jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';

export const generateAccessToken = (userId: string,role: Role ,email:string) => {
    return jwt.sign({ userId,role,email }, process.env.JWT_SECRET!, { expiresIn: '30m' });
};

export const generateRefreshToken = (userId: string) => {
    return jwt.sign({ userId }, process.env.REFRESH_SECRET!, { expiresIn: '7d' });
};

export const verifyToken = (token: string, secret: string) => {
    return jwt.verify(token, secret);
};
