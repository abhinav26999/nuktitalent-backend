import prisma from '../db/db';
import { AppError } from '../utils/appError';
import { STATUS_CODES } from '../utils/statusCodes';
import { Prisma } from '@prisma/client';
import { CreateJobRequestBody, UpdateJobRequestBody } from '../interfaces/job/job.interface';

/* ✅ CREATE JOB (ADMIN ONLY) */
export const createJobService = async (
  adminId: string,
  data: CreateJobRequestBody
) => {
 
  return prisma.job.create({
    data: {
      ...data,
      createdBy: adminId,
    },
  });
};


/* ✅ GET JOBS (PAGINATION + FILTER + LATEST) */
export const getJobsService = async (
  page = 1,
  limit = 10,
  search?: string
) => {
  const skip = (page - 1) * limit;

  const where: Prisma.JobWhereInput = search
    ? {
        OR: [
          {
            title: {
              contains: search,
              mode: Prisma.QueryMode.insensitive,
            },
          },
          {
            location: {
              contains: search,
              mode: Prisma.QueryMode.insensitive,
            },
          },
          {
            company: {
              contains: search,
              mode: Prisma.QueryMode.insensitive,
            },
          },
        ],
      }
    : {};

  const [jobs, total] = await Promise.all([
    prisma.job.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' }, 
    }),
    prisma.job.count({ where }),
  ]);

  return {
    jobs,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};


/* UPDATE JOB  */
export const updateJobService = async (
  jobId: string,
  adminId: string,
  data: UpdateJobRequestBody
) => {
 

  const job = await prisma.job.findUnique({ where: { id: jobId } });

  if (!job) {
    throw new AppError('Job not found', STATUS_CODES.NOT_FOUND);
  }

  if (job.createdBy !== adminId) {
    throw new AppError('Unauthorized', STATUS_CODES.UNAUTHORIZED);
  }

  return prisma.job.update({
    where: { id: jobId },
    data,
  });
};

/* ✅ DELETE JOB (ADMIN ONLY) */
export const deleteJobService = async (
  jobId: string,
  adminId: string,
) => {

  const job = await prisma.job.findUnique({ where: { id: jobId } });

  if (!job) {
    throw new AppError('Job not found', STATUS_CODES.NOT_FOUND);
  }

  if (job.createdBy !== adminId) {
    throw new AppError('Unauthorized', STATUS_CODES.UNAUTHORIZED);
  }

  await prisma.job.delete({ where: { id: jobId } });
};
