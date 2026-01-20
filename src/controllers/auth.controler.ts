import { RequestHandler } from "express";
import { sendError, sendSuccess } from "../utils/response";
import { STATUS_MESSAGE_BY_CODE, STATUS_MESSAGES } from "../utils/statusMessages";
import { STATUS_CODES } from "../utils/statusCodes";
import { AppError } from "../utils/appError";

import { RegisterRequestBody } from "../interfaces/auth/register.interface";
import { LoginRequestBody } from "../interfaces/auth/login.interface";
import { RefreshTokenRequestBody } from "../interfaces/auth/refresh-token.interface";

import {
    forgotPasswordSchema,
    loginSchema,
    registerSchema,
    resetPasswordSchema,
} from "../validators/auth.validator";

import {
    forgotPasswordService,
    handleRefreshTokenService,
    loginUserService,
    logoutService,
    registerUserService,
    resetPasswordService,
} from "../services/auth.service";

/* ================= REGISTER ================= */
export const registerUser: RequestHandler<{}, any, RegisterRequestBody> = async (
    req,
    res
) => {
    const { error, value } = registerSchema.validate(req.body, {
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
        const { user, accessToken, refreshToken } =
            await registerUserService(
                value.name,
                value.email,
                value.password,
                value.role
            );

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            path: "/",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        sendSuccess(res, STATUS_CODES.CREATED, STATUS_MESSAGES.CREATED, {
            user,
            accessToken,
        });
    } catch (err: any) {
        const status =
            err instanceof AppError
                ? err.statusCode
                : STATUS_CODES.INTERNAL_SERVER_ERROR;
        sendError(
            res,
            status,
            err.message || "Something went wrong",
            STATUS_MESSAGE_BY_CODE[status]
        );
    }
};

/* ================= LOGIN ================= */
export const loginUser: RequestHandler<{}, any, LoginRequestBody> = async (
    req,
    res
) => {
    const { error, value } = loginSchema.validate(req.body, {
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
        const { user, accessToken, refreshToken } =
            await loginUserService(value);

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            path: "/",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        sendSuccess(res, STATUS_CODES.OK, STATUS_MESSAGES.OK, {
            user,
            accessToken,
        });
    } catch (err: any) {
        const status =
            err instanceof AppError
                ? err.statusCode
                : STATUS_CODES.INTERNAL_SERVER_ERROR;
        sendError(
            res,
            status,
            err.message || "Something went wrong",
            STATUS_MESSAGE_BY_CODE[status]
        );
    }
};

/* ================= REFRESH TOKEN ================= */
export const refreshAccessToken: RequestHandler<
    {},
    any,
    RefreshTokenRequestBody
> = async (req, res) => {
    try {
        const refreshToken = req.cookies?.refreshToken;
        if (!refreshToken) {
            throw new AppError("Refresh token missing", STATUS_CODES.UNAUTHORIZED);
        }

        const { newAccessToken, newRefreshToken } =
            await handleRefreshTokenService(refreshToken);

        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            path: "/",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        sendSuccess(res, STATUS_CODES.OK, STATUS_MESSAGES.OK, {
            access: { token: newAccessToken },
        });
    } catch (err: any) {
        const status =
            err instanceof AppError
                ? err.statusCode
                : STATUS_CODES.INTERNAL_SERVER_ERROR;
        sendError(
            res,
            status,
            err.message || "Something went wrong",
            STATUS_MESSAGE_BY_CODE[status]
        );
    }
};

/* ================= LOGOUT ================= */
export const logoutUser: RequestHandler = async (req, res) => {
    try {
        const userId = (req as any).user.userId;
        const result = await logoutService(userId);

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            path: "/",
        });

        sendSuccess(res, STATUS_CODES.OK, STATUS_MESSAGES.OK, result);
    } catch (err: any) {
        const status =
            err instanceof AppError
                ? err.statusCode
                : STATUS_CODES.INTERNAL_SERVER_ERROR;
        sendError(
            res,
            status,
            err.message || "Something went wrong",
            STATUS_MESSAGE_BY_CODE[status]
        );
    }
};

/* ================= FORGOT PASSWORD ================= */
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
        const status =
            err instanceof AppError
                ? err.statusCode
                : STATUS_CODES.INTERNAL_SERVER_ERROR;
        sendError(
            res,
            status,
            err.message || "Something went wrong",
            STATUS_MESSAGE_BY_CODE[status]
        );
    }
};

/* ================= RESET PASSWORD ================= */
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
        const status =
            err instanceof AppError
                ? err.statusCode
                : STATUS_CODES.INTERNAL_SERVER_ERROR;
        sendError(
            res,
            status,
            err.message || "Something went wrong",
            STATUS_MESSAGE_BY_CODE[status]
        );
    }
};
