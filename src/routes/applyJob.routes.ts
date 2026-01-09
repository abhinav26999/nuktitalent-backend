import { Router } from "express";
import {
    applyJob,
    deleteApplication,
    getApplications,
} from "../controllers/applyJob.controller";
import authenticate from "../middleware/auth.middleware";
import { Role } from "@prisma/client";

const router = Router();

/* PUBLIC */
router.post("/apply", applyJob);

/* ADMIN */
router.get("/applications", authenticate([Role.ADMIN]), getApplications);
router.delete(
    "/applications/:id",
    authenticate([Role.ADMIN]),
    deleteApplication
);

export default router;
