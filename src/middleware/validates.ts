import { Request, Response, NextFunction } from "express";
import ApiError from "../lib/ApiError";
import { STATUS_CODES } from "../utils/statusCodes";

export const validate =
    (schema: any) => async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.validateAsync(req.body, { abortEarly: false });
            next();
        } catch (err: any) {
            throw new ApiError(
                STATUS_CODES.BAD_REQUEST,
                err?.message || "Validation Failed"
            );
        }
    };
