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
    // Attempt email dispatch asynchronously
    await mailSender(
      email,
      "Your Message Received - SkillNotion",
      contactUsEmail(email, firstname, lastname, message, phoneNo, countrycode)
    );
  } catch (mailError) {
    console.error("Contact confirmation email failed:", mailError?.message || mailError);
    // Log error but allow contact form submission to succeed for the user
  }

  return res.status(200).json({
    success: true,
    message: "Your message has been received successfully!",
  });
};
