import prisma from '../db/db';
import bcrypt from 'bcryptjs';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';
import {AppError} from "../utils/appError";
import {STATUS_CODES} from "../utils/statusCodes";
import {APP_MESSAGES} from "../utils/statusMessages";
import { Role } from '@prisma/client';
import { LoginRequestBody } from '../interfaces/auth/login.interface';



export const registerUserService = async (name: string,email: string, password: string,role: Role,) => {
    const existingUser = await prisma.user.findFirst({ where: { email } });

    if (existingUser) {
        throw new AppError(APP_MESSAGES.USER_ALREADY_EXISTS, STATUS_CODES.CONFLICT);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role,
        },
    });

    const accessToken = generateAccessToken(user.id,user.role,user.email);
    const refreshToken = generateRefreshToken(user.id);

    const { password: _, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, accessToken, refreshToken}
};

export const loginUserService = async (data: LoginRequestBody) => {
    const user = await prisma.user.findFirst({
        where: { email: data.email },
    });

    if (!user) {
        throw new AppError(APP_MESSAGES.USER_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
        throw new AppError(
            APP_MESSAGES.INVALID_EMAIL_PASSWORD,
            STATUS_CODES.UNAUTHORIZED
        );
    }

    // Blacklist old refresh tokens
    await prisma.token.updateMany({
        where: {
            userId: user.id,
            blacklisted: false,
        },
        data: { blacklisted: true },
    });

    const accessToken = generateAccessToken(user.id, user.role, user.email);
    const refreshToken = generateRefreshToken(user.id);

    await prisma.token.create({
        data: {
            token: refreshToken,
            type: 'REFRESH',
            userId: user.id,
            lastUsedAt: new Date(),
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            blacklisted: false,
        },
    });

    // Remove password safely
    const { password, ...userWithoutPassword } = user;

    return {
        user: userWithoutPassword,
        accessToken,
        refreshToken,
    };
};


