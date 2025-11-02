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
    const token = localStorage.getItem("token"); // Still get token but don't require it
    
    const response = await fetch("https://gemai-backend.onrender.com/api/chat", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        ...(token && { 'Authorization': `Bearer ${token}` }) // Only add auth header if token exists
      },
      body: JSON.stringify({ content: prompt, threadId: currThreadId }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const res = await response.json();
    setReply(res.reply);
    
    // Only refresh threads if user is logged in (has token)
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



  return (
    <div className="flex flex-col h-screen w-full bg-[#0d0d0d] text-gray-200">
      {/* Header */}
      <Navbar />
      {/* Chat Section */}
      <Chat loading={loading} />
      {/* Input Section */}
      <footer className="fixed bottom-0 w-full bg-[#111111]">
        <div className="max-w-[693px] mx-auto relative right-[173px]">
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Ask anything..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && getReply()}
              className="w-full bg-[#1a1a1a] text-gray-200 rounded-2xl py-4 px-6 focus:outline-none placeholder-gray-500"
            />
            <button
              className="absolute right-3 text-blue-500 hover:text-blue-400"
              onClick={getReply}
            >
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
            </button>
          </div>
          <p className="text-xs text-gray-500 text-center mt-3">
            AiBot can make mistakes. Consider checking important information.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ChatWindow;
