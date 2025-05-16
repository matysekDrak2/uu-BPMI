import React, { useState, useEffect } from 'react';
import CreateTaskModal from './CreateTaskModal';
import TaskDetailModal from './TaskDetailModal';
import ManageUsersModal from './ManageUsersModal';
import { TaskCard } from './TaskCard';
import TaskColumn from './TaskColumn';
import { taskService } from '../services/api';
import {
    handleReorderTask,
    handleMoveTask,
    updateTaskWithNewId,
    getArrayKeyFromState
} from './DragDropUtils';
import '../styles/TaskList.css';

// Helper functions
const parseTaskBasicInfo = (text) => {
    if (!text) return { title: 'Untitled Task', priority: 'normal', description: '' };

    const lines = text.split('\n');
    let title = 'Untitled Task';
    let priority = 'normal';
    let description = '';

    for (const line of lines) {
        if (line.startsWith('Název:')) {
            title = line.substring(6).trim();
            if (title.length > 15) {
                title = title.substring(0, 15) + '...';
            }
        } else if (line.startsWith('Priorita:')) {
            priority = line.substring(9).trim();
        } else if (line.startsWith('Popis:')) {
            description = line.substring(6).trim();
            if (description.length > 35) {
                description = description.substring(0, 35) + '...';
            }
        }
    }

    return { title, priority, description };
};

const getPriorityLabel = (priority) => {
    switch (priority.toLowerCase()) {
        case 'high': return 'Vysoká';
        case 'low': return 'Nízká';
        default: return 'Střední';
    }
};

// Main Component
const TaskList = ({ isVisible, taskList }) => {
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isManageUsersModalOpen, setIsManageUsersModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [tasks, setTasks] = useState({
        open: [],      // state = 0
        inProgress: [], // state = 1
        completed: []   // state = 2
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [draggedTask, setDraggedTask] = useState(null);
    const [currentTaskList, setCurrentTaskList] = useState(taskList);

    // Load tasks when the component mounts or when taskList changes
    useEffect(() => {
        if (isVisible && taskList && taskList.id) {
            setCurrentTaskList(taskList);
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

    // task creation
    const handleCreateTask = () => {
        setError(null);
        setIsTaskModalOpen(true);
    };

    const handleTaskSubmit = async (taskListId, taskText) => {
        try {
            setError(null);
            const newTask = await taskService.createTask(taskListId, taskText, 0);

            if (newTask && newTask.id) {
                setTasks(prevTasks => ({
                    ...prevTasks,
                    open: [...prevTasks.open, newTask]
                }));
            } else {
                await loadTasks();
            }

            setIsTaskModalOpen(false);
        } catch (err) {
            console.error('Error creating task:', err);
            setError(err.message || 'Nepodařilo se vytvořit úkol');
        }
    };

    // task detail
    const handleViewTask = (task) => {
        setSelectedTask(task);
        setIsDetailModalOpen(true);
    };

    // drag and drop handlers
    const handleDragStart = (e, task) => {
        if (task.state === 2) {
            e.preventDefault();
            return false;
        }

        setDraggedTask(task);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', task.id);

        setTimeout(() => {
            e.target.classList.add('dragging');
        }, 0);
    };

    const handleDragEnd = (e) => {
        e.target.classList.remove('dragging');
        setDraggedTask(null);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';

        const taskCard = e.target.closest('.task-card');
        if (taskCard && draggedTask && taskCard.id !== draggedTask.id) {
            const rect = taskCard.getBoundingClientRect();
            const y = e.clientY - rect.top;

            if (y < rect.height / 2) {
                taskCard.classList.remove('drop-bottom');
                taskCard.classList.add('drop-top');
            } else {
                taskCard.classList.remove('drop-top');
                taskCard.classList.add('drop-bottom');
            }
        }
    };

    const handleDragEnter = (e) => {
        e.preventDefault();
        if (e.currentTarget.classList.contains('column')) {
            e.currentTarget.classList.add('drag-over');
        }
    };

    const handleDragLeave = (e) => {
        if (e.currentTarget.classList.contains('column') && !e.currentTarget.contains(e.relatedTarget)) {
            e.currentTarget.classList.remove('drag-over');
        }

        const taskCard = e.target.closest('.task-card');
        if (taskCard) {
            taskCard.classList.remove('drop-top', 'drop-bottom');
        }
    };

    const handleDrop = async (e, targetState) => {
        e.preventDefault();

        if (e.currentTarget.classList.contains('column')) {
            e.currentTarget.classList.remove('drag-over');
        }

        document.querySelectorAll('.drop-top, .drop-bottom').forEach(el => {
            el.classList.remove('drop-top', 'drop-bottom');
        });

        if (!draggedTask) return;

        const taskId = e.dataTransfer.getData('text/plain');
        const originalState = draggedTask.state;

        if (originalState === 2) {
            return;
        }

        const targetTaskCard = e.target.closest('.task-card');
        let insertBeforeId = null;
        let insertPosition = 'before';

        if (targetTaskCard && targetTaskCard.getAttribute('data-id') !== taskId) {
            insertBeforeId = targetTaskCard.getAttribute('data-id');
            if (targetTaskCard.classList.contains('drop-bottom')) {
                insertPosition = 'after';
            }
        }

        try {
            setError(null);

            if (originalState === targetState) {
                const updatedTasks = handleReorderTask(tasks, taskId, originalState, insertBeforeId, insertPosition);
                setTasks(updatedTasks);
                return;
            }

            const updatedTasks = handleMoveTask(tasks, taskId, originalState, targetState, insertBeforeId, insertPosition);
            setTasks(updatedTasks);

            try {
                const updatedTaskResponse = await taskService.updateTask(taskId, { state: targetState });

                if (updatedTaskResponse && updatedTaskResponse.id) {
                    const tasksWithNewId = updateTaskWithNewId(updatedTasks, targetState, taskId, updatedTaskResponse);
                    setTasks(tasksWithNewId);
                    console.log(`Úkol aktualizován, původní ID: ${taskId}, nové ID: ${updatedTaskResponse.id}`);
                }
            } catch (err) {
                handleUpdateError(err);
            }
        } catch (err) {
            handleUpdateError(err);
        }
    };

    const handleUpdateError = (err) => {
        console.error('Error updating task state:', err);
        setError(`Nepodařilo se aktualizovat stav úkolu: ${err.message || 'Neznámá chyba'}`);
        loadTasks();
    };

    // Handle managing users
    const handleManageUsers = () => {
        setIsManageUsersModalOpen(true);
    };

    const handleTaskListUpdate = (updatedTaskList) => {
        setCurrentTaskList(updatedTaskList);
    };

    // render task card for each column
    const renderTaskCard = (task) => {
        return (
            <TaskCard
                key={task.id}
                task={task}
                onViewTask={handleViewTask}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
            />
        );
    };

    return (
        <div className={`tasklist ${isVisible ? 'visible' : 'hidden'}`}>
            {currentTaskList && (
                <>
                    <div className="tasklist-header">
                        <h3 className="tasklist-title">{currentTaskList.name}</h3>
                        <div className="tasklist-actions">
                            <button
                                className="manage-users-button"
                                onClick={handleManageUsers}
                            >
                                Manage Users
                            </button>
                            <button
                                className="create-task-button"
                                onClick={handleCreateTask}
                            >
                                Vytvořit úkol
                            </button>
                        </div>
                    </div>

                    {error && <div className="error-message">{error}</div>}
                    {loading && <div className="loading-message">Načítání úkolů...</div>}
                </>
            )}

            <div className="tasklist-content">
                <TaskColumn
                    title="Otevřené"
                    tasks={tasks.open}
                    columnState={0}
                    onDragOver={handleDragOver}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    renderTaskCard={renderTaskCard}
                />

                <TaskColumn
                    title="Probíhající"
                    tasks={tasks.inProgress}
                    columnState={1}
                    onDragOver={handleDragOver}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    renderTaskCard={renderTaskCard}
                />

                <TaskColumn
                    title="Dokončené"
                    tasks={tasks.completed}
                    columnState={2}
                    onDragOver={handleDragOver}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    renderTaskCard={renderTaskCard}
                />
            </div>

            <CreateTaskModal
                isOpen={isTaskModalOpen}
                onClose={() => setIsTaskModalOpen(false)}
                onSubmit={(text) => handleTaskSubmit(currentTaskList.id, text)}
                taskListId={currentTaskList ? currentTaskList.id : null}
            />

            {selectedTask && (
                <TaskDetailModal
                    isOpen={isDetailModalOpen}
                    task={selectedTask}
                    onClose={() => setIsDetailModalOpen(false)}
                />
            )}

            <ManageUsersModal
                isOpen={isManageUsersModalOpen}
                taskList={currentTaskList}
                onClose={() => setIsManageUsersModalOpen(false)}
                onUpdate={handleTaskListUpdate}
            />
        </div>
    );
};

export default TaskList; 