# Niyukti Talent Solution Backend

This repository contains the backend REST API service for **Niyukti Talent Solution**—a robust Talent Acquisition, Job Board, and Recruitment Management platform.

The backend serves as the core business logic layer, handling admin authentication, OTP-based password recovery, job post management, candidate application submissions (with resume uploads), and visitor enquiries.

---

## 🚀 Tech Stack

- **Runtime Environment:** [Node.js](https://nodejs.org/) (v18+)
- **Framework:** [Express.js](https://expressjs.com/) with [TypeScript](https://www.typescriptlang.org/)
- **ORM / Database Access:** [Prisma Client](https://www.prisma.io/)
- **Database:** MongoDB
- **Authentication:** JWT (JSON Web Tokens) with Secure HTTP-Only Cookie-based Refresh Tokens
- **Validation:** [Joi](https://joi.dev/) (Request Schema Validation)
- **File Uploads:** [Multer](https://github.com/expressjs/multer) & [Cloudinary SDK](https://cloudinary.com/) (for PDF resume storage)
- **Mailing:** [Nodemailer](https://nodemailer.com/) (for OTP delivery)

---

## 📂 Project Structure

```text
nuktitalent-backend/
├── prisma/
│   └── schema.prisma        # Database models & Prisma configuration
├── src/
│   ├── config/              # Configuration files (cloudinary, nodemailer, jwt)
│   ├── controllers/         # Express controllers (auth, job, application, enquiry)
│   ├── db/                  # Prisma client initialization
│   ├── helper/              # Utility helper modules (OTP generator, cookie helpers)
│   ├── index.ts             # Application entry point
│   ├── interfaces/          # TypeScript interface definitions for requests/responses
│   ├── lib/                 # Core libraries
│   ├── middleware/          # Express Middlewares (auth guard, error handler, multer upload)
│   ├── routes/              # Express Router mapping (Auth, Jobs, Applications, Enquiries)
│   ├── services/            # Core business logic / DB query layers
│   ├── utils/               # Constants, custom error classes, response formatters
│   └── validators/          # Joi schema validation definitions
├── tsconfig.json            # TypeScript configuration
├── package.json             # NPM dependencies & run scripts
└── .env.development         # Development environment config (gitignore-protected)
```

---

## 🗄️ Database Schema & Models

The application models are managed using Prisma and mapped to MongoDB collections:

1. **User**: Represents backend administration staff (Role: `ADMIN`). Holds hashed passwords and relations to jobs.
2. **Token**: Manages blacklisted and active refresh tokens.
3. **Job**: Contains job details (title, company, experience requirements, salary, location, description).
4. **JobApplication**: Stores applicant information (full name, email, mobile, expectations, resume storage paths).
5. **Enquiry**: Captured contact form submissions (name, email, subject, message, solved status).
6. **OTPCode**: Tracks security codes for account recovery and password resets.

---

## 🔌 API Endpoints Catalog

All endpoints are prefixed with `/api`.

### 🔐 Authentication (`/api/auth`)
* `POST /register` - Register a new Admin user.
* `POST /login` - Admin login. Sets HTTP-only refresh token in cookie and returns access token.
* `POST /refresh` - Generate a new access token using the refresh token.
* `POST /logout` - Clear cookies and terminate token session.
* `POST /forgot-password` - Request an OTP for password reset.
* `POST /reset-password` - Validate OTP and update password.

### 💼 Job Postings (`/api/job`)
* `GET /` - Retrieve all active jobs (Publicly accessible).
* `GET /:id` - Get specific job details.
* `POST /` - Create a new job listing *(Admin authorization required)*.
* `PUT /:id` - Update job details *(Admin authorization required)*.
* `DELETE /:id` - Delete a job posting *(Admin authorization required)*.

### 📄 Job Applications (`/api/job`)
* `POST /apply` - Submit a job application (handles resume upload to Cloudinary).
* `GET /resumes` - Fetch list of all applications *(Admin authorization required)*.

### 📧 Enquiries (`/api/enquiries`)
* `POST /` - Submit contact/enquiry form.
* `GET /` - List all enquiries *(Admin authorization required)*.
* `PATCH /:id` - Mark enquiry as resolved/update remarks *(Admin authorization required)*.

---

## 🔧 Getting Started & Installation

Follow these steps to run the backend locally:

### 1. Prerequisites
- **Node.js** (v18 or higher recommended)
- **MongoDB** database instance (local or Atlas cloud cluster connection URI)

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a file named `.env.development` (for local development) or `.env.production` (for production server) in the root folder, and populate the following keys:

```ini
PORT=3000
DATABASE_URL="mongodb+srv://<username>:<password>@<cluster>.mongodb.net/nuktitalent"
JWT_ACCESS_SECRET="your_very_strong_access_secret_key"
JWT_REFRESH_SECRET="your_very_strong_refresh_secret_key"

# Cloudinary credentials (for resume uploads)
CLOUDINARY_CLOUD_NAME="your_cloudinary_cloud_name"
CLOUDINARY_API_KEY="your_cloudinary_api_key"
CLOUDINARY_API_SECRET="your_cloudinary_api_secret"

# Nodemailer credentials (for OTP emails)
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="your_email@gmail.com"
EMAIL_PASS="your_email_app_password"
EMAIL_FROM="Niyukti Talent Solution <your_email@gmail.com>"
```

### 4. Push Database Schema
To initialize and push the Prisma schema models to your MongoDB database:
```bash
npm run db:dev
```

### 5. Start the Development Server
```bash
npm run dev
```
The server will boot up with hot-reloading at `http://localhost:3000`.

---

## 🛠️ Production Build & Deploy

To build and compile TypeScript to production-ready JavaScript:
```bash
npm run build
```
Start the production server:
```bash
npm run start
```
Ensure your target environment variables are set in `.env.production` or configuration env providers.
