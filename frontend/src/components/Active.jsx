import React from 'react';
import Task from './Task/Task';
import { useContext, useState, useEffect } from 'react';
import TaskContext from '../context/TaskContext';
function Active() {
    const { tasks } = useContext(TaskContext);
    const [isLoading, setIsLoading] = useState(true);
    const activeTasks = tasks.filter(task => !task.completed);
    
    useEffect(() => {
        // Simulate loading for a smoother UI experience
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 600);
        
        return () => clearTimeout(timer);
    }, []);
    
    return (
        <div className="py-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Active Tasks</h2>
            
            {isLoading ? (
                <div className="flex justify-center items-center py-10">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-700"></div>
                </div>
            ) : activeTasks.length !== 0 ? (
                <div className="space-y-4">
                    {activeTasks.map((task, index) => {
                        // Find the original index in the full tasks array
                        const taskIndex = tasks.findIndex(t => t._id === task._id);
                        return (
                            <Task
                                key={task._id || index}
                                task={task}
                                id={taskIndex !== -1 ? taskIndex : index}
                            />
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-10 bg-gray-50 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No active tasks</h3>
                    <p className="mt-1 text-sm text-gray-500">All your tasks are completed!</p>
                </div>
            )}
        </div>
     );
}

export default Active;