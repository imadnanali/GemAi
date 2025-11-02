import { useState } from 'react'
import './App.css'
import Chat from './components/Chat'
import ChatWindow from './components/ChatWindow'
import SideBar from './components/SideBar'
import { MyContext } from './components/MyContext.jsx'
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv4())
  const [prevChats, setPrevChats] = useState([]);
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);
  const [displayedMessages, setDisplayedMessages] = useState([]);
  const [isHistoryChat, setIsHistoryChat] = useState(false)

  const getAllThreads = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setAllThreads([]);
        return;
      }

      const response = await fetch("https://gemai-backend.onrender.com/api/thread", {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const res = await response.json();
        const filterData = res.map(thread => ({ 
          threadId: thread.threadId, 
          title: thread.title 
        }));
        setAllThreads(filterData);
        console.log("Threads fetched:", filterData.length);
      } else {
        console.log("Failed to fetch threads");
        setAllThreads([]);
      }
    } catch (err) {
      console.log("Error fetching threads:", err);
      setAllThreads([]);
    }
  };

  const providerValues = {
    prompt, setPrompt,
    reply, setReply,
    currThreadId, setCurrThreadId,
    newChat, setNewChat,
    prevChats, setPrevChats,
    allThreads, setAllThreads,
    displayedMessages, setDisplayedMessages,
    isHistoryChat, setIsHistoryChat,
    getAllThreads
  };

  return (
    <div className="custom-scrollbar flex overflow-y-auto">
      <MyContext.Provider value={providerValues}>
        <SideBar />
        <ChatWindow />
      </MyContext.Provider>
    </div>
  )
}

export default App