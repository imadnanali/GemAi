import React, { useContext, useEffect, useState } from "react";
import Chat from "./Chat";
import { MyContext } from "./MyContext.jsx";
import Navbar from "./Navbar.jsx";

const ChatWindow = () => {
  const [loading, setLoading] = useState(false);
  const {
    prompt,
    setPrompt,
    reply,
    setReply,
    currThreadId,
    setPrevChats,
    setNewChat,
    setIsHistoryChat,
    getAllThreads
  } = useContext(MyContext);

  const getReply = async () => {
    setPrompt("")
    setNewChat(false)
    setIsHistoryChat(false);
    if (!prompt.trim()) return;

    setLoading(true);
    setPrevChats((prev) => [...prev, { role: "user", content: prompt }]);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch("https://gemai-backend.onrender.com/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({ content: prompt, threadId: currThreadId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const res = await response.json();
      setReply(res.reply);

      if (token) {
        console.log("User logged in, refreshing threads...");
        getAllThreads();
      }

    } catch (err) {
      console.error("Error sending message:", err);
      alert("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (reply) {
      setPrevChats((prev) => [...prev, { role: "assistant", content: reply }]);
      setReply("");
    }
  }, [reply]);

  // Handle Enter key for mobile keyboards
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      getReply();
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#111111] text-gray-200">
      {/* Header */}
      <Navbar />

      {/* Chat Section */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-4 py-2">
        <Chat loading={loading} />
      </div>

      {/* Input Section */}
      <footer className="w-full bg-[#111111] border-gray-800">
        <div className="max-w-4xl mx-auto px-4 ">
          {/* Mobile: Full width input */}
          <div className="lg:max-w-2xl mx-auto sm:me-[138px]">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Ask anything..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-[#1e1e1e] text-gray-200 rounded-2xl py-3 px-4 lg:py-4 lg:px-6 focus:outline-none placeholder-gray-500 text-sm lg:text-base border border-gray-700 focus:border-gray-700"
                disabled={loading}
              />
              <button
                className="absolute right-2 lg:right-3 text-blue-500 hover:text-blue-400 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors duration-200 p-2 rounded-full hover:bg-[#2a2a2a]"
                onClick={getReply}
                disabled={loading || !prompt.trim()}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 12h14M12 5l7 7-7 7"
                    />
                  </svg>
                )}
              </button>
            </div>

            {/* Disclaimer Text */}
            <p className="text-xs text-gray-500 text-center mt-3 px-4">
              {/* Mobile text */}
              <span className="sm:hidden">
                {localStorage.getItem("token") ? "GemAi may make mistakes" : "Sign in to save chats"}
              </span>
              {/* Desktop text */}
              <span className="hidden sm:inline">
                {localStorage.getItem("token")
                  ? "GemAi can make mistakes. Consider checking important information."
                  : "GemAi can make mistakes. Sign in to save your conversations."
                }
              </span>
            </p>
          </div>
        </div>

        {/* Safe area for mobile browsers */}
        <div className="h-4 safe-area-bottom lg:h-0"></div>
      </footer>
    </div>
  );
};

export default ChatWindow;