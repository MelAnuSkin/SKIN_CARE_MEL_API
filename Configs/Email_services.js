import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for SSL 
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendOtpEmail = async (toEmail, otp) => {
  try {
    const info = await transporter.sendMail({
      from: `"Advert API Team" <${process.env.SMTP_USER}>`,
      to: toEmail,
      subject: "Your OTP Code",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background: #f2f2f2;">
          <h2 style="color: #007BFF;">Your OTP</h2>
          <p>Use the code below to verify your account:</p>
          <h1 style="letter-spacing: 3px;">${otp}</h1>
          <p style="font-size: 14px; color: #777;">This OTP will expire in 5 minutes.</p>
        </div>
      `,
    });

    console.log("Email sent:", info.messageId);
  } catch (error) {
    console.error("Failed to send email:", error.message);
  }
};

export const sendPasswordResetEmail = async (toEmail, resetUrl) => {
  try {
    const info = await transporter.sendMail({
      from: `"Advert API Team" <${process.env.SMTP_USER}>`,
      to: toEmail,
      subject: "Password Reset Request",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background: #f2f2f2;">
          <h2 style="color: #007BFF;">Reset Your Password</h2>
          <p>Click the link below to reset your password:</p>
          <a href="${resetUrl}" style="color: #007BFF;">Reset Password</a>
          <p style="font-size: 14px; color: #777;">If you did not request this, please ignore this email.</p>
        </div>
      `,
    });

    console.log("Password reset email sent:", info.messageId);
  } catch (error) {
    console.error("Failed to send password reset email:", error.message);
  }
};

