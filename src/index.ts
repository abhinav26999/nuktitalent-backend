// Load dotenv first
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({
    path: path.resolve(
        process.cwd(),
        process.env.NODE_ENV === "production"
            ? ".env.production"
            : ".env.development"
    ),
});

// import everything else after dotenv
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import {createServer} from "http";
// import { morganLogger } from "./middleware/morganLogger.middleware";
// import { multerErrorHandler } from './middleware/multerErrorHandler';



const app = express();
// app.use(morganLogger);
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin:'http://localhost:5173',
    methods: ["GET", "POST", "PUT","PATCH", "DELETE"],
    credentials: true
}));
const server = createServer(app);

const PORT = process.env.PORT || 3002;

// Routes
// app.use('/api/auth', authRoutes);


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