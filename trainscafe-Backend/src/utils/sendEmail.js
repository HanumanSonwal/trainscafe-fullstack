import { createTransporter } from "../config/mail.config.js";

export const sendEmail = async ({ to, subject, html }) => {
  const transporter = await createTransporter();

  await transporter.sendMail({
    from: `"Trainscafe 🚆" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};
