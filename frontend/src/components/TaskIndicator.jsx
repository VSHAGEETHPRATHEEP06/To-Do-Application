import React from 'react';
import { NavLink } from 'react-router-dom';

function TaskIndicator() {
    // Enhanced active style with gradient background
    const activeStyle = ({ isActive }) => {
        return {
            background: isActive ? 'linear-gradient(to right, #4f46e5, #8b5cf6)' : 'transparent',
            color: isActive ? 'white' : '#1e293b',
            fontWeight: isActive ? '600' : 'normal',
            boxShadow: isActive ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' : 'none'
        };
    };
    
    // Custom class for tab indicators with animation
    const tabClass = ({ isActive }) => {
        return `relative block w-full py-3 px-4 rounded-lg transition-all duration-300 text-sm md:text-base 
                ${isActive ? 'text-white' : 'hover:text-indigo-700'} 
                overflow-hidden transform hover:-translate-y-0.5 hover:shadow-md`;
    };
    
    // Badge counter component for task counts
    const Badge = ({ count, type }) => {
        return (
            <span className={`absolute top-1 right-1 inline-flex items-center justify-center px-2 py-1 text-xs 
                  font-bold leading-none rounded-full transition-all duration-300 
                  ${type === 'all' ? 'bg-indigo-100 text-indigo-800' : 
                    type === 'active' ? 'bg-blue-100 text-blue-800' : 
                    'bg-green-100 text-green-800'}`}>
                {count}
            </span>
        );
    };
    
    return ( 
        <div className='flex-grow mb-6'>
            <nav className="w-full">
                <div className='bg-white backdrop-blur-md bg-opacity-80 rounded-xl shadow-md p-1.5'>
                    <ul className='flex gap-1 sm:gap-2 justify-between'>
                        <li className="flex-1 text-center group">
                            <NavLink 
                                to="/" 
                                style={activeStyle}
                                className={tabClass}
                            >
                                <div className="flex flex-col items-center">
                                    <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                    <span>All Tasks</span>
                                </div>
                                {/* Animated underline effect */}
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-500 group-hover:w-full transition-all duration-300"></span>
                            </NavLink>
                        </li>
                        <li className="flex-1 text-center group">
                            <NavLink 
                                to="/active" 
                                style={activeStyle}
                                className={tabClass}
                            >
                                <div className="flex flex-col items-center">
                                    <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                    <span>Active</span>
                                </div>
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300"></span>
                            </NavLink>
                        </li>
                        <li className="flex-1 text-center group">
                            <NavLink 
                                to="/completed" 
                                style={activeStyle}
                                className={tabClass}
                            >
                                <div className="flex flex-col items-center">
                                    <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>Completed</span>
                                </div>
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-500 group-hover:w-full transition-all duration-300"></span>
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </nav>
        </div>
     );
}

export default TaskIndicator;