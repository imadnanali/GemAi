import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const AuthModal = ({ type, onClose }) => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSignin = async (e) => {
  e.preventDefault();
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  };
  try {
    const response = await fetch("https://gemai-backend.onrender.com/api/auth/signup", options);
    const data = await response.json();
    
    if (response.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      
      console.log("Signup successful:", data.user);
      
      setName("");
      setEmail("");
      setPassword("");
      onClose();
      
      setTimeout(() => {
        window.location.reload();
      }, 100);
      
    } else {
      alert(data.message || "Signup failed");
    }
  } catch (err) {
    console.error("Signup error:", err);
    alert("Signup failed. Please try again.");
  }
}

  const handleLogin = async (e) => {
    e.preventDefault();
    const options = {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password })
    }
    const response = await fetch("https://gemai-backend.onrender.com/api/auth/login", options);
    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      onClose();
      setEmail("");
      setPassword("");
      window.location.reload();
    } else {
      alert(DataTransferItemList.message || "Login failed");
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        key="modal"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="bg-[#1f1f1f] text-gray-200 rounded-2xl p-8 w-[400px] shadow-2xl relative"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl cursor-pointer"
          >
            ✖
          </button>

          <h2 className="text-2xl font-semibold mb-6 text-center">
            {type === "login" ? "Login to AiBot" : "Create your AiBot Account"}
          </h2>

          {type === "login" ? (
            <form className="flex flex-col gap-3" onSubmit={handleLogin}>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="p-3 rounded-lg bg-[#2b2b2b] focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="p-3 rounded-lg bg-[#2b2b2b] focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 transition rounded-lg py-2 font-semibold mt-2"
              >
                Login
              </button>
            </form>
          ) : (
            <form className="flex flex-col gap-3" onSubmit={handleSignin}>
              <input
                type="text"
                placeholder="Full Name"
                name="name"
                onChange={(e) => setName(e.target.value)}
                value={name}
                className="p-3 rounded-lg bg-[#2b2b2b] focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="p-3 rounded-lg bg-[#2b2b2b] focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="p-3 rounded-lg bg-[#2b2b2b] focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 transition rounded-lg py-2 font-semibold mt-2"
              >
                Sign Up
              </button>
            </form>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AuthModal;
