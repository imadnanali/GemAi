import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { MyContext } from "./MyContext.jsx";
import { v4 as uuidv4 } from 'uuid';
import { AuthContext } from "../context/AuthContext.jsx";
import logo from "../assets/blacklogo.png";

const SideBar = () => {
  const { allThreads, setAllThreads, currThreadId, setReply, setPrompt, setCurrThreadId, setPrevChats, setNewChat, setIsHistoryChat, getAllThreads, setDisplayedMessages } = useContext(MyContext);
  const { user } = useContext(AuthContext);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    if (user) {
      getAllThreads();
    } else {
      setAllThreads([]);
    }
  }, [user, currThreadId]);

  const createNewChat = () => {
    setPrompt("")
    setReply(null)
    setCurrThreadId(uuidv4());
    setPrevChats([]);
    setNewChat(true);
    setIsMobileOpen(false); // Close sidebar on mobile after creating new chat
  }

  const getPrevThread = async (newThreadId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login to view chat history");
        return;
      }

      setCurrThreadId(newThreadId);

      const response = await fetch(`https://gemai-backend.onrender.com/api/thread/${newThreadId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const res = await response.json();

      setPrevChats(res);
      setDisplayedMessages(res);
      setNewChat(false);
      setReply(null);
      setIsHistoryChat(true);
      setIsMobileOpen(false); // Close sidebar on mobile after selecting thread
    } catch (err) {
      console.log("Error fetching thread:", err);
      setPrevChats([]);
      setDisplayedMessages([]);
    }
  }

  const deleteThread = async (threadId) => {
    const answer = confirm('Are you sure? you want to delete Thread?');

    if (answer) {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          alert("Please login to delete threads");
          return;
        }

        const response = await fetch(`https://gemai-backend.onrender.com/api/thread/${threadId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to delete thread');
        }

        const data = await response.json();
        console.log("Delete response:", data);

        setAllThreads((prev) => prev.filter(thread => thread.threadId !== threadId));

        if (threadId === currThreadId) {
          createNewChat();
        }

      } catch (err) {
        console.error("Thread not deleted:", err);
        alert("Failed to delete thread. Please try again.");
      }
    } else {
      console.log("Thread not deleted — user cancelled.");
    }
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 bg-[#1a1a1a] rounded-lg text-white hover:bg-[#2a2a2a] transition-all duration-200"
        >
          <i className={`fa-solid ${isMobileOpen ? 'fa-xmark' : 'fa-bars'} text-lg`}></i>
        </button>
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-[#111111] top-0 bg-opacity-50 z-40"
          onClick={() => setIsMobileOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 top-3.5 z-40
        transform transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        h-screen w-64 bg-[#111111] text-gray-200 flex flex-col border-r border-gray-800
        lg:flex
      `}>

        {/* Header / Logo */}
        <div className="py-5 flex items-center justify-between px-4 border-b border-gray-800">
          {/* Logo section */}
          <div
            className="items-center gap-3 cursor-pointer"
            onClick={createNewChat}
          >
            <img
              src={logo}
              alt="GemAi logo"
              className="invert brightness-200 h-6 hidden sm:block"
            />
            {/* Invisible placeholder for mobile */}
            <div className="block sm:hidden w-6 h-6"></div>
          </div>

          {/* Right icons */}
          <div className="flex items-center gap-2">
            <i
              className="fa-solid fa-pen-to-square text-lg cursor-pointer hover:text-gray-300 transition-colors"
              onClick={createNewChat}
              title="New Chat"
            ></i>
          </div>
        </div>


        {/* New Chat Button */}
        <div className="p-3">
          <button
            onClick={createNewChat}
            className="flex items-center justify-center gap-2 w-full bg-[#1a1a1a] cursor-pointer hover:bg-[#2a2a2a] text-white text-sm font-medium py-3 rounded-xl transition-all duration-200 shadow-sm border border-gray-700"
          >
            <svg
              className="w-5 h-5"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            New Chat
          </button>
        </div>

        {/* Chat History */}
        <div className='flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-gray-700 custom-scrollbar scrollbar-track-gray-900'>
          <div className="flex-1 overflow-y-auto">
            <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">
              History
            </div>
            <ul className="space-y-1">
              {allThreads?.map((thread, index) => (
                <li key={index}>
                  <button
                    className={`w-full text-left flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-[#1e1e1e] transition-all duration-150 group ${currThreadId === thread.threadId && "bg-[#1e1e1e]"}`}
                    onClick={() => getPrevThread(thread.threadId)}
                  >
                    <i className="fa-solid fa-message text-gray-400 text-sm shrink-0"></i>
                    <span className="text-sm text-gray-300 truncate flex-1 text-left">
                      {thread.title}
                    </span>
                    <i
                      className="fa-solid fa-trash opacity-0 group-hover:opacity-100 hover:text-red-600 transition-opacity shrink-0 ml-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteThread(thread.threadId);
                      }}
                    ></i>
                  </button>
                </li>
              ))}
              {allThreads?.length === 0 && (
                <li className="px-3 py-4 text-center">
                  <p className="text-gray-400 text-sm">No chat history</p>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* User Section */}
        <div className="px-3 py-2 border-t border-gray-800">
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#1e1e1e] transition-all duration-150 cursor-pointer">
            <div className="w-10 h-10 bg-linear-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0">
              {user ? (
                user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()
              ) : (
                "U"
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user ? user.name || user.email : "Guest User"}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {user ? "Premium Account" : "Free Account"}
              </p>
            </div>
            <svg
              className="w-4 h-4 text-gray-400 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>
    </>
  );
};

export default SideBar;