import multer from "multer";

const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

export const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (_, file, cb) => {
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(
                new Error("Only PDF, DOC, DOCX, XLS, XLSX files are allowed")
            );
        }
        cb(null, true);
    },
});
