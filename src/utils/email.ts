import nodemailer from 'nodemailer';

/** OTP purpose */
export enum OtpPurpose {
  FORGOT_PASSWORD = 'FORGOT_PASSWORD',
}

export const sendOtpEmail = async (
  email: string,
  otp: string,
  type: OtpPurpose
) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER!,
      pass: process.env.SMTP_PASS!,
    },
  });

  const subject =
    type === OtpPurpose.FORGOT_PASSWORD
      ? 'Reset your password - OTP'
      : 'Your OTP Code';

  const html = `
    <p>Your OTP code is <b>${otp}</b></p>
    <p>This OTP will expire in <b>10 minutes</b>.</p>
  `;

  await transporter.sendMail({
    from: `"Support" <${process.env.SMTP_USER}>`,
    to: email,
    subject,
    html,
  });
};
