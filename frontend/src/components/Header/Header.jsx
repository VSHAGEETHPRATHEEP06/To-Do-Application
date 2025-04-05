import React, { useState, useEffect } from 'react';
import { useContext } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import TokenContext from '../../context/TokenContext.js';
import "./header.css"
function Header() {
    const token = localStorage.getItem("authToken");
    const { user } = useContext(TokenContext);
    const [isScrolled, setIsScrolled] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const location = useLocation();
    
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
    
    // Close dropdown when route changes
    useEffect(() => {
        setShowDropdown(false);
    }, [location]);
    
    const logout = () => {
        // Add animation before logout
        document.body.classList.add('fade-out');
        setTimeout(() => {
            localStorage.removeItem("authToken");
            window.location.href = "/login";
        }, 300);
    }

    return (
        <div>
            <nav className={`fixed top-0 left-0 right-0 z-30 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-gradient-to-r from-indigo-600 to-purple-600'} ${isScrolled ? 'py-2' : 'py-4'}`}>
                <div className="container mx-auto px-4 flex justify-between items-center">
                    <div className="logo flex items-center">
                        <NavLink to="/" className={`text-xl md:text-2xl font-bold transition-all hover:scale-105 ${isScrolled ? 'text-indigo-600' : 'text-white'}`}>
                            <span className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                                </svg>
                                TaskMaster
                            </span>
                        </NavLink>
                    </div>
                    
                    {token && user?.name && (
                        <div className="hidden md:block">
                            <p className={`font-medium ${isScrolled ? 'text-gray-700' : 'text-white'}`}>
                                Welcome, <span className="font-bold text-xl capitalize">{user.name}</span>
                            </p>
                        </div>
                    )}
                    
                    <div className="relative">
                        {token ? (
                            <div className="flex items-center gap-4">
                                <button 
                                    onClick={() => setShowDropdown(!showDropdown)}
                                    className={`flex items-center focus:outline-none ${isScrolled ? 'text-gray-700' : 'text-white'}`}
                                >
                                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg border-2 border-indigo-300 hover:border-indigo-500 transition-all">
                                        {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                    </div>
                                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ml-1 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                                
                                {showDropdown && (
                                    <div className="absolute right-0 top-12 w-48 bg-white rounded-lg shadow-lg py-2 z-50 fade-in">
                                        <div className="px-4 py-2 border-b border-gray-100">
                                            <p className="text-sm text-gray-500">Signed in as</p>
                                            <p className="font-medium text-gray-900 truncate">{user?.name || 'User'}</p>
                                        </div>
                                        <button 
                                            onClick={logout} 
                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors flex items-center"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm1 2h10v10H4V5zm7 4a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V9z" clipRule="evenodd" />
                                            </svg>
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex gap-3">
                                <NavLink 
                                    to="/login"
                                    className={({ isActive }) =>
                                        `px-4 py-2 rounded-md font-medium transition-all transform hover:scale-105 ${isActive 
                                            ? 'bg-white text-indigo-600 shadow-md' 
                                            : isScrolled 
                                                ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                                                : 'bg-white text-indigo-600 hover:bg-indigo-50'
                                        }`
                                    }
                                >
                                    Login
                                </NavLink>
                                <NavLink 
                                    to="/register"
                                    className={({ isActive }) =>
                                        `px-4 py-2 rounded-md font-medium transition-all transform hover:scale-105 ${isActive 
                                            ? 'bg-white text-indigo-600 shadow-md' 
                                            : isScrolled 
                                                ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                                                : 'bg-white text-indigo-600 hover:bg-indigo-50'
                                        }`
                                    }
                                >
                                    Register
                                </NavLink>
                            </div>
                        )}
                    </div>
                </div>
            </nav>
            
            {/* Add space for fixed header */}
            <div className={`${isScrolled ? 'pt-16' : 'pt-24'}`}></div>
            
            <main className="fade-in">
                <Outlet />
            </main>
        </div>
    );
}

export default Header;