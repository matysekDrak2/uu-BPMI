import React, { useState, useEffect } from 'react';
import CreateTaskModal from './CreateTaskModal';
import TaskDetailModal from './TaskDetailModal';
import { taskService } from '../services/api';
import './TaskList.css';

const TaskList = ({ isVisible, taskList }) => {
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
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

    const handleViewTask = (task) => {
        setSelectedTask(task);
        setIsDetailModalOpen(true);
    };

    const parseTaskBasicInfo = (text) => {
        if (!text) return { title: 'Untitled Task', priority: 'normal', description: '' };

        const lines = text.split('\n');
        let title = 'Untitled Task';
        let priority = 'normal';
        let description = '';

        for (const line of lines) {
            if (line.startsWith('Název:')) {
                title = line.substring(6).trim();
                // Truncate title to 15 characters if longer
                if (title.length > 15) {
                    title = title.substring(0, 15) + '...';
                }
            } else if (line.startsWith('Priorita:')) {
                priority = line.substring(9).trim();
            } else if (line.startsWith('Popis:')) {
                description = line.substring(6).trim();
                // Truncate description to 35 characters if longer
                if (description.length > 35) {
                    description = description.substring(0, 35) + '...';
                }
            }
        }

        return { title, priority, description };
    };

    const renderTaskCard = (task) => {
        const { title, priority, description } = parseTaskBasicInfo(task.text);
        return (
            <div
                key={task.id}
                className="task-card"
            >
                <div className="task-card-header">
                    <h4 className="task-title">{title}</h4>
                </div>
                {description && <p className="task-description-preview">{description}</p>}
                <div className="task-card-footer">
                    <span className={`task-priority priority-${priority.toLowerCase()}`}>
                        {getPriorityLabel(priority)}
                    </span>
                    <button
                        className="view-task-button"
                        onClick={() => handleViewTask(task)}
                        title="Zobrazit detail"
                    >
                        👁️
                    </button>
                </div>
            </div>
        );
    };

    const getPriorityLabel = (priority) => {
        switch (priority.toLowerCase()) {
            case 'high': return 'Vysoká';
            case 'low': return 'Nízká';
            default: return 'Střední';
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
                        {tasks.open.map(task => renderTaskCard(task))}
                    </div>
                </div>
                <div className="column">
                    <h4>Probíhající</h4>
                    <div className="tasks-container">
                        {tasks.inProgress.map(task => renderTaskCard(task))}
                    </div>
                </div>
                <div className="column">
                    <h4>Dokončené</h4>
                    <div className="tasks-container">
                        {tasks.completed.map(task => renderTaskCard(task))}
                    </div>
                </div>
            </div>

            <CreateTaskModal
                isOpen={isTaskModalOpen}
                onClose={() => setIsTaskModalOpen(false)}
                onSubmit={(text) => handleTaskSubmit(taskList.id, text)}
                taskListId={taskList ? taskList.id : null}
            />

            {selectedTask && (
                <TaskDetailModal
                    isOpen={isDetailModalOpen}
                    task={selectedTask}
                    onClose={() => setIsDetailModalOpen(false)}
                />
            )}
        </div>
    );
};

export default TaskList; 