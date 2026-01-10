import prisma from "../db/db";
import { AppError } from "../utils/appError";
import { STATUS_CODES } from "../utils/statusCodes";
import cloudinary from "../config/cloudinary";

/* CREATE APPLICATION */
export const applyJobService = async (data: any) => {
    const jobExists = await prisma.job.findUnique({ where: { id: data.jobId } });
    if (!jobExists) {
        throw new AppError("Job not found", STATUS_CODES.NOT_FOUND);
    }
    return prisma.jobApplication.create({ data });
};

/* GET APPLICATIONS (ADMIN) */
export const getApplicationsService = async (page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    const [applications, total] = await Promise.all([
        prisma.jobApplication.findMany({
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
            include: { job: true },
        }),
        prisma.jobApplication.count(),
    ]);

    return {
        applications,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };
};

/* DELETE APPLICATION (ADMIN) WITH RESUME DELETE */
export const deleteApplicationService = async (id: string) => {
    const application = await prisma.jobApplication.findUnique({ where: { id } });
    if (!application) throw new AppError("Application not found", STATUS_CODES.NOT_FOUND);

    if (application.resumePublicId) {
        try {
            await cloudinary.uploader.destroy(application.resumePublicId, {
                resource_type: "raw",
                type: "private",
            });
        } catch (err) {
            console.error("Failed to delete resume from Cloudinary:", (err as Error).message);
        }
    }

    await prisma.jobApplication.delete({ where: { id } });
};
