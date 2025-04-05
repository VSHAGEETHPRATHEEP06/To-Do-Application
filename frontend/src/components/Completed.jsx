import React, { useContext, useState, useEffect } from "react";
import TaskContext from "../context/TaskContext";
import CompletedTask from "./CompletedTask";
function Completed() {
    const { tasks } = useContext(TaskContext);
    const [isLoading, setIsLoading] = useState(true);
    const completedTasks = tasks.filter(task => task.completed);
    
    useEffect(() => {
        // Simulate loading for a smoother UI experience
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 600);
        
        return () => clearTimeout(timer);
    }, []);
    
    return (
        <div className="py-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Completed Tasks</h2>
            
            {isLoading ? (
                <div className="flex justify-center items-center py-10">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-700"></div>
                </div>
            ) : completedTasks.length !== 0 ? (
                <div className="space-y-4">
                    {completedTasks.map((task, index) => {
                        // Find the original index in the full tasks array
                        const taskIndex = tasks.findIndex(t => t._id === task._id);
                        return (
                            <CompletedTask
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
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No completed tasks</h3>
                    <p className="mt-1 text-sm text-gray-500">Complete some tasks to see them here!</p>
                </div>
            )}
        </div>
    );
}

export default Completed;