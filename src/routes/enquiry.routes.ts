import { Router } from "express";
import {
    createEnquiryController,
    getAllEnquiries,
    getFilteredEnquiries,
    updateEnquiry
} from "../controllers/enquiry.controller";

const router = Router();

// Public endpoint
router.post("/create", createEnquiryController);

// Admin endpoints
router.get("/getAllEnquiries", getAllEnquiries); // supports ?page=&limit=&search=
router.get("/filter/:isSolved", getFilteredEnquiries); // supports ?page=&limit=&search=
router.patch("/:id", updateEnquiry);

export default router;
