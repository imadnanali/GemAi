import React, { useContext, useEffect, useRef } from "react";
import { MyContext } from "./MyContext";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

const Chat = ({ loading }) => {
  const { prevChats, newChat, displayedMessages, setDisplayedMessages, isHistoryChat } = useContext(MyContext);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [displayedMessages, loading]);

  useEffect(() => {
    if (newChat) {
      setDisplayedMessages([]);
      return;
    }

    if (isHistoryChat && prevChats.length > 0) {
      setDisplayedMessages(prevChats);
      return;
    }

    if (prevChats.length === 0) return;
    
    const lastMessage = prevChats[prevChats.length - 1];

    if (lastMessage.role === "assistant" && !isHistoryChat) {
      let words = lastMessage.content.split(" ");
      let i = 0;
      const interval = setInterval(() => {
        setDisplayedMessages([
          ...prevChats.slice(0, -1),  
          {
            ...lastMessage,
            content: words.slice(0, i + 1).join(" "),
          },
        ]);
        i++;
        if (i >= words.length) clearInterval(interval);
      }, 40);
      return () => clearInterval(interval);
    } else {
      setDisplayedMessages(prevChats);
    }
  }, [prevChats, newChat, isHistoryChat]);

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar bg-[#111111] text-gray-200 pb-36">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {displayedMessages.length === 0 && newChat ? (
          <div className="flex flex-col items-center justify-center text-center h-[366px]">
            <div className="w-16 h-16 mb-5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <img
                src="./assets/blacklogo.png"
                alt="GemAI logo"
                className="invert h-8"
              />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Where should we begin?
            </h2>
            <p className="text-gray-400 text-base mb-8">
              Ask me anything and I'll help you find the answers you need.
            </p>
          </div>
        ) : (
          displayedMessages.map((chat, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-4 ${
                chat.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {/* User Message */}
              {chat.role === "user" && (
                <div className="flex gap-3 max-w-[80%] justify-end">
                  <div className="bg-[#1a1a1a] rounded-2xl px-4 py-3 text-sm text-white shadow-md">
                    <p className="whitespace-pre-wrap">{chat.content}</p>
                  </div>
                </div>
              )}

              {/* AI Message */}
              {chat.role === "assistant" && (
                <div className="flex gap-3 max-w-[90%]">
                  
                  <div className="bg-[#1a1a1a] rounded-2xl px-4 py-3 text-sm text-white leading-6">
                    <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                      {chat.content}
                    </ReactMarkdown>
                  </div>
                </div>
              )}
            </div>
          ))
        )}

        {/* Loading dots*/}
        {loading && (
          <div className="flex justify-start items-center space-x-2 ml-1">
            <div className="flex gap-3 max-w-[90%]">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <img
                  src="./assets/blacklogo.png"
                  alt="GemAi logo"
                  className="invert h-4"
                />
              </div>
              <div className="bg-[#1a1a1a] rounded-2xl px-4 py-3 text-sm text-white leading-6">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300" />
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>
    </div>
  );
};

export default Chat;