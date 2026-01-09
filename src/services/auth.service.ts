import prisma from '../db/db';
import bcrypt from 'bcryptjs';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';
import {AppError} from "../utils/appError";
import {STATUS_CODES} from "../utils/statusCodes";
import {APP_MESSAGES} from "../utils/statusMessages";
import { Role } from '@prisma/client';
import jwt from "jsonwebtoken";
import { LoginRequestBody } from '../interfaces/auth/login.interface';
import { OtpPurpose, sendOtpEmail } from '../utils/email';
import { calculateExpiry } from '../utils/expiry';
import { generateOtpCode } from '../utils/otp';



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

export const handleRefreshTokenService = async (
    refreshToken: string,
) => {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET!) as { userId: string };

    const storedToken = await prisma.token.findFirst({
        where: {
            token: refreshToken,
            userId: decoded.userId,
            blacklisted: false,
        },
    });

    if (!storedToken) {
        throw new AppError(APP_MESSAGES.REFRESH_TOKEN_INVALID, STATUS_CODES.UNAUTHORIZED);
    }

    const user = await prisma.user.findFirst({ where: { id: decoded.userId  } });
    if (!user) {
        throw new AppError(APP_MESSAGES.USER_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    }

    const newAccessToken = generateAccessToken(decoded.userId, user.role, user.email);
    const newRefreshToken = generateRefreshToken(decoded.userId);

    await prisma.token.create({
        data: {
            token: newRefreshToken,
            type: 'REFRESH',
            userId: decoded.userId,
            lastUsedAt: new Date(),
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            blacklisted: false,
        },
    });

    return { newAccessToken, newRefreshToken };
};

/* ================= FORGOT PASSWORD ================= */
export const forgotPasswordService = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new AppError(APP_MESSAGES.USER_NOT_FOUND, STATUS_CODES.NOT_FOUND);
  }

  // Invalidate previous OTPs
  await prisma.oTPCode.updateMany({
    where: {
      userId: user.id,
      usedAt: null,
    },
    data: {
      usedAt: new Date(),
    },
  });

  const otp = generateOtpCode();
  const expiresAt = calculateExpiry(10);

  await prisma.oTPCode.create({
    data: {
      code: otp,
      userId: user.id,
      expiresAt,
    },
  });

  await sendOtpEmail(email, otp, OtpPurpose.FORGOT_PASSWORD);

  return {
    message: APP_MESSAGES.OTP_SENT,
  };
};

/* ================= RESET PASSWORD ================= */
export const resetPasswordService = async (
  email: string,
  otp: string,
  newPassword: string
) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new AppError(APP_MESSAGES.USER_NOT_FOUND, STATUS_CODES.NOT_FOUND);
  }

  const otpEntry = await prisma.oTPCode.findFirst({
    where: {
      userId: user.id,
      code: otp,
      usedAt: null,
      expiresAt: { gt: new Date() },
    },
  });

  if (!otpEntry) {
    throw new AppError(
      APP_MESSAGES.INVALID_OR_EXPIRED_OTP,
      STATUS_CODES.BAD_REQUEST
    );
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    }),
    prisma.oTPCode.update({
      where: { id: otpEntry.id },
      data: { usedAt: new Date() },
    }),
  ]);

  return {
    message: APP_MESSAGES.PASSWORD_RESET_SUCCESSFULLY,
  };
};

export const logoutService = async (userId: string) => {
  const result = await prisma.token.updateMany({
    where: {
      userId,
      blacklisted: false,
      type: 'REFRESH',
    },
    data: {
      blacklisted: true,
      lastUsedAt: new Date(),
    },
  });

  return {
    message: APP_MESSAGES.LOGGED_OUT_SUCCESSFULLY,
    revokedTokens: result.count,
  };
};


