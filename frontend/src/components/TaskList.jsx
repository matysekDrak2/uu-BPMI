import React, { useState, useEffect } from 'react';
import CreateTaskModal from './CreateTaskModal';
import { taskService } from '../services/api';
import './TaskList.css';

const TaskList = ({ isVisible, taskList }) => {
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [tasks, setTasks] = useState({
        open: [],      // state = 0
        inProgress: [], // state = 1
        completed: []   // state = 2
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // Load tasks when the component mounts or when taskList changes
    useEffect(() => {
        if (isVisible && taskList && taskList.id) {
            loadTasks();
        }
    }, [isVisible, taskList]);

    const loadTasks = async () => {
        try {
            setLoading(true);
            setError(null);

            const taskData = await taskService.getTasksByListId(taskList.id);
            setTasks(taskData);

            setLoading(false);
        } catch (err) {
            console.error('Error loading tasks:', err);
            setError(err.message || 'Nepodařilo se načíst úkoly');
            setLoading(false);
        }
    };

    const handleCreateTask = () => {
        setError(null);
        setIsTaskModalOpen(true);
    };

    const handleTaskSubmit = async (taskListId, taskText) => {
        try {
            setError(null);
            // Create the task with state 0 (open)
            const newTask = await taskService.createTask(taskListId, taskText, 0);

            // Check if newTask is valid before updating state
            if (newTask && newTask.id) {
                // Add the new task to the open tasks
                setTasks(prevTasks => ({
                    ...prevTasks,
                    open: [...prevTasks.open, newTask]
                }));
            } else {
                // If the newTask object is invalid, reload all tasks
                await loadTasks();
            }

            // Close the modal
            setIsTaskModalOpen(false);
        } catch (err) {
            console.error('Error creating task:', err);
            setError(err.message || 'Nepodařilo se vytvořit úkol');
        }
    };

    return (
        <div className={`tasklist ${isVisible ? 'visible' : 'hidden'}`}>
            {taskList && (
                <>
                    <div className="tasklist-header">
                        <h3 className="tasklist-title">{taskList.name}</h3>
                        <button
                            className="create-task-button"
                            onClick={handleCreateTask}
                        >
                            Vytvořit úkol
                        </button>
                    </div>

                    {error && <div className="error-message">{error}</div>}
                    {loading && <div className="loading-message">Načítání úkolů...</div>}
                </>
            )}

            <div className="tasklist-content">
                <div className="column">
                    <h4>Otevřené</h4>
                    <div className="tasks-container">
                        {tasks.open.map(task => (
                            <div key={task.id} className="task-card">
                                <div className="task-content">
                                    {task.text}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="column">
                    <h4>Probíhající</h4>
                    <div className="tasks-container">
                        {tasks.inProgress.map(task => (
                            <div key={task.id} className="task-card">
                                <div className="task-content">
                                    {task.text}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="column">
                    <h4>Dokončené</h4>
                    <div className="tasks-container">
                        {tasks.completed.map(task => (
                            <div key={task.id} className="task-card">
                                <div className="task-content">
                                    {task.text}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <CreateTaskModal
                isOpen={isTaskModalOpen}
                onClose={() => setIsTaskModalOpen(false)}
                onSubmit={(text) => handleTaskSubmit(taskList.id, text)}
                taskListId={taskList ? taskList.id : null}
            />
        </div>
    );
};

export default TaskList; 