import { Router } from "express";
import { createJob, deleteJob, getJobs, updateJob } from "../controllers/job.controller";
import authenticate from "../middleware/auth.middleware";
import { Role } from "@prisma/client";

const router = Router();
router.post('/create', authenticate([Role.ADMIN]), createJob);
router.get('/me',getJobs)
router.patch('/update/:id/job',authenticate([Role.ADMIN]), updateJob)
router.delete('/delete/:id/job',authenticate([Role.ADMIN]), deleteJob)


export default router;
