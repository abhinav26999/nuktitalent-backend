import prisma from '../db/db';
import { AppError } from '../utils/appError';
import { STATUS_CODES } from '../utils/statusCodes';
import { APP_MESSAGES } from '../utils/statusMessages';
import { generateOtpCode } from '../utils/otp';
import { calculateExpiry } from '../utils/expiry';
import { sendOtpEmail, OtpPurpose } from '../utils/email';

/* ================= SEND OTP ================= */
export const sendOtp = async (
  email: string,
  expiryMinutes = 10
) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new AppError(APP_MESSAGES.USER_NOT_FOUND, STATUS_CODES.NOT_FOUND);
  }

  // Invalidate old OTPs
  await prisma.oTPCode.updateMany({
    where: { userId: user.id, usedAt: null },
    data: { usedAt: new Date() },
  });

  const otp = generateOtpCode();
  const expiresAt = calculateExpiry(expiryMinutes);

  await prisma.oTPCode.create({
    data: {
      code: otp,
      userId: user.id,
      expiresAt,
    },
  });

  await sendOtpEmail(email, otp, OtpPurpose.FORGOT_PASSWORD);

  return { message: APP_MESSAGES.OTP_SENT };
};

/* ================= VERIFY OTP ================= */
export const verifyOtp = async (
  email: string,
  otpCode: string
) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new AppError(APP_MESSAGES.USER_NOT_FOUND, STATUS_CODES.NOT_FOUND);
  }

  const otp = await prisma.oTPCode.findFirst({
    where: {
      userId: user.id,
      code: otpCode,
      usedAt: null,
      expiresAt: { gt: new Date() },
    },
  });

  if (!otp) {
    throw new AppError(
      APP_MESSAGES.INVALID_OR_EXPIRED_OTP,
      STATUS_CODES.BAD_REQUEST
    );
  }

  await prisma.oTPCode.update({
    where: { id: otp.id },
    data: { usedAt: new Date() },
  });

  return user;
};
