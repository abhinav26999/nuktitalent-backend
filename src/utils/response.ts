import { Response } from 'express';

export const sendSuccess = (
    res: Response,
    statusCode: number,
    message: string,
    data: unknown = {}
) => {
    return res.status(statusCode).json({
        statusCode,
        message,
        data,
    });
};

export const sendError = (
    res: Response,
    statusCode: number,
    message: string,
    error: string = 'Error'
) => {
    return res.status(statusCode).json({
        statusCode,
        message,
        error,
    });
};
