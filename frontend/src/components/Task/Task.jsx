import React from 'react';
import moment from 'moment';
import "./task.css";
import { useContext, useState, useRef, useEffect } from 'react';
import TaskContext from '../../context/TaskContext';
import TokenContext from '../../context/TokenContext';
import axios from '../../Axios/axios.js';

function Task({ task, id }) {
    const { dispatch } = useContext(TaskContext);
    const { userToken } = useContext(TokenContext);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [showControls, setShowControls] = useState(false);
    const [expandDetails, setExpandDetails] = useState(false);
    const taskRef = useRef(null);
    
    // Animation for task appearance
    useEffect(() => {
        if (taskRef.current) {
            taskRef.current.classList.add('slide-in-task');
        }
    }, []);

    const handleRemove = async (e) => {
        e.preventDefault();
        setIsDeleting(true);
        
        // Add delete animation before actual deletion
        if (taskRef.current) {
            taskRef.current.classList.add('task-exit');
            // Wait for animation to complete before removing from state
            await new Promise(resolve => setTimeout(resolve, 300));
        }
        
        try {
            // Make API call to delete the task from the database
            await axios.post("/task/removeTask", 
                { id: task._id },
                { headers: { Authorization: `Bearer ${userToken}` }}
            );
            
            // Remove from frontend state
            dispatch({
                type: "REMOVE_TASK",
                id
            });
        } catch (error) {
            console.error("Error deleting task:", error);
            // If error, remove the exit animation
            if (taskRef.current) {
                taskRef.current.classList.remove('task-exit');
            }
        } finally {
            setIsDeleting(false);
        }
    };

    const handleMarkDone = async (e) => {
        try {
            // Add visual feedback for toggle action
            if (taskRef.current) {
                taskRef.current.classList.add('task-pulse');
                setTimeout(() => {
                    if (taskRef.current) {
                        taskRef.current.classList.remove('task-pulse');
                    }
                }, 500);
            }
            
            // Update backend (you would implement this API endpoint)
            // For now, just updating the frontend state
            dispatch({
                type: "MARK_DONE",
                id
            });
        } catch (error) {
            console.error("Error updating task status:", error);
        }
    };

    return (
        <div 
            ref={taskRef}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
                setIsHovered(false);
                // Keep controls visible for a moment after leaving
                setTimeout(() => setShowControls(false), 300);
            }}
            onClick={() => setExpandDetails(!expandDetails)}
            className={`relative bg-white py-5 px-4 rounded-xl shadow-sm flex items-start gap-3 mb-4 transition-all 
                  hover-lift hover:shadow-lg md:max-w-4xl mx-auto overflow-hidden
                  ${task.completed ? 'border-l-4 border-emerald-500' : 'border-l-4 border-indigo-500'}
                  ${isHovered ? 'shadow-md bg-slate-50' : ''}`}
        >
            {/* Priority indicator */}
            <div className="absolute -left-1 top-0 bottom-0 w-1 bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            {/* Checkbox with ripple effect */}
            <div className="mark-done relative">
                <div className={`checkbox-wrapper ${task.completed ? 'is-completed' : ''}`}>
                    <input
                        type="checkbox"
                        className="sr-only" // Hide actual checkbox for custom styling
                        onChange={handleMarkDone}
                        checked={task.completed}
                    />
                    <div 
                        onClick={(e) => {
                            e.stopPropagation();
                            handleMarkDone(e);
                        }}
                        className={`custom-checkbox w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all cursor-pointer
                            ${task.completed 
                                ? 'bg-emerald-500 border-emerald-500' 
                                : 'border-gray-300 hover:border-indigo-500'}`}
                    >
                        {task.completed && (
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        )}
                    </div>
                </div>
            </div>
            
            {/* Task content */}
            <div 
                className="task-info text-slate-900 text-sm flex-1 px-1"
                onClick={(e) => {
                    e.stopPropagation();
                    setExpandDetails(!expandDetails);
                }}
            >
                <h4 className={`task-title text-lg md:text-xl font-medium transition-all ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                    {task.title}
                </h4>
                
                <div className={`mt-1 transition-all duration-300 ${expandDetails ? 'max-h-96 opacity-100' : 'max-h-10 overflow-hidden'}`}>
                    <p className={`task-description break-words ${task.completed ? 'text-gray-400' : 'text-gray-600'}`}>
                        {task.description}
                    </p>
                </div>
                
                <div className='flex items-center text-xs text-gray-500 mt-2'>
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {task?.createdAt ? (
                        <span>{moment(task.createdAt).fromNow()}</span>
                    ) : (
                        <span>just now</span>
                    )}
                    
                    {!expandDetails && (
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                setExpandDetails(true);
                            }}
                            className="ml-2 text-indigo-500 hover:text-indigo-700 text-xs font-medium transition-colors"
                        >
                            Show more
                        </button>
                    )}
                </div>
            </div>
            
            {/* Task actions */}
            <div 
                className={`task-actions flex items-center space-x-2 transition-opacity duration-200 ${isHovered || showControls ? 'opacity-100' : 'opacity-0 md:opacity-30'}`}
                onClick={(e) => e.stopPropagation()}
            >
                {isDeleting ? (
                    <div className="w-8 h-8 rounded-full border-2 border-indigo-500 p-1 flex items-center justify-center">
                        <div className="w-5 h-5 border-t-2 border-indigo-500 rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleRemove(e);
                        }}
                        className="delete-btn p-2 rounded-full hover:bg-red-50 transition-colors group"
                        title="Delete task"
                    >
                        <svg className="w-5 h-5 text-red-500 group-hover:text-red-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
}

export default Task;