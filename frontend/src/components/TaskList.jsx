import React, { useState, useEffect } from 'react';
import CreateTaskModal from './CreateTaskModal';
import TaskDetailModal from './TaskDetailModal';
import ManageUsersModal from './ManageUsersModal';
import { TaskCard } from './TaskCard';
import TaskColumn from './TaskColumn';
import { taskService } from '../services/api';
import {
    handleReorderTask,
    handleMoveTask
} from './DragDropUtils';
import '../styles/TaskList.css';

// Helper functions
const parseTaskBasicInfo = (text) => {
    if (!text) return { title: 'Nepojmenovaný úkol', priority: 'normal', description: '' };

    const lines = text.split('\n');
    let title = 'Nepojmenovaný úkol';
    let priority = 'normal';
    let description = '';

    for (const line of lines) {
        if (line.startsWith('Název:')) {
            title = line.substring(6).trim();
        } else if (line.startsWith('Priorita:')) {
            priority = line.substring(9).trim();
        } else if (line.startsWith('Popis:')) {
            description = line.substring(6).trim();
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
const TaskList = ({ isVisible, taskList, onTaskListSelfRemoval }) => {
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
            return newTask;
        } catch (err) {
            console.error('Error creating task:', err);
            setError(err.message || 'Nepodařilo se vytvořit úkol');
            throw err;
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
    };

    const handleDragEnd = (e) => {
        setDraggedTask(null);
    };

    const handleDragOver = (e) => {
        // jinak se mi bude furt vracet na puvodni pozici
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';

        // nejdrive odstran vsechny existujici drop-top tridy
        document.querySelectorAll('.drop-top').forEach(el => {
            el.classList.remove('drop-top');
        });

        // logika pro zobrazeni modreho borderu nad taskem, abychom vedeli, kam se presouva task
        const taskCard = e.target.closest('.task-card'); // metoda ktera dokaze najit taskCard, ktery je v parentu tasku
        if (taskCard && draggedTask && taskCard.id !== draggedTask.id) {
            taskCard.classList.add('drop-top');
        }
    };
    // slouzi pro zvyrazneni sloupce, do ktereho se presouva task
    const handleDragEnter = (e) => {
        e.preventDefault();
        if (e.currentTarget.classList.contains('column')) {
            e.currentTarget.classList.add('drag-over');
        }
    };

    // slouzi pro zruseni zvyrazneni sloupce, ze ktereho se presouva task
    const handleDragLeave = (e) => {
        // zruseni zvyrazeni sloupce, odkud se presouva
        if (e.currentTarget.classList.contains('column') && !e.currentTarget.contains(e.relatedTarget)) {
            e.currentTarget.classList.remove('drag-over');
        }
        // zruseni zvyrazeni tasku, ktery se presouva
        const taskCard = e.target.closest('.task-card');
        if (taskCard) {
            taskCard.classList.remove('drop-top');
        }
    };

    const handleDrop = async (e, targetState) => {
        e.preventDefault();

        if (e.currentTarget.classList.contains('column')) {
            e.currentTarget.classList.remove('drag-over');
        }

        document.querySelectorAll('.drop-top').forEach(el => {
            el.classList.remove('drop-top');
        });

        if (!draggedTask) return;

        const taskId = e.dataTransfer.getData('text/plain');
        const originalState = draggedTask.state;

        if (originalState === 2) {
            return;
        }

        const targetTaskCard = e.target.closest('.task-card');
        let insertId = null;
        let insertPosition = 'before';

        if (targetTaskCard && targetTaskCard.getAttribute('data-id') !== taskId) {
            insertId = targetTaskCard.getAttribute('data-id');
        }

        try {
            setError(null);

            if (originalState === targetState) {
                // Reorder v ramci stejneho sloupce
                const updatedTasks = handleReorderTask(tasks, taskId, originalState, insertId, insertPosition);
                setTasks(updatedTasks);

                // Uloz novou pozici na server
                try {
                    await taskService.updateTask(taskId, { state: targetState });
                    console.log(`Pozice úkolu aktualizována: ${taskId}`);
                } catch (err) {
                    handleUpdateError(err);
                }
                return;
            }

            // Move mezi roznymi sloupci
            const updatedTasks = handleMoveTask(tasks, taskId, originalState, targetState, insertId, insertPosition);
            setTasks(updatedTasks);

            try {
                // Jen zmena stavu, ID zustava stejne
                await taskService.updateTask(taskId, { state: targetState });
                console.log(`Stav úkolu aktualizován: ${taskId} -> ${targetState}`);
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

    const handleTaskListUpdate = (updatedTaskList, isSelfRemoval = false) => {
        setCurrentTaskList(updatedTaskList);

        // Pokud se jedná o self-removal, předáme informaci na Dashboard
        if (isSelfRemoval && typeof onTaskListSelfRemoval === 'function') {
            onTaskListSelfRemoval(updatedTaskList.id);
        }
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
                                Správa uživatelů
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