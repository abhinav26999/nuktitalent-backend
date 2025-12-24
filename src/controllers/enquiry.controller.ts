import { Request, Response } from "express";
import { sendSuccess } from "../utils/response";
import { STATUS_CODES } from "../utils/statusCodes";
import ApiError from "../lib/ApiError";
import {
    createEnquiryService,
    getAllEnquiriesService,
    getFilteredEnquiriesService,
    updateEnquiryService
} from "../services/enquiry.service";
import { enquirySchema, enquiryUpdateSchema, enquiryQuerySchema } from "../validators/enquiry.validator";

export const createEnquiryController = async (req: Request, res: Response) => {
    await enquirySchema.validateAsync(req.body);
    const enquiry = await createEnquiryService(req.body);

    return sendSuccess(res, STATUS_CODES.CREATED, "Enquiry submitted successfully", enquiry);
};

export const getAllEnquiries = async (req: Request, res: Response) => {
    const validatedQuery = await enquiryQuerySchema.validateAsync(req.query);
    const { page, limit, search } = validatedQuery;

    const data = await getAllEnquiriesService(page, limit, search);

    return sendSuccess(res, STATUS_CODES.OK, "All enquiries fetched", data);
};

export const getFilteredEnquiries = async (req: Request, res: Response) => {
    const { isSolved } = req.params;

    if (isSolved !== "true" && isSolved !== "false") {
        throw new ApiError(
            STATUS_CODES.BAD_REQUEST,
            "isSolved param must be true or false"
        );
    }

    const validatedQuery = await enquiryQuerySchema.validateAsync(req.query);
    const { page, limit, search } = validatedQuery;

    const solved = isSolved === "true";

    const data = await getFilteredEnquiriesService(solved, page, limit, search);

    return sendSuccess(
        res,
        STATUS_CODES.OK,
        solved ? "Solved enquiries fetched" : "Unsolved enquiries fetched",
        data
    );
};

export const updateEnquiry = async (req: Request, res: Response) => {
    const { id } = req.params;

    await enquiryUpdateSchema.validateAsync(req.body);

    const updated = await updateEnquiryService(id, req.body);

    return sendSuccess(res, STATUS_CODES.OK, "Enquiry updated successfully", updated);
};
