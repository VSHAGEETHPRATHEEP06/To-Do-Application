import React, { useState, useRef, useEffect } from 'react';
import { useContext } from 'react';
import TaskContext from '../../context/TaskContext';
import TokenContext from '../../context/TokenContext';
import axios from "../../Axios/axios.js"
import "./createTask.css"
function CreateTask() {
    const { dispatch } = useContext(TaskContext)
    const { userToken } = useContext(TokenContext)
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [toast, setToast] = useState({ show: false, message: "", type: "" })
    const [isFocused, setIsFocused] = useState(false)
    const formRef = useRef(null)
    
    // Add entrance animation when component mounts
    useEffect(() => {
        if (formRef.current) {
            formRef.current.classList.add('fade-in-slide-up');
        }
    }, [])
    const handleAdd = async (e) => {
        e.preventDefault();
        if (!title.trim() || !description.trim()) {
            showToast("Please enter both title and description", "error");
            return;
        }
        
        // Add pulse animation to form when submitting
        if (formRef.current) {
            formRef.current.classList.add('pulse-once');
            setTimeout(() => {
                if (formRef.current) {
                    formRef.current.classList.remove('pulse-once');
                }
            }, 500);
        }
        
        setIsSubmitting(true);
        try {
            const res = await axios.post("/task/addTask", {title, description},{
                headers: {
                    Authorization: `Bearer ${userToken}`
                }
            });
            
            dispatch({
                type: "ADD_TASK",
                title,
                description
            });
            
            // Add success animation
            if (formRef.current) {
                formRef.current.classList.add('success-flash');
                setTimeout(() => {
                    if (formRef.current) {
                        formRef.current.classList.remove('success-flash');
                    }
                }, 1000);
            }
            
            setTitle("");
            setDescription("");
            showToast("Task added successfully!", "success");
        } catch (error) {
            console.log(error);
            showToast("Failed to add task. Please try again.", "error");
        } finally {
            setIsSubmitting(false);
        }
    }

    const showToast = (message, type = "success") => {
        setToast({ show: true, message, type });
        setTimeout(() => {
            setToast({ show: false, message: "", type: "" });
        }, 3000);
    };
    
    // Function to handle focus state for enhanced UI
    const handleFocusState = (focused) => {
        setIsFocused(focused);
    };
    return (
        <div 
            ref={formRef}
            className={`bg-white rounded-xl shadow-md p-6 w-full transition-all duration-300 ${isFocused ? 'shadow-lg transform scale-[1.01] border border-indigo-100' : ''}`}
        >
            <div className="flex items-center mb-6">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-2 rounded-lg mr-3">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                </div>
                <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">Create New Task</h2>
            </div>
            
            <form onSubmit={handleAdd} className="space-y-5">
                <div className="transition-all duration-300 transform hover:-translate-y-1">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1 ml-1">Title</label>
                    <div className="relative group">
                        <input
                            type="text"
                            name="title"
                            id="title"
                            placeholder="Enter task title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            onFocus={() => handleFocusState(true)}
                            onBlur={() => handleFocusState(false)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-3.5 pl-5 transition-all duration-200
                                focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:shadow-md focus:outline-none"
                        />
                        <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none transition-opacity opacity-0 group-hover:opacity-100">
                            <span className="text-indigo-500">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                            </span>
                        </div>
                    </div>
                </div>
                
                <div className="transition-all duration-300 transform hover:-translate-y-1">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1 ml-1">Description</label>
                    <div className="relative group">
                        <textarea
                            rows={5}
                            name="description"
                            id="description"
                            placeholder="Enter task description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            onFocus={() => handleFocusState(true)}
                            onBlur={() => handleFocusState(false)}
                            style={{ resize: "none" }}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-3.5 pl-5 transition-all duration-200
                                focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:shadow-md focus:outline-none"
                        />
                        <div className="absolute top-3 left-0 flex items-start pl-2 pointer-events-none transition-opacity opacity-0 group-hover:opacity-100">
                            <span className="text-indigo-500">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                                </svg>
                            </span>
                        </div>
                    </div>
                </div>
                
                <div className="pt-3">
                    <button
                        type='submit'
                        disabled={isSubmitting}
                        className={`w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-lg text-white py-3.5 font-medium 
                            transition-all duration-300 flex items-center justify-center shadow-md hover:shadow-lg transform hover:-translate-y-1 ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
                    >
                        {isSubmitting ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Creating Task...
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Create Task
                            </>
                        )}
                    </button>
                </div>
            </form>
            
            {/* Toast notification with animation */}
            {toast.show && (
                <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 animate-toast-in">
                    <div className={`px-6 py-3 rounded-lg shadow-lg ${toast.type === 'success' ? 'bg-gradient-to-r from-emerald-500 to-green-500' : 'bg-gradient-to-r from-red-500 to-pink-500'} text-white flex items-center`}>
                        {toast.type === 'success' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        )}
                        <span className="font-medium">{toast.message}</span>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CreateTask;