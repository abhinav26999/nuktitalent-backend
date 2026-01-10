import cloudinary from "../config/cloudinary";
import path from "path";

export const uploadResumeToCloudinary = async (
    file: Express.Multer.File
): Promise<{
    publicId: string;
    filename: string;
}> => {
    return new Promise((resolve, reject) => {
        const originalName = path.parse(file.originalname).name;

        cloudinary.uploader
            .upload_stream(
                {
                    folder: "resumes",
                    resource_type: "raw",
                    type: "private",

                    // ✅ MUST BE TRUE
                    use_filename: true,

                    // ✅ MUST BE TRUE (prevents overwrite + bad IDs)
                    unique_filename: true,
                },
                (error, result) => {
                    if (error || !result) {
                        return reject(error);
                    }

                    resolve({
                        publicId: result.public_id, // ✅ EXACT Cloudinary ID
                        filename: file.originalname, // ✅ Preserve extension
                    });
                }
            )
            .end(file.buffer);
    });
};
