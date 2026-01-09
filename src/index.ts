import dotenv from "dotenv";


dotenv.config({
    path: process.env.NODE_ENV === "production"
        ? ".env.production"
        : ".env.development"
});

// imports AFTER dotenv
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer } from "http";

import enquiryRoutes from "./routes/enquiry.routes";
import authRoutes from "./routes/auth.routes";
import jobRoutes from "./routes/job.routes";
import applyJobRoutes from "./routes/applyJob.routes";

const app = express();
// app.use(morganLogger);
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://comfy-begonia-b5f6d3.netlify.app"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"]
}));
const server = createServer(app);

const PORT = Number(process.env.PORT) || 3000;

// Routes
app.use("/api/enquiries", enquiryRoutes);
app.use("/api/auth",authRoutes)
app.use("/api/job", jobRoutes)
app.use("/api/job", applyJobRoutes);


// app.use(multerErrorHandler);



// CORRECT: Listen on HTTP server (not Express app)
server.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT} in ${process.env.NODE_ENV} mode`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
    });
});