import React from 'react';
import TaskIndicator from './TaskIndicator';
import CreateTask from './createTask/CreateTask';
import { Outlet } from 'react-router-dom';
import { useContext } from 'react';
import TokenContext from '../context/TokenContext';
function Layout() {
    const { user } = useContext(TokenContext);
    
    return (
        <div className="container mx-auto px-4 py-6">
            <div className="mb-6 text-center">
                <h1 className="text-2xl md:text-3xl font-bold text-blue-700">Welcome, {user?.name || 'User'}!</h1>
                <p className="text-gray-600 mt-2">Manage your tasks efficiently</p>
            </div>
            
            <div className='flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6'>
                <div className='task-container w-full lg:w-1/2 xl:w-5/12'>
                    <div className='indicator mb-4'>
                        <TaskIndicator />
                    </div>

                    <div className='outlet'>
                        <Outlet />
                    </div>
                </div>
               
                <div className="w-full lg:w-1/2 xl:w-5/12 mt-6 lg:mt-0">
                    <CreateTask />
                </div>
            </div>
        </div>
    );
}

export default Layout;