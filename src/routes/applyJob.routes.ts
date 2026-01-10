import { Router } from "express";
import {
    applyJob,
    deleteApplication,
    getApplicationResume,
    getApplications,
} from "../controllers/applyJob.controller";
import authenticate from "../middleware/auth.middleware";
import { Role } from "@prisma/client";
import { upload } from "../middleware/upload.middleware";

const router = Router();

/* PUBLIC */
router.post("/apply", upload.single("resume"), applyJob);

/* ADMIN */
router.get("/applications", authenticate([Role.ADMIN]), getApplications);
router.delete("/applications/:id", authenticate([Role.ADMIN]), deleteApplication);
router.get("/applications/:id/resume", authenticate([Role.ADMIN]), getApplicationResume);

export default router;
