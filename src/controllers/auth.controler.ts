
import {RequestHandler} from 'express';
import {sendError, sendSuccess} from '../utils/response';
import { STATUS_MESSAGE_BY_CODE, STATUS_MESSAGES} from "../utils/statusMessages";
import {STATUS_CODES} from "../utils/statusCodes";
import {AppError} from "../utils/appError";
;
import {RegisterRequestBody} from "../interfaces/auth/register.interface";
import { LoginRequestBody } from '../interfaces/auth/login.interface';
import { loginSchema, registerSchema } from '../validators/auth.validator';
import { loginUserService, registerUserService } from '../services/auth.service';



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






