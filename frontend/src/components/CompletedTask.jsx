import React, { useContext, useState, useRef, useEffect } from 'react';
import moment from "moment";
import TaskContext from '../context/TaskContext';
import TokenContext from '../context/TokenContext';
import axios from '../Axios/axios.js';

function CompletedTask({task, id}) {
    const { dispatch } = useContext(TaskContext);
    const { userToken } = useContext(TokenContext);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
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
        e.stopPropagation();
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

    return ( 
        <div 
            ref={taskRef}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => setExpandDetails(!expandDetails)}
            className={`relative bg-white py-5 px-4 rounded-xl shadow-sm flex items-start gap-3 mb-4 transition-all 
                   hover-lift hover:shadow-lg md:max-w-4xl mx-auto overflow-hidden
                   border-l-4 border-emerald-500
                   ${isHovered ? 'shadow-md bg-green-50' : ''}`}
        >
            {/* Completed checkmark icon */}
            <div className="relative flex-shrink-0 mt-0.5">
                <div className="flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>
            </div>
            
            {/* Task content */}
            <div 
                className="task-info flex-1 px-1"
                onClick={(e) => {
                    e.stopPropagation();
                    setExpandDetails(!expandDetails);
                }}
            >
                <div className="flex items-center">
                    <h4 className="task-title text-lg md:text-xl font-medium line-through text-gray-600">
                        {task.title}
                    </h4>
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Completed
                    </span>
                </div>
                
                <div className={`mt-1 transition-all duration-300 ${expandDetails ? 'max-h-96 opacity-100' : 'max-h-10 overflow-hidden'}`}>
                    <p className="task-description break-words text-gray-500">
                        {task.description}
                    </p>
                </div>
                
                <div className='flex items-center text-xs text-gray-500 mt-2'>
                    <svg className="w-4 h-4 mr-1 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    {task?.createdAt ? (
                        <span>Completed {moment(task.createdAt).fromNow()}</span>
                    ) : (
                        <span>Completed just now</span>
                    )}
                    
                    {!expandDetails && (
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                setExpandDetails(true);
                            }}
                            className="ml-2 text-emerald-600 hover:text-emerald-700 text-xs font-medium transition-colors"
                        >
                            Show more
                        </button>
                    )}
                </div>
            </div>
            
            {/* Delete button */}
            <div className={`task-actions flex items-center transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0 md:opacity-30'}`}>
                {isDeleting ? (
                    <div className="w-8 h-8 rounded-full border-2 border-emerald-500 p-1 flex items-center justify-center">
                        <div className="w-5 h-5 border-t-2 border-emerald-500 rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <button
                        onClick={handleRemove}
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

export default CompletedTask;