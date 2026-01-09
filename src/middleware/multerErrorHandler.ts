import multer from "multer";
import { Request, Response, NextFunction } from "express";
import { sendError } from "../utils/response";
import { STATUS_CODES } from "../utils/statusCodes";
import { STATUS_MESSAGES } from "../utils/statusMessages";

export const multerErrorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Multer built-in errors (like Unexpected field)
    if (err instanceof multer.MulterError) {
        return sendError(
            res,
            STATUS_CODES.BAD_REQUEST,
            err.message,
            STATUS_MESSAGES.BAD_REQUEST
        );
    }

    // Custom file type errors thrown from fileFilter
    if (err && err.message && err.message.startsWith("Invalid file type")) {
        return sendError(
            res,
            STATUS_CODES.BAD_REQUEST,
            err.message,
            STATUS_MESSAGES.BAD_REQUEST
        );
    }

    next(err);
};
