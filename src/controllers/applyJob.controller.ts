import { RequestHandler } from "express";
import { sendError, sendSuccess } from "../utils/response";
import { STATUS_CODES } from "../utils/statusCodes";
import { STATUS_MESSAGES } from "../utils/statusMessages";
import { AppError } from "../utils/appError";

import { applyJobSchema } from "../validators/applyJob.validator";
import {
    applyJobService,
    deleteApplicationService,
    getApplicationsService,
} from "../services/applyJob.service";

/* APPLY JOB (PUBLIC) */
export const applyJob: RequestHandler = async (req, res) => {
    const { error, value } = applyJobSchema.validate(req.body);
    if (error) {
        return sendError(
            res,
            STATUS_CODES.BAD_REQUEST,
            error.message,
            STATUS_MESSAGES.BAD_REQUEST
        );
    }

    try {
        const application = await applyJobService(value);
        sendSuccess(
            res,
            STATUS_CODES.CREATED,
            STATUS_MESSAGES.CREATED,
            application
        );
    } catch (err: any) {
        const status =
            err instanceof AppError
                ? err.statusCode
                : STATUS_CODES.INTERNAL_SERVER_ERROR;

        sendError(res, status, err.message, "Error");
    }
};

/* GET ALL APPLICATIONS (ADMIN) */
export const getApplications: RequestHandler = async (req, res) => {
    try {
        const { page, limit } = req.query;

        const result = await getApplicationsService(
            Number(page) || 1,
            Number(limit) || 10
        );

        sendSuccess(res, STATUS_CODES.OK, STATUS_MESSAGES.OK, result);
    } catch (err: any) {
        sendError(
            res,
            STATUS_CODES.INTERNAL_SERVER_ERROR,
            err.message,
            "Error"
        );
    }
};

/* DELETE APPLICATION (ADMIN) */
export const deleteApplication: RequestHandler<{ id: string }> = async (
    req,
    res
) => {
    try {
        await deleteApplicationService(req.params.id);
        sendSuccess(res, STATUS_CODES.OK, "Application deleted successfully");
    } catch (err: any) {
        sendError(
            res,
            STATUS_CODES.INTERNAL_SERVER_ERROR,
            err.message,
            "Error"
        );
    }
};
