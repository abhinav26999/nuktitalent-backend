import dotenv from "dotenv";

/**
 * Load correct env file
 */
dotenv.config({
    path: process.env.NODE_ENV === "production"
        ? ".env.production"
        : ".env.development",
});

// ================== IMPORTS ==================
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer } from "http";

// Routes
import enquiryRoutes from "./routes/enquiry.routes.js";
import authRoutes from "./routes/auth.routes.js";
import jobRoutes from "./routes/job.routes.js";
import applyJobRoutes from "./routes/applyJob.routes.js";

// ================== APP INIT ==================
const app = express();
const server = createServer(app);

// ================== MIDDLEWARES ==================
app.use(express.json());
app.use(cookieParser());

// ---- CORS CONFIG (PRODUCTION READY) ----
const allowedOrigins = [
    "http://localhost:5173",
    "https://niyuktitalent.in",
    "https://www.niyuktitalent.in",
    "https://comfy-begonia-b5f6d3.netlify.app",
];

app.use(
    cors({
        origin: function (origin, callback) {
            // allow server-to-server & Postman
            if (!origin) return callback(null, true);

            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            return callback(new Error("CORS not allowed for this origin"));
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

// ---- PRE-FLIGHT (VERY IMPORTANT) ----
app.options("*", cors());

// ================== ROUTES ==================
app.use("/api/enquiries", enquiryRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/job", jobRoutes);
app.use("/api/job", applyJobRoutes);

// ================== SERVER ==================
const PORT = Number(process.env.PORT) || 3000;

server.listen(PORT, () => {
    console.log(
        `🚀 Server running on port ${PORT} | ENV: ${process.env.NODE_ENV}`
    );
});

// ================== GRACEFUL SHUTDOWN ==================
process.on("SIGTERM", () => {
    console.log("SIGTERM received. Closing server...");
    server.close(() => {
        console.log("HTTP server closed.");
    });
});
