import React from 'react'
import { useState, useRef, useEffect } from 'react';
import AuthModal from './AuthModal';
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(null);
    const dropdownRef = useRef(null);

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

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Close dropdown on escape key
    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                setIsOpen(false);
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <header className="flex items-center justify-between px-4 sm:px-6 py- border-b border-gray-800 bg-[#111111]">
                {/* Logo/Brand */}
                <h1 className="text-lg sm:text-xl sm:ms-0 ms-12 font-semibold tracking-wide text-white">
                    GemAi
                </h1>
                
                {/* Profile Section */}
                <div 
                    onClick={openProfile} 
                    className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-[#1a1a1a] transition-colors duration-200"
                >
                    {/* User Avatar - Hidden on mobile, shown on tablet+ */}
                    <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                        {user ? (
                            user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()
                        ) : (
                            <i className="fa-solid fa-circle-user text-sm"></i>
                        )}
                    </div>
                    
                    {/* User Name - Hidden on mobile, shown on tablet+ */}
                    <span className="text-sm text-gray-300 hidden sm:block">
                        {user ? user.name || user.email : "Guest"}
                    </span>
                    
                    {/* Dropdown Arrow */}
                    <i className={`fa-solid fa-chevron-down text-gray-400 text-xs transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} hidden sm:block`}></i>
                </div>
            </header>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-2 sm:right-4 top-16 w-48 bg-[#323232] rounded-xl shadow-lg overflow-hidden border border-gray-700 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    {user ? (
                        <>
                            {/* User Info - Hidden on mobile, shown on desktop */}
                            <div className="px-4 py-3 border-b border-gray-600 hidden sm:block">
                                <p className="text-sm font-medium text-white truncate">
                                    {user.name || user.email}
                                </p>
                                <p className="text-xs text-gray-400 truncate">
                                    {user.email}
                                </p>
                            </div>
                            
                            {/* Mobile User Info */}
                            <div className="px-4 py-3 border-b border-gray-600 sm:hidden">
                                <p className="text-sm font-medium text-white">
                                    {user.name || user.email}
                                </p>
                                <p className="text-xs text-gray-400">
                                    {user.email}
                                </p>
                            </div>

                            <div className="flex items-center gap-3 px-4 py-3 text-gray-200 hover:bg-[#404040] cursor-pointer transition-colors duration-200">
                                <i className="fa-solid fa-gear text-gray-300 w-5 text-center"></i>
                                <span className="text-sm">Settings</span>
                            </div>
                            
                            <div className="flex items-center gap-3 px-4 py-3 text-gray-200 hover:bg-[#404040] cursor-pointer transition-colors duration-200">
                                <i className="fa-solid fa-cloud-arrow-up text-gray-300 w-5 text-center"></i>
                                <span className="text-sm">Upgrade</span>
                            </div>
                            
                            <div
                                onClick={handleLogout}
                                className="flex items-center gap-3 px-4 py-3 text-gray-200 hover:bg-[#404040] cursor-pointer transition-colors duration-200 border-t border-gray-600"
                            >
                                <i className="fa-solid fa-right-from-bracket text-gray-300 w-5 text-center"></i>
                                <span className="text-sm">Logout</span>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Guest User Info */}
                            <div className="px-4 py-3 border-b border-gray-600">
                                <p className="text-sm font-medium text-white">Guest User</p>
                                <p className="text-xs text-gray-400">Sign in to save your chats</p>
                            </div>

                            <div
                                onClick={() => {
                                    setShowAuthModal("login");
                                    setIsOpen(false);
                                }}
                                className="flex items-center gap-3 px-4 py-3 text-gray-200 hover:bg-[#404040] cursor-pointer transition-colors duration-200"
                            >
                                <i className="fa-solid fa-right-to-bracket text-gray-300 w-5 text-center"></i>
                                <span className="text-sm">Login</span>
                            </div>
                            
                            <div
                                onClick={() => {
                                    setShowAuthModal("signup");
                                    setIsOpen(false);
                                }}
                                className="flex items-center gap-3 px-4 py-3 text-gray-200 hover:bg-[#404040] cursor-pointer transition-colors duration-200 border-t border-gray-600"
                            >
                                <i className="fa-solid fa-user-plus text-gray-300 w-5 text-center"></i>
                                <span className="text-sm">Sign Up</span>
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* Auth Modal */}
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