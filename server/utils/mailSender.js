const nodemailer = require("nodemailer");

const mailSender = async (email, title, body) => {
  try {
    if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
      console.warn(
        "⚠️ Warning: MAIL_USER or MAIL_PASS environment variables are missing in server environment. Email send skipped."
      );
      return { skipped: true, message: "SMTP credentials missing" };
    }

    const isPort465 = process.env.MAIL_PORT === "465";

    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST || "smtp.gmail.com",
      port: process.env.MAIL_PORT ? Number(process.env.MAIL_PORT) : 587,
      secure: isPort465,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
      tls: {
        rejectUnauthorized: false,
      },
    });

    const senderEmail = process.env.MAIL_USER;

    let info = await transporter.sendMail({
      from: `"SkillNotion" <${senderEmail}>`,
      to: `${email}`,
      subject: `${title}`,
      html: `${body}`,
    });

    console.log("Email sent successfully:", info?.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email in mailSender:", error?.message || error);
    throw error;
  }
};

module.exports = mailSender;
