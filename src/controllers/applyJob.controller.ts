import { RequestHandler } from "express";
import prisma from "../db/db";
import cloudinary from "../config/cloudinary";
import { sendError, sendSuccess } from "../utils/response";
import { STATUS_CODES } from "../utils/statusCodes";
import { AppError } from "../utils/appError";
import { applyJobSchema } from "../validators/applyJob.validator";
import {
    applyJobService,
    deleteApplicationService,
    getApplicationsService,
} from "../services/applyJob.service";
import { uploadResumeToCloudinary } from "../utils/uploadResume";

/* APPLY JOB (PUBLIC) */
export const applyJob: RequestHandler = async (req, res) => {
    const { error, value } = applyJobSchema.validate(req.body);
    if (error) return sendError(res, STATUS_CODES.BAD_REQUEST, error.message, "Bad Request");

    try {
        let resumePublicId: string | undefined;
        let resumeFilename: string | undefined;

        if (req.file) {
            const uploaded = await uploadResumeToCloudinary(req.file);
            resumePublicId = uploaded.publicId;
            resumeFilename = uploaded.filename;
        }

        const application = await applyJobService({ ...value, resumePublicId, resumeFilename });

        sendSuccess(res, STATUS_CODES.CREATED, "Application created", application);
    } catch (err: any) {
        const status = err instanceof AppError ? err.statusCode : STATUS_CODES.INTERNAL_SERVER_ERROR;
        sendError(res, status, err.message, "Error");
    }
};

/* GET ALL APPLICATIONS (ADMIN) */
export const getApplications: RequestHandler = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const result = await getApplicationsService(page, limit);
        sendSuccess(res, STATUS_CODES.OK, "Applications fetched", result);
    } catch (err: any) {
        sendError(res, STATUS_CODES.INTERNAL_SERVER_ERROR, err.message, "Error");
    }
};

/* DELETE APPLICATION (ADMIN) */
export const deleteApplication: RequestHandler<{ id: string }> = async (req, res) => {
    try {
        await deleteApplicationService(req.params.id);
        sendSuccess(res, STATUS_CODES.OK, "Application deleted successfully");
    } catch (err: any) {
        sendError(res, STATUS_CODES.INTERNAL_SERVER_ERROR, err.message, "Error");
    }
};

/* GET APPLICATION RESUME (ADMIN ONLY) */
export const getApplicationResume: RequestHandler<{ id: string }> = async (req, res) => {
    try {
        const application = await prisma.jobApplication.findUnique({
            where: { id: req.params.id },
        });

        if (!application || !application.resumePublicId)
            return sendError(res, 404, "Resume not found", "Error");

        const downloadUrl = cloudinary.utils.private_download_url(
            application.resumePublicId,
            "", // auto-detect
            {
                resource_type: "raw", // ✅ THIS WAS MISSING
                expires_at: Math.floor(Date.now() / 1000) + 300, // 5 min
                attachment: true, // force download
            }
        );

        sendSuccess(res, STATUS_CODES.OK, "Resume download URL", { url: downloadUrl });
    } catch (err: any) {
        sendError(res, STATUS_CODES.INTERNAL_SERVER_ERROR, err.message, "Error");
    }
};
