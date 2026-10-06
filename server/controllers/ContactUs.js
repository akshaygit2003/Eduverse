const { contactUsEmail } = require("../mail/templates/contactFormRes");
const mailSender = require("../utils/mailSender");

exports.contactUsController = async (req, res) => {
  const { email, firstname, lastname, message, phoneNo, countrycode } = req.body;

  if (!email || !firstname || !message) {
    return res.status(400).json({
      success: false,
      message: "Please provide all required fields (email, firstname, and message).",
    });
  }

  console.log("Processing Contact Form Submission:", { email, firstname, lastname });

  try {
    // Send confirmation email
    const emailRes = await mailSender(
      email,
      "Your Message Received - SkillNotion",
      contactUsEmail(email, firstname, lastname, message, phoneNo, countrycode)
    );

    console.log("Contact form email result:", emailRes?.messageId);

    return res.status(200).json({
      success: true,
      message: "Your message has been sent successfully!",
    });
  } catch (error) {
    console.error("Error in contactUsController:", error?.message || error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while sending your email. Please try again later.",
      error: error?.message,
    });
  }
};
