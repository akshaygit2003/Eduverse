const nodemailer = require("nodemailer");

const mailSender = async (email, title, body) => {
  try {
    const isPort465 = process.env.MAIL_PORT === "465";

    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST || "smtp.gmail.com",
      port: process.env.MAIL_PORT ? Number(process.env.MAIL_PORT) : 587,
      secure: isPort465, // true for 465, false for 587
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
      connectionTimeout: 10000, // 10s timeout
      greetingTimeout: 10000,
      socketTimeout: 15000,
      tls: {
        rejectUnauthorized: false, // Prevent self-signed cert blocking
      },
    });

    const senderEmail = process.env.MAIL_USER || "noreply@eduverse.com";

    let info = await transporter.sendMail({
      from: `"SkillNotion" <${senderEmail}>`,
      to: `${email}`,
      subject: `${title}`,
      html: `${body}`,
    });

    console.log("Email sent successfully:", info?.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email in mailSender:", error.message || error);
    throw error;
  }
};

module.exports = mailSender;
