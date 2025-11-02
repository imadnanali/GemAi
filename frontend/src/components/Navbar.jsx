import React from 'react'
import { useState } from 'react';
import AuthModal from './AuthModal';
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(null);

    const openProfile = () => {
        setIsOpen(!isOpen)
    }

    const handleLogout = () => {
        const answer = confirm('Are you sure you want to logout?');
        if (answer) {
            logout();
            setIsOpen(false);
            window.location.reload();
        }
    }


    return (
        <div>
            <header className="flex items-center justify-between px-6 py-[8px] border-b border-gray-800 bg-[#111111]">
                <h1 className="text-lg font-semibold tracking-wide">GemAi</h1>
                <div onClick={openProfile} className="flex items-center gap-2 cursor-pointer">
                    <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-xs font-bold text-white">
                        {user ? (
                            user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()
                        ) : (
                            <i className="fa-solid fa-circle-user"></i>
                        )}
                    </div>
                    <span className="text-sm text-gray-300">
                        {user ? user.name || user.email : "Guest"}
                    </span>
                </div>
            </header>
            {isOpen && (
                <div className="absolute right-12 top-12 w-40 bg-[#323232] rounded-xl shadow-lg overflow-hidden border border-gray-700">
                    {user ? (
                        <>
                            <div className="flex items-center gap-2 px-4 py-2 text-gray-200 hover:bg-[#404040] cursor-pointer transition">
                                <i className="fa-solid fa-gear text-gray-300"></i>
                                <span>Settings</span>
                            </div>
                            <div
                                onClick={() => {
                                    handleLogout()
                                }}
                                className="flex items-center gap-2 px-4 py-2 text-gray-200 hover:bg-[#404040] cursor-pointer transition"
                            >
                                <i className="fa-solid fa-right-from-bracket text-gray-300"></i>
                                <span>Logout</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 text-gray-200 hover:bg-[#404040] cursor-pointer transition">
                                <i className="fa-solid fa-cloud-arrow-up text-gray-300"></i>
                                <span>Upgrade</span>
                            </div>
                        </>
                    ) : (
                        <>
                            <div
                                onClick={() => setShowAuthModal("login")}
                                className="flex items-center gap-2 px-4 py-2 text-gray-200 hover:bg-[#404040] cursor-pointer transition"
                            >
                                <i className="fa-solid fa-right-to-bracket text-gray-300"></i>
                                <span>Login</span>
                            </div>
                            <div
                                onClick={() => setShowAuthModal("signup")}
                                className="flex items-center gap-2 px-4 py-2 text-gray-200 hover:bg-[#404040] cursor-pointer transition"
                            >
                                <i className="fa-solid fa-user-plus text-gray-300"></i>
                                <span>Signup</span>
                            </div>
                        </>
                    )}
                </div>
            )}
            {showAuthModal && (
                <AuthModal
                    type={showAuthModal}
                    onClose={() => setShowAuthModal(null)}
                />
            )}

        </div>
    )
}

export default Navbar
