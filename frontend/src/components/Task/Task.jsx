import React from 'react';
import moment from 'moment';
import "./task.css";
import { useContext } from 'react';
import TaskContext from '../../context/TaskContext';

function Task({ task, id }) {
    const { dispatch } = useContext(TaskContext);

    const handleRemove = (e) => {
        e.preventDefault();
        dispatch({
            type: "REMOVE_TASK",
            id
        });
    };

    const handleMarkDone = (e) => {
        dispatch({
            type: "MARK_DONE",
            id
        });
    };

    return (
        <div className='bg-slate-300 py-4 rounded-lg shadow-md flex items-center justify-center gap-2 mb-3'>
            <div className="mark-done">
                <input
                    type="checkbox"
                    className="checkbox"
                    onChange={handleMarkDone}
                    checked={task.completed}
                />
            </div>
            <div className="task-info text-slate-900 text-sm w-10/12">
                <h4 className="task-title text-lg capitalize">{task.title}</h4>
                <p className="task-description">{task.description}</p>
                <div className='italic opacity-60'>
                    {task?.createdAt ? (
                        <p>{moment(task.createdAt).fromNow()}</p>
                    ) : (
                        <p>just now</p>
                    )}
                </div>
            </div>
            <div className="remove-task text-sm text-white">
                <img
                    src="/DeleteIcon.png" // Path to the PNG file in the public folder
                    alt="Delete"
                    style={{ width: "30px", height: "30px", cursor: "pointer" }}
                    onClick={handleRemove}
                    className="remove-task-btn bg-white rounded-full border-2 shadow-2xl border-blue-700 p-1"
                />
            </div>
        </div>
    );
}

export default Task;