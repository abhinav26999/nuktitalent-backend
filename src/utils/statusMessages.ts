import {STATUS_CODES} from "./statusCodes";

export const STATUS_MESSAGES = {
    OK: 'Success',
    CREATED: 'Resource created successfully',
    NO_CONTENT: 'No content',
    BAD_REQUEST: 'Bad Request',
    UNAUTHORIZED: 'Unauthorized access',
    FORBIDDEN: 'Forbidden',
    NOT_FOUND: 'Not found',
    CONFLICT: 'Conflict occurred',
    UNPROCESSABLE_ENTITY: 'Unprocessable entity',
    INTERNAL_SERVER_ERROR: 'Internal server error',
} as const;

export const APP_MESSAGES = {
    USER_NOT_FOUND: 'User not found',
    INVALID_EMAIL_PASSWORD: 'Invalid email or password',
    USER_ALREADY_EXISTS: 'User with this email already exists',
    REFRESH_TOKEN_INVALID: 'Refresh token is invalid or blacklisted',
    VALIDATION_FAILED: 'Validation failed',
    INVALID_EXPIRE_TOKEN: 'Invalid or expired token',
    SHORT_URL_NOT_FOUND: 'Short URL not found or expired',
    FORBIDDEN: 'Forbidden access',
    TOKEN_REQUIRED: 'Authentication token is required',
    LOGGED_OUT_SUCCESSFULLY:"Log out successfully",
    OTP_SENT:"Otp send successfully",
    INVALID_OR_EXPIRED_OTP:"Invalid or expired otp",
    PASSWORD_RESET_SUCCESSFULLY:"Password reset successfully"
  

} as const;

export const STATUS_MESSAGE_BY_CODE: Record<number, string> = {
    [STATUS_CODES.OK]: STATUS_MESSAGES.OK,
    [STATUS_CODES.CREATED]: STATUS_MESSAGES.CREATED,
    [STATUS_CODES.NO_CONTENT]: STATUS_MESSAGES.NO_CONTENT,
    [STATUS_CODES.BAD_REQUEST]: STATUS_MESSAGES.BAD_REQUEST,
    [STATUS_CODES.UNAUTHORIZED]: STATUS_MESSAGES.UNAUTHORIZED,
    [STATUS_CODES.FORBIDDEN]: STATUS_MESSAGES.FORBIDDEN,
    [STATUS_CODES.NOT_FOUND]: STATUS_MESSAGES.NOT_FOUND,
    [STATUS_CODES.CONFLICT]: STATUS_MESSAGES.CONFLICT,
    [STATUS_CODES.UNPROCESSABLE_ENTITY]: STATUS_MESSAGES.UNPROCESSABLE_ENTITY,
    [STATUS_CODES.INTERNAL_SERVER_ERROR]: STATUS_MESSAGES.INTERNAL_SERVER_ERROR,
};