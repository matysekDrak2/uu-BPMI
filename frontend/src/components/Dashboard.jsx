import React, { useState, useEffect } from 'react';
import CreateTaskListModal from './CreateTaskListModal';
import TaskListDropdown from './TaskListDropdown';
import TaskList from './TaskList';
import { taskListService, authService } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
    const [taskLists, setTaskLists] = useState([]);
    const [activeTaskList, setActiveTaskList] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTaskListName, setNewTaskListName] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalError, setModalError] = useState(null);

    useEffect(() => {
        loadTaskLists();
    }, []);

    const loadTaskLists = async () => {
        try {
            setLoading(true);
            setError(null);
            const lists = await taskListService.getAllTaskLists();
            setTaskLists(lists);
            if (lists.length > 0) {
                setActiveTaskList(lists[0].id);
            }
        } catch (err) {
            console.error('Error loading task lists:', err);
            setError(err.message || 'Nepodařilo se načíst seznamy úkolů');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTaskList = () => {
        setModalError(null);
        setIsModalOpen(true);
    };

    const handleModalSubmit = async () => {
        const trimmedName = newTaskListName.trim();
        if (trimmedName) {
            // Kontrola délky názvu
            if (trimmedName.length > 50) {
                setModalError('Název seznamu úkolů nesmí být delší než 50 znaků');
                return;
            }

            // Kontrola na duplikátní název
            const isDuplicate = taskLists.some(list =>
                list.name.toLowerCase() === trimmedName.toLowerCase()
            );

            if (isDuplicate) {
                setModalError('Seznam úkolů s tímto názvem již existuje');
                return;
            }

            try {
                setError(null);
                setModalError(null);
                const newTaskList = await taskListService.createTaskList(trimmedName);
                setTaskLists([...taskLists, newTaskList]);
                setActiveTaskList(newTaskList.id);
                setNewTaskListName('');
                setIsModalOpen(false);
            } catch (err) {
                console.error('Error creating task list:', err);
                setModalError(err.message || 'Nepodařilo se vytvořit seznam úkolů');
            }
        }
    };

    const handleTaskListSelect = (id) => {
        setActiveTaskList(id);
        setIsDropdownOpen(false);
    };

    const handleLogout = () => {
        authService.logout();
        window.location.href = '/login';
    };

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <div className="header-controls">
                    <button className="new-tasklist-button" onClick={handleCreateTaskList}>
                        + Nový seznam úkolů
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

                    <button className="logout-button" onClick={handleLogout}>
                        Odhlásit se
                    </button>
                </div>
            </div>

            {error && <div className="error-message">{error}</div>}
            {loading && <div className="loading-indicator">Načítání...</div>}

            <CreateTaskListModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleModalSubmit}
                taskListName={newTaskListName}
                setTaskListName={setNewTaskListName}
                error={modalError}
            />

            <div className="tasklists-container">
                {taskLists.map(list => (
                    <TaskList
                        key={list.id}
                        isVisible={activeTaskList === list.id}
                        taskList={list}
                    />
                ))}
            </div>
        </div>
    );
};

export default Dashboard;