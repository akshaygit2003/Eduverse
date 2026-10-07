import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { AiOutlineClose, AiOutlineSend, AiOutlineRobot } from "react-icons/ai";
import { apiConnector } from "../services/apiconnector";
import { chatbotEndpoints } from "../services/apis";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const samplePrompts = [
    "What courses do you offer?",
    "Tell me about Eduverse projects.",
    "How do I get started?",
  ];

  useEffect(() => {
    // Initial welcome message
    setMessages([
      {
        text: "👋 Hello! I am Eduverse AI Assistant powered by Gemini. Ask me anything about our courses, projects, or learning roadmaps!",
        sender: "bot",
      },
    ]);
  }, []);

  useEffect(() => {
    // Scroll to bottom when messages update
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (queryText) => {
    const textToSend = queryText || input;
    if (!textToSend || !textToSend.trim()) return;

    const userMessage = { text: textToSend.trim(), sender: "user" };
    const updatedHistory = [...messages, userMessage];

    setMessages(updatedHistory);
    if (!queryText) setInput("");
    setLoading(true);

    try {
      const response = await apiConnector("POST", chatbotEndpoints.CHATBOT_API, {
        message: textToSend.trim(),
        history: updatedHistory,
      });

      if (response?.data?.success && response?.data?.reply) {
        setMessages((prev) => [
          ...prev,
          { text: response.data.reply, sender: "bot" },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            text: "Sorry, I couldn't fetch a response. Please try again.",
            sender: "bot",
          },
        ]);
      }
    } catch (error) {
      console.error("Chatbot API error:", error);
      setMessages((prev) => [
        ...prev,
        {
          text: "I am having trouble connecting to the AI server. Please verify server connection.",
          sender: "bot",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-20 right-6 z-50">
      {/* Floating Toggle Button */}
      {!visible && (
        <button
          onClick={() => setVisible(true)}
          className="flex items-center justify-center w-14 h-14 rounded-full bg-yellow-50 text-richblack-900 shadow-2xl hover:scale-110 hover:bg-yellow-25 transition-all duration-200"
          aria-label="Open AI Chatbot"
        >
          <AiOutlineRobot className="text-3xl" />
        </button>
      )}

      {/* Chatbot Window */}
      {visible && (
        <div className="flex flex-col w-[340px] sm:w-[380px] h-[500px] bg-richblack-900 border border-richblack-700 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-md">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-richblack-800 border-b border-richblack-700">
            <div className="flex items-center gap-x-2">
              <div className="p-2 rounded-lg bg-yellow-50/10 text-yellow-50">
                <AiOutlineRobot className="text-xl" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-richblack-25">Eduverse AI</h4>
                <p className="text-[11px] text-richblack-300">Powered by Gemini</p>
              </div>
            </div>
            <button
              onClick={() => setVisible(false)}
              className="p-1 rounded-lg text-richblack-300 hover:text-richblack-25 hover:bg-richblack-700 transition-colors"
            >
              <AiOutlineClose className="text-lg" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex flex-col ${
                  msg.sender === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[88%] px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-yellow-50 text-richblack-900 font-medium rounded-tr-none"
                      : "bg-richblack-800 text-richblack-100 border border-richblack-700 rounded-tl-none"
                  }`}
                >
                  {msg.sender === "bot" ? (
                    <div className="prose prose-invert max-w-none text-xs sm:text-sm space-y-1.5 [&>ul]:list-disc [&>ul]:pl-4 [&>ol]:list-decimal [&>ol]:pl-4 [&>p]:mb-1.5 [&>p:last-child]:mb-0 [&>ul]:mb-1.5 [&>li]:mb-0.5 font-normal">
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>
                  ) : (
                    <span>{msg.text}</span>
                  )}
                </div>
              </div>
            ))}

            {/* Loading Indicator */}
            {loading && (
              <div className="flex items-start">
                <div className="bg-richblack-800 text-richblack-300 border border-richblack-700 px-4 py-2.5 rounded-2xl rounded-tl-none text-xs flex items-center gap-x-2 animate-pulse">
                  <span>Eduverse AI is thinking...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Sample Prompts */}
          {messages.length <= 2 && !loading && (
            <div className="px-3 pb-2 flex flex-wrap gap-1.5">
              {samplePrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(prompt)}
                  className="text-[11px] px-2.5 py-1 rounded-full bg-richblack-800 hover:bg-richblack-700 text-richblack-25 border border-richblack-700 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Input Footer */}
          <div className="p-3 bg-richblack-800 border-t border-richblack-700 flex items-center gap-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your message..."
              disabled={loading}
              className="flex-1 bg-richblack-900 text-richblack-25 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-richblack-700 focus:outline-none focus:border-yellow-50 transition-colors placeholder:text-richblack-400"
            />
            <button
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              className="p-2.5 rounded-xl bg-yellow-50 text-richblack-900 hover:bg-yellow-25 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <AiOutlineSend className="text-base" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
