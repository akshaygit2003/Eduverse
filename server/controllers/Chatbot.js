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

    // Fetch live categories & courses from database for context
    let categoriesList = [];
    let coursesList = [];

    try {
      categoriesList = await Category.find({}, "name description").exec();
      coursesList = await Course.find({ status: "Published" })
        .populate("category", "name")
        .populate("instructor", "firstName lastName")
        .exec();
      
      // If no published courses found, fetch all courses as fallback
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

    // Fallback if API key is placeholder
    if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY_HERE") {
      let dummyReply = `Hello! I am **Eduverse Assistant**.\n\nHere are the exact course categories and prices currently available on our platform:\n\n`;

      if (coursesList.length > 0) {
        dummyReply += `### 📚 Available Courses:\n`;
        coursesList.forEach((c) => {
          dummyReply += `* **${c.courseName}**\n`;
          dummyReply += `  * **Category:** ${c.category?.name || "General"}\n`;
          dummyReply += `  * **Price:** ₹${c.price !== undefined ? c.price : 0}\n`;
          if (c.courseDescription) {
            dummyReply += `  * **Overview:** ${c.courseDescription}\n`;
          }
        });
      } else if (categoriesList.length > 0) {
        dummyReply += `### 🏷️ Categories Available:\n`;
        categoriesList.forEach((cat) => {
          dummyReply += `* **${cat.name}**: ${cat.description || "Explore courses in this category"}\n`;
        });
      } else {
        dummyReply += `* **Web Development** (React, Node.js, Express, Flask, Django)\n* **Data Science & Analytics**\n* **Machine Learning & AI**\n`;
      }

      dummyReply += `\n*(Note: Add your actual \`GEMINI_API_KEY\` in \`server/.env\` for custom conversational responses!)*`;

      return res.status(200).json({
        success: true,
        reply: dummyReply,
        isDummy: true,
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    // Build context-aware system instruction with live database information
    const systemInstruction = `You are Eduverse AI Assistant, an expert educational & customer support guide for the Eduverse platform.
Eduverse is an online tech learning platform with real-time course listings, categories, and prices.

${dbContext}

Rules:
1. Always use the exact course names, categories, and prices provided in the database context above when answering queries about courses.
2. Be helpful, polite, concise, and educational. Format responses using clean Markdown lists and bold text.
3. If asked about a course or category not in the database, mention what is currently available and offer to guide them.
4. Keep responses well-formatted and easy to read.`;

    // Construct conversation history
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

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contentsList,
      config: {
        systemInstruction,
      },
    });

    const replyText = response.text || "Sorry, I could not generate a response.";

    return res.status(200).json({
      success: true,
      reply: replyText,
    });
  } catch (error) {
    console.error("Gemini Chatbot Controller Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to process chat response",
    });
  }
};
