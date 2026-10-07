const { GoogleGenAI } = require("@google/genai");
const Category = require("../models/Category");
const Course = require("../models/Course");

exports.chatWithGemini = async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        success: false,
        message: "A valid string 'message' is required.",
      });
    }

    const trimmedMsg = message.trim();
    const lowerMsg = trimmedMsg.toLowerCase();

    // Fetch live categories & courses from database for context
    let categoriesList = [];
    let coursesList = [];

    try {
      categoriesList = await Category.find({}, "name description").exec();
      coursesList = await Course.find({ status: "Published" })
        .populate("category", "name")
        .populate("instructor", "firstName lastName")
        .exec();

      if (!coursesList || coursesList.length === 0) {
        coursesList = await Course.find({})
          .populate("category", "name")
          .populate("instructor", "firstName lastName")
          .exec();
      }
    } catch (dbErr) {
      console.warn("Chatbot database fetch error (non-fatal):", dbErr);
    }

    // Build database summary context for Gemini
    let dbContext = "\n--- LIVE EDUVERSE DATABASE CONTEXT ---\n";

    if (categoriesList.length > 0) {
      dbContext += "\n**Categories Available:**\n";
      categoriesList.forEach((cat) => {
        dbContext += `- ${cat.name}${cat.description ? `: ${cat.description}` : ""}\n`;
      });
    }

    if (coursesList.length > 0) {
      dbContext += "\n**Exact Courses & Pricing Details:**\n";
      coursesList.forEach((course, idx) => {
        const catName = course.category?.name || "General";
        const instructorName = course.instructor
          ? `${course.instructor.firstName || ""} ${course.instructor.lastName || ""}`.trim()
          : "Eduverse Instructor";
        dbContext += `${idx + 1}. **${course.courseName}**\n`;
        dbContext += `   - **Category:** ${catName}\n`;
        dbContext += `   - **Price:** ₹${course.price !== undefined ? course.price : "Free"}\n`;
        dbContext += `   - **Instructor:** ${instructorName}\n`;
        if (course.courseDescription) {
          dbContext += `   - **Description:** ${course.courseDescription}\n`;
        }
        if (course.whatYouWillLearn) {
          dbContext += `   - **What You'll Learn:** ${course.whatYouWillLearn}\n`;
        }
      });
    } else {
      dbContext += "\nNo specific courses currently found in database. Advise user on general Web Development, Data Science, and Machine Learning courses.";
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // Helper for intelligent fallback response when API key is missing, placeholder, or API fails
    const generateSmartFallback = () => {
      // 1. Time / Date queries
      if (lowerMsg.includes("time") || lowerMsg.includes("date") || lowerMsg.includes("day") || lowerMsg.includes("clock")) {
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
        const dateString = now.toLocaleDateString([], { weekday: "long", year: "numeric", month: "long", day: "numeric" });
        return `🕒 **Current Date & Time:**\n- **Time:** ${timeString}\n- **Date:** ${dateString}\n\nHow can I help you with your learning goals today?`;
      }

      // 2. Greetings
      if (lowerMsg === "hi" || lowerMsg === "hello" || lowerMsg === "hey" || lowerMsg.startsWith("greetings")) {
        return `👋 **Hello! Welcome to Eduverse AI.**\n\nI can help you with:\n- **Course Listings & Pricing**\n- **EdTech & Technology Concepts**\n- **Learning Roadmaps & Projects**\n\nWhat would you like to explore today?`;
      }

      // 3. EdTech / General Education queries
      if (lowerMsg.includes("edtech") || lowerMsg.includes("educational technology") || lowerMsg.includes("online learning")) {
        return `💡 **What is EdTech?**\n\n**EdTech (Educational Technology)** combines digital tools, software, and educational methodology to make learning accessible, interactive, and personalized.\n\nAt **Eduverse**, we leverage EdTech to provide hands-on programming courses, real-world development projects, and structured skill roadmaps!`;
      }

      // 4. Course / Category / Pricing queries
      if (lowerMsg.includes("course") || lowerMsg.includes("category") || lowerMsg.includes("price") || lowerMsg.includes("cost") || lowerMsg.includes("project") || lowerMsg.includes("catalog") || lowerMsg.includes("learn")) {
        let reply = `📚 **Eduverse Courses & Categories:**\n\n`;
        if (coursesList.length > 0) {
          coursesList.forEach((c) => {
            reply += `* **${c.courseName}**\n`;
            reply += `  * **Category:** ${c.category?.name || "General"}\n`;
            reply += `  * **Price:** ₹${c.price !== undefined ? c.price : 0}\n`;
            if (c.courseDescription) {
              reply += `  * **Overview:** ${c.courseDescription}\n`;
            }
          });
        } else if (categoriesList.length > 0) {
          reply += `**Categories Available:**\n`;
          categoriesList.forEach((cat) => {
            reply += `* **${cat.name}**: ${cat.description || "Explore courses in this category"}\n`;
          });
        } else {
          reply += `* **Web Development** (React, Node.js, Express, Flask, Django)\n* **Data Science & Analytics**\n* **Machine Learning & AI**\n`;
        }
        return reply;
      }

      // 5. Default general assistant response
      return `🤖 **Eduverse AI Assistant**\n\nI can assist you with basic questions, technology concepts, and all course details on Eduverse!\n\n`;
    };

    // If key is dummy or missing, return smart fallback
    if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY_HERE") {
      return res.status(200).json({
        success: true,
        reply: generateSmartFallback(),
        isDummy: true,
      });
    }

    // Attempt Gemini AI Call
    try {
      const ai = new GoogleGenAI({ apiKey });

      const nowIST = new Date().toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        dateStyle: "full",
        timeStyle: "medium",
      });

      const systemInstruction = `You are Eduverse AI Assistant, a versatile educational & general knowledge guide for the Eduverse platform.

CURRENT REAL-TIME CONTEXT:
- Current Time & Date in India (IST): ${nowIST}
- System Timestamp: ${new Date().toISOString()}

${dbContext}

Rules:
1. You have access to real-time clock data. When the user asks about the time, date, or time in India, use the Current Time & Date in India (IST) provided above to answer accurately and confidently.
2. When answering queries specifically about Eduverse courses, categories, or prices, always use the exact details from the LIVE EDUVERSE DATABASE CONTEXT provided above.
3. Be friendly, polite, concise, and helpful. Format responses with clean Markdown bullet points and bold text.`;

      let contentsList = [];
      if (Array.isArray(history) && history.length > 0) {
        history.forEach((item) => {
          contentsList.push({
            role: item.sender === "user" ? "user" : "model",
            parts: [{ text: item.text }],
          });
        });
      }

      contentsList.push({
        role: "user",
        parts: [{ text: message }],
      });

      let response;
      try {
        response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: contentsList,
          config: { systemInstruction },
        });
      } catch (geminiModelErr) {
        // Fallback model if gemini-2.5-flash is unavailable in API region
        response = await ai.models.generateContent({
          model: "gemini-1.5-flash",
          contents: contentsList,
          config: { systemInstruction },
        });
      }

      const replyText = response?.text || generateSmartFallback();

      return res.status(200).json({
        success: true,
        reply: replyText,
      });
    } catch (apiErr) {
      console.error("Gemini API Call failed, switching to smart fallback:", apiErr);
      return res.status(200).json({
        success: true,
        reply: generateSmartFallback(),
      });
    }
  } catch (error) {
    console.error("Gemini Chatbot Controller Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to process chat response",
    });
  }
};
