import React, { useState } from 'react';
import CreateTaskListModal from './CreateTaskListModal';
import TaskListDropdown from './TaskListDropdown';
import TaskList from './TaskList';
import './Dashboard.css';

const Dashboard = () => {
    const [taskLists, setTaskLists] = useState([]);
    const [activeTaskList, setActiveTaskList] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTaskListName, setNewTaskListName] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleCreateTaskList = () => {
        setIsModalOpen(true);
    };

    const handleModalSubmit = () => {
        if (newTaskListName.trim()) {
            const newTaskList = {
                id: taskLists.length + 1,
                name: newTaskListName
            };
            setTaskLists([...taskLists, newTaskList]);
            setActiveTaskList(newTaskList.id);
            setNewTaskListName('');
            setIsModalOpen(false);
        }
    };

    const handleTaskListSelect = (id) => {
        setActiveTaskList(id);
        setIsDropdownOpen(false);
    };

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <div className="header-controls">
                    <button className="new-tasklist-button" onClick={handleCreateTaskList}>
                        + New Task List
                    </button>

                    {taskLists.length > 0 && (
                        <TaskListDropdown
                            taskLists={taskLists}
                            activeTaskList={activeTaskList}
                            onTaskListSelect={handleTaskListSelect}
                            isOpen={isDropdownOpen}
                            onToggle={() => setIsDropdownOpen(!isDropdownOpen)}
                        />
                    )}
                </div>
            </div>

            <CreateTaskListModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleModalSubmit}
                taskListName={newTaskListName}
                setTaskListName={setNewTaskListName}
            />

            <div className="tasklists-container">
                {taskLists.map(list => (
                    <TaskList
                        key={list.id}
                        isVisible={activeTaskList === list.id}
                    />
                ))}
            </div>
        </div>
    );
};

export default Dashboard;