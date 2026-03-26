import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.error("SMTP_USER or SMTP_PASS is not defined in the environment variables");
      return { success: false, message: "Server configuration error: Email credentials missing" };
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // STARTTLS
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // ⛔ DO NOT pass the React component or a Promise directly to sendMail
    // ✅ Convert React component → HTML string (synchronous)
    const html = await render(VerificationEmail({ username, otp: verifyCode }));

    await transporter.sendMail({
      from: `"AnnoMessage" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "AnnoMessage | verification code",
      html, // ✅ this is a plain string now, NOT a Promise
    });

    return { success: true, message: "Verification email sent successfully" };
  } catch (error) {
    console.error("Error sending email", error);
    return { success: false, message: "Failed to send verification email" };
  }
}
