
import {RequestHandler} from 'express';
import {sendError, sendSuccess} from '../utils/response';
import { STATUS_MESSAGE_BY_CODE, STATUS_MESSAGES} from "../utils/statusMessages";
import {STATUS_CODES} from "../utils/statusCodes";
import {AppError} from "../utils/appError";
;
import {RegisterRequestBody} from "../interfaces/auth/register.interface";
import { LoginRequestBody } from '../interfaces/auth/login.interface';
import { forgotPasswordSchema, loginSchema, registerSchema, resetPasswordSchema } from '../validators/auth.validator';
import { forgotPasswordService, handleRefreshTokenService, loginUserService, logoutService, registerUserService, resetPasswordService } from '../services/auth.service';
import { RefreshTokenRequestBody } from '../interfaces/auth/refresh-token.interface';



export const registerUser: RequestHandler<{}, any, RegisterRequestBody> = async (req, res) => {
    const { error, value } = registerSchema.validate(req.body || {}, { abortEarly: false });
    if (error) {
        sendError(res, STATUS_CODES.BAD_REQUEST, error.message, STATUS_MESSAGES.BAD_REQUEST);
        return;
    }

    const { name , email, password, role } = value;

    try {

        const { user, accessToken, refreshToken } = await registerUserService(name, email, password,  role);
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        sendSuccess(
            res,
            STATUS_CODES.CREATED,
            STATUS_MESSAGES.CREATED,
            { user, accessToken }
        );
    } catch (err: any) {
        const status = err instanceof AppError ? err.statusCode : STATUS_CODES.INTERNAL_SERVER_ERROR;
        const message = err.message || 'Something went wrong';
        const errorText = STATUS_MESSAGE_BY_CODE[status] || 'Error';
        sendError(res, status, message, errorText);
    }
};


export const loginUser: RequestHandler<{}, any, LoginRequestBody> = async (req, res) => {
    const { error, value } = loginSchema.validate(req.body || {}, { abortEarly: false });
    if (error) {
        sendError(res, STATUS_CODES.BAD_REQUEST, error.message, STATUS_MESSAGES.BAD_REQUEST);
        return;
    }

    try {
        const { user, accessToken, refreshToken } = await loginUserService(value);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        sendSuccess(
            res,
            STATUS_CODES.OK,
            STATUS_MESSAGES.OK,
            { user, accessToken }
        );
    } catch (err: any) {
        const status = err instanceof AppError ? err.statusCode : STATUS_CODES.INTERNAL_SERVER_ERROR;
        const message = err.message || 'Something went wrong';
        const errorText = STATUS_MESSAGE_BY_CODE[status] || 'Error';
        sendError(res, status, message, errorText);
    }
};

export const refreshAccessToken: RequestHandler<{}, any, RefreshTokenRequestBody> = async (req, res) => {
    const refreshToken = req.cookies?.refreshToken;
    try {
       

        const { newAccessToken, newRefreshToken } = await handleRefreshTokenService(
            refreshToken!,   
        );

        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/auth/refresh',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        sendSuccess(res, STATUS_CODES.OK, STATUS_MESSAGES.OK, { accessToken: newAccessToken });
    } catch (err: any) {
        const status = err instanceof AppError ? err.statusCode : STATUS_CODES.INTERNAL_SERVER_ERROR;
        const message = err.message || 'Something went wrong';
        const errorText = STATUS_MESSAGE_BY_CODE[status] || 'Error';
        sendError(res, status, message, errorText);
    }
};

export const logoutUser: RequestHandler = async (req, res) => {
  try {
    const userId = (req as any).user.userId;

    const result = await logoutService(userId);

    // Clear refresh token cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });

    sendSuccess(res, STATUS_CODES.OK, STATUS_MESSAGES.OK, result);
  } catch (err: any) {
        const status = err instanceof AppError ? err.statusCode : STATUS_CODES.INTERNAL_SERVER_ERROR;
        const message = err.message || 'Something went wrong';
        const errorText = STATUS_MESSAGE_BY_CODE[status] || 'Error';
        sendError(res, status, message, errorText);
    }
};

export const forgotPassword: RequestHandler = async (req, res) => {
  const { error, value } = forgotPasswordSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return sendError(
      res,
      STATUS_CODES.BAD_REQUEST,
      error.message,
      STATUS_MESSAGES.BAD_REQUEST
    );
  }

  try {
    const result = await forgotPasswordService(value.email);
    sendSuccess(res, STATUS_CODES.OK, STATUS_MESSAGES.OK, result);
  } catch (err: any) {
        const status = err instanceof AppError ? err.statusCode : STATUS_CODES.INTERNAL_SERVER_ERROR;
        const message = err.message || 'Something went wrong';
        const errorText = STATUS_MESSAGE_BY_CODE[status] || 'Error';
        sendError(res, status, message, errorText);
    }
};


export const resetPassword: RequestHandler = async (req, res) => {
  const { error, value } = resetPasswordSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return sendError(
      res,
      STATUS_CODES.BAD_REQUEST,
      error.message,
      STATUS_MESSAGES.BAD_REQUEST
    );
  }

  try {
    const result = await resetPasswordService(
      value.email,
      value.otp,
      value.newPassword
    );

    sendSuccess(res, STATUS_CODES.OK, STATUS_MESSAGES.OK, result);
  } catch (err: any) {
        const status = err instanceof AppError ? err.statusCode : STATUS_CODES.INTERNAL_SERVER_ERROR;
        const message = err.message || 'Something went wrong';
        const errorText = STATUS_MESSAGE_BY_CODE[status] || 'Error';
        sendError(res, status, message, errorText);
    }
};

