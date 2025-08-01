import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// ✅ 1. Create the transporter once and reuse it
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for SSL
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// ✅ 2. Send OTP Email
export const sendOtpEmail = async (toEmail, otp) => {
  try {
    const info = await transporter.sendMail({
      from: `"MELANU SKINCARE PRODUCT" <${process.env.SMTP_USER}>`,
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

    console.log("OTP email sent:", info.messageId);
  } catch (error) {
    console.error("Failed to send OTP email:", error.message);
  }
};

// ✅ 3. Send Password Reset Email
export const sendPasswordResetEmail = async (toEmail, resetUrl) => {
  try {
    const info = await transporter.sendMail({
      from: `"MELANU SKINCARE PRODUCT" <${process.env.SMTP_USER}>`,
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

// ✅ 4. Send Newsletter Email (mass emails)
export const sendNewsletterEmail = async (recipients, subject, htmlContent) => {
  try {
    const info = await transporter.sendMail({
      from: `"MELANU SKINCARE PRODUCT" <${process.env.SMTP_USER}>`,
      to: recipients.join(','), // Accepts an array of emails
      subject,
      html: htmlContent,
    });

    console.log("Newsletter email sent to:", recipients);
  } catch (error) {
    console.error("Failed to send newsletter email:", error.message);
  }
};

//  Admin replies to contact message
export const sendAdminReplyEmail = async (toEmail, subject, userMessage, adminReply) => {
  try {
    const info = await transporter.sendMail({
      from: `"MELANU SKINCARE PRODUCT - Support" <${process.env.SMTP_USER}>`,
      to: toEmail,
      subject: `RE: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background: #f9f9f9;">
          <p>Hi,</p>
          <p>You contacted us with the message below:</p>
          <blockquote style="margin: 10px 0; padding: 10px; background: #e9ecef; border-left: 4px solid #007BFF;">
            ${userMessage}
          </blockquote>
          <p>Our response:</p>
          <div style="padding: 10px; background: #d4edda; border-left: 4px solid #28a745;">
            ${adminReply}
          </div>
          <p style="margin-top: 20px;">Thank you for reaching out to MELANU SKINCARE PRODUCT.</p>
        </div>
      `,
    });

    console.log("Admin reply email sent:", info.messageId);
  } catch (error) {
    console.error("Failed to send admin reply email:", error.message);
  }
};

// Send Payment Confirmation Email
export const sendPaymentConfirmationEmail = async (toEmail, userName, amount) => {
  try {
    const info = await transporter.sendMail({
      from: `"MELANU SKINCARE PRODUCT" <${process.env.SMTP_USER}>`,
      to: toEmail,
      subject: "Payment Confirmation - MELANU SKINCARE",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background: #f2f2f2;">
          <h2 style="color: #28a745;">Payment Successful</h2>
          <p>Dear ${userName},</p>
          <p>We’ve received your payment of <strong>GHS ${amount}</strong>. Your vendor account is now active.</p>
          <p>Thank you for joining MELANU SKINCARE PRODUCT as a valued vendor.</p>
          <p style="font-size: 14px; color: #777;">If you have any questions, feel free to reply to this email.</p>
        </div>
      `,
    });

    console.log("Payment confirmation email sent:", info.messageId);
  } catch (error) {
    console.error("Failed to send payment confirmation email:", error.message);
  }
};

export const sendMailWithPaymentLink = async (toEmail, name, paymentLink) => {
  try {
    const info = await transporter.sendMail({
      from: `"MELANU SKINCARE PRODUCT" <${process.env.SMTP_USER}>`,
      to: toEmail,
      subject: "Complete Your Payment - MELANU SKINCARE",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #e91e63;">Hello ${name || 'there'},</h2>
          <p>Thank you for your order. To complete your purchase, please click the link below to make payment:</p>
          <a href="${paymentLink}" style="display: inline-block; padding: 10px 20px; background: #867520ff; color: #fff; text-decoration: none; border-radius: 4px;">Pay Now</a>
          <p>If the button doesn't work, copy and paste the following link into your browser:</p>
          <p><a href="${paymentLink}">${paymentLink}</a></p>
          <p>Thank you for choosing MELANU SKINCARE PRODUCT.</p>
        </div>
      `
    });

    console.log('Payment link email sent:', info.messageId);
  } catch (error) {
    console.error('Failed to send payment link email:', error.message);
  }
};

