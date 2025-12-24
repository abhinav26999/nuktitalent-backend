import prisma from "../db/db";
import { IEnquiryRequest, IUpdateEnquiry } from "../interfaces/enquiry.interface";
import { Prisma } from "@prisma/client";

export const createEnquiryService = (data: IEnquiryRequest) => {
    return prisma.enquiry.create({ data });
};

export const getAllEnquiriesService = async (
    page: number = 1,
    limit: number = 10,
    search?: string
) => {
    const skip = (page - 1) * limit;

    // Type-safe Prisma where object
    const where: Prisma.EnquiryWhereInput = search
        ? {
            OR: [
                { name: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },
                { subject: { contains: search, mode: "insensitive" } },
                { message: { contains: search, mode: "insensitive" } },
            ],
        }
        : {};

    const [data, total] = await Promise.all([
        prisma.enquiry.findMany({
            where,
            orderBy: { createdAt: "desc" },
            skip,
            take: limit,
        }),
        prisma.enquiry.count({ where }),
    ]);

    return { data, total, page, limit };
};

export const getFilteredEnquiriesService = async (
    isSolved: boolean,
    page: number = 1,
    limit: number = 10,
    search?: string
) => {
    const skip = (page - 1) * limit;

    const where: Prisma.EnquiryWhereInput = {
        isSolved,
        ...(search
            ? {
                OR: [
                    { name: { contains: search, mode: "insensitive" } },
                    { email: { contains: search, mode: "insensitive" } },
                    { subject: { contains: search, mode: "insensitive" } },
                    { message: { contains: search, mode: "insensitive" } },
                ],
            }
            : {}),
    };

    const [data, total] = await Promise.all([
        prisma.enquiry.findMany({
            where,
            orderBy: { createdAt: "desc" },
            skip,
            take: limit,
        }),
        prisma.enquiry.count({ where }),
    ]);

    return { data, total, page, limit };
};

export const updateEnquiryService = (id: string, data: IUpdateEnquiry) => {
    return prisma.enquiry.update({
        where: { id },
        data,
    });
};
