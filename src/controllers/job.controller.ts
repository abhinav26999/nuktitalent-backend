import { RequestHandler } from 'express';
import { sendError, sendSuccess } from '../utils/response';
import { STATUS_CODES } from '../utils/statusCodes';
import { STATUS_MESSAGE_BY_CODE, STATUS_MESSAGES } from '../utils/statusMessages';
import { AppError } from '../utils/appError';

import { createJobSchema, updateJobParamSchema, updateJobSchema } from '../validators/job.validator';
import { createJobService, deleteJobService, getJobsService, updateJobService } from '../services/job.service';

/* CREATE JOB */
export const createJob: RequestHandler = async (req, res) => {
  const { error, value } = createJobSchema.validate(req.body);
  if (error) {
    return sendError(res, STATUS_CODES.BAD_REQUEST, error.message, STATUS_MESSAGES.BAD_REQUEST);
  }
   const userId = (req as any).user!.userId;

  try {
    const job = await createJobService(
      userId,
      value
    );

    sendSuccess(res, STATUS_CODES.CREATED, STATUS_MESSAGES.CREATED, job);
  }  catch (err: any) {
        const status = err instanceof AppError ? err.statusCode : STATUS_CODES.INTERNAL_SERVER_ERROR;
        const message = err.message || "Something went wrong";
        const errorText = STATUS_MESSAGE_BY_CODE[status] || "Error";
        sendError(res, status, message, errorText);
    }
};

/* GET JOBS */
export const getJobs: RequestHandler = async (req, res) => {
 try{
     const { page, limit, search } = req.query;

  const result = await getJobsService(
    Number(page) || 1,
    Number(limit) || 10,
    search as string
  );

  sendSuccess(res, STATUS_CODES.OK, STATUS_MESSAGES.OK, result);
 }catch (err: any) {
        const status = err instanceof AppError ? err.statusCode : STATUS_CODES.INTERNAL_SERVER_ERROR;
        const message = err.message || "Something went wrong";
        const errorText = STATUS_MESSAGE_BY_CODE[status] || "Error";
        sendError(res, status, message, errorText);
    }
};

/* UPDATE JOB */
export const updateJob: RequestHandler<{id:string}> = async (req, res) => {

  const { error: paramError, value: paramValue } = updateJobParamSchema.validate(req.params);
   if (paramError) {
        return sendError(res, STATUS_CODES.BAD_REQUEST, paramError.message, STATUS_MESSAGES.BAD_REQUEST);
    }
  const { error, value } = updateJobSchema.validate(req.body);
  if (error) {
    return sendError(res, 400, error.message, STATUS_MESSAGES.BAD_REQUEST);
  }
   const userId = (req as any).user!.userId;

  try {
    const job = await updateJobService(
      paramValue.id,
      userId,
      value
    );

    sendSuccess(res, STATUS_CODES.OK, STATUS_MESSAGES.OK, job);
  } catch (err: any) {
        const status = err instanceof AppError ? err.statusCode : STATUS_CODES.INTERNAL_SERVER_ERROR;
        const message = err.message || "Something went wrong";
        const errorText = STATUS_MESSAGE_BY_CODE[status] || "Error";
        sendError(res, status, message, errorText);
    }
};

/* DELETE JOB */
export const deleteJob: RequestHandler<{id:string}> = async (req, res) => {
      const { error: paramError, value: paramValue } = updateJobParamSchema.validate(req.params);
   if (paramError) {
        return sendError(res, STATUS_CODES.BAD_REQUEST, paramError.message, STATUS_MESSAGES.BAD_REQUEST);
    }
     const userId = (req as any).user!.userId;
  try {
    await deleteJobService(
      paramValue.id,
      userId,
    );

    sendSuccess(res, STATUS_CODES.OK, 'Job deleted successfully');
  } catch (err: any) {
        const status = err instanceof AppError ? err.statusCode : STATUS_CODES.INTERNAL_SERVER_ERROR;
        const message = err.message || "Something went wrong";
        const errorText = STATUS_MESSAGE_BY_CODE[status] || "Error";
        sendError(res, status, message, errorText);
    }
};
