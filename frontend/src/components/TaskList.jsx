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
    const [draggedTask, setDraggedTask] = useState(null);

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

    // Drag handlers
    const handleDragStart = (e, task) => {
        // Pokud je úkol dokončený (state = 2), zabráníme přetahování
        if (task.state === 2) {
            e.preventDefault();
            return false;
        }

        setDraggedTask(task);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', task.id);

        // Add dragging class to enhance visual feedback
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

        // Přidání indikátoru místa vložení při přetahování nad jiným úkolem
        const taskCard = e.target.closest('.task-card');
        if (taskCard && draggedTask && taskCard.id !== draggedTask.id) {
            const rect = taskCard.getBoundingClientRect();
            const y = e.clientY - rect.top;

            // Určení, zda je kurzor v horní nebo dolní polovině karty
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
        // Add highlight class to the column
        if (e.currentTarget.classList.contains('column')) {
            e.currentTarget.classList.add('drag-over');
        }
    };

    const handleDragLeave = (e) => {
        // Only remove highlight if we're leaving the column, not just moving between child elements
        if (e.currentTarget.classList.contains('column') && !e.currentTarget.contains(e.relatedTarget)) {
            e.currentTarget.classList.remove('drag-over');
        }

        // Odstranění indikátoru při opuštění úkolu
        const taskCard = e.target.closest('.task-card');
        if (taskCard) {
            taskCard.classList.remove('drop-top', 'drop-bottom');
        }
    };

    const handleDrop = async (e, targetState) => {
        e.preventDefault();

        // Remove highlight class
        if (e.currentTarget.classList.contains('column')) {
            e.currentTarget.classList.remove('drag-over');
        }

        // Odstranění všech indikátorů drop míst
        document.querySelectorAll('.drop-top, .drop-bottom').forEach(el => {
            el.classList.remove('drop-top', 'drop-bottom');
        });

        if (!draggedTask) return;

        const taskId = e.dataTransfer.getData('text/plain');
        const originalState = draggedTask.state;

        // Pokud je úkol už dokončený (state = 2), zabráníme jakékoliv manipulaci
        if (originalState === 2) {
            return;
        }

        // Určení cílového úkolu (pokud přetahujeme v rámci sloupce)
        const targetTaskCard = e.target.closest('.task-card');
        let insertBeforeId = null;
        let insertPosition = 'before';

        if (targetTaskCard && targetTaskCard.getAttribute('data-id') !== taskId) {
            insertBeforeId = targetTaskCard.getAttribute('data-id');

            // Určení, zda vkládáme před nebo za cílový úkol
            if (targetTaskCard.classList.contains('drop-bottom')) {
                insertPosition = 'after';
            }
        }

        try {
            setError(null);

            // Pokud je cílový stav stejný jako původní, pouze změníme pořadí
            if (originalState === targetState) {
                // Vytvoříme kopii aktuálního seznamu úkolů
                const updatedTasks = { ...tasks };

                // Určení pole podle stavu
                let arrayKey;
                if (targetState === 0) arrayKey = 'open';
                else if (targetState === 1) arrayKey = 'inProgress';
                else if (targetState === 2) arrayKey = 'completed';

                // Najdeme index původního úkolu
                const sourceIndex = updatedTasks[arrayKey].findIndex(t => t.id === taskId);
                if (sourceIndex === -1) return;

                // Vyjmeme úkol z jeho aktuální pozice
                const taskToMove = updatedTasks[arrayKey][sourceIndex];
                updatedTasks[arrayKey].splice(sourceIndex, 1);

                // Pokud máme cílový úkol, určíme novou pozici
                if (insertBeforeId) {
                    const targetIndex = updatedTasks[arrayKey].findIndex(t => t.id === insertBeforeId);
                    if (targetIndex !== -1) {
                        // Vložíme úkol na správnou pozici (před nebo za cílový úkol)
                        const insertIndex = insertPosition === 'after' ? targetIndex + 1 : targetIndex;
                        updatedTasks[arrayKey].splice(insertIndex, 0, taskToMove);
                    } else {
                        // Pokud nenajdeme cílový úkol, přidáme na konec
                        updatedTasks[arrayKey].push(taskToMove);
                    }
                } else {
                    // Pokud není cílový úkol, přidáme na konec
                    updatedTasks[arrayKey].push(taskToMove);
                }

                // Aktualizujeme stav
                setTasks(updatedTasks);

                // Zde by se v budoucnu mohla přidat API volání pro uložení pořadí na serveru
                // await taskService.updateTaskOrder(arrayKey, updatedTasks[arrayKey].map(t => t.id));

                return;
            }

            // Jinak pokračujeme s původní logikou změny stavu
            // Optimistically update UI
            const updatedTasks = { ...tasks };

            // Find and remove the task from its original state array
            let sourceArray;
            if (originalState === 0) sourceArray = 'open';
            else if (originalState === 1) sourceArray = 'inProgress';
            else if (originalState === 2) sourceArray = 'completed';

            // Find and remove the task from the source array
            const taskIndex = updatedTasks[sourceArray].findIndex(t => t.id === taskId);
            if (taskIndex === -1) return;

            const taskToMove = { ...updatedTasks[sourceArray][taskIndex] };
            updatedTasks[sourceArray] = updatedTasks[sourceArray].filter(t => t.id !== taskId);

            // Update the task state
            taskToMove.state = targetState;

            // Add to target array
            let targetArray;
            if (targetState === 0) targetArray = 'open';
            else if (targetState === 1) targetArray = 'inProgress';
            else if (targetState === 2) targetArray = 'completed';

            // Pokud máme cílový úkol, určíme pozici v cílovém poli
            if (insertBeforeId) {
                const targetIndex = updatedTasks[targetArray].findIndex(t => t.id === insertBeforeId);
                if (targetIndex !== -1) {
                    const insertIndex = insertPosition === 'after' ? targetIndex + 1 : targetIndex;
                    updatedTasks[targetArray].splice(insertIndex, 0, taskToMove);
                } else {
                    updatedTasks[targetArray].push(taskToMove);
                }
            } else {
                updatedTasks[targetArray].push(taskToMove);
            }

            // Update state
            setTasks(updatedTasks);

            // Update in backend
            try {
                // Uložíme aktualizovaný úkol a získáme nové ID (backend při aktualizaci vytvořil nový úkol)
                const updatedTaskResponse = await taskService.updateTask(taskId, { state: targetState });

                // Backend vrací celý aktualizovaný úkol včetně nového ID
                if (updatedTaskResponse && updatedTaskResponse.id) {
                    // Musíme aktualizovat ID v našem lokálním stavu, protože backend vytvořil nový úkol
                    const newTaskId = updatedTaskResponse.id;

                    // Vytvoříme novou kopii stavu s aktualizovaným ID
                    const tasksWithNewId = { ...updatedTasks };

                    // Najdeme úkol v cílovém poli a aktualizujeme jeho ID
                    const taskToUpdateIndex = tasksWithNewId[targetArray].findIndex(t => t.id === taskId);
                    if (taskToUpdateIndex !== -1) {
                        // Aktualizujeme ID a další vlastnosti z odpovědi
                        tasksWithNewId[targetArray][taskToUpdateIndex] = {
                            ...tasksWithNewId[targetArray][taskToUpdateIndex],
                            id: newTaskId,
                            ...updatedTaskResponse
                        };
                    }

                    // Aktualizujeme stav s novým ID
                    setTasks(tasksWithNewId);
                    console.log(`Úkol aktualizován, původní ID: ${taskId}, nové ID: ${updatedTaskResponse.id}`);
                }
            } catch (err) {
                console.error('Error updating task state:', err);
                setError(`Nepodařilo se aktualizovat stav úkolu: ${err.message || 'Neznámá chyba'}`);
                // Revert to original state in case of error
                loadTasks();
            }
        } catch (err) {
            console.error('Error updating task state:', err);
            setError(`Nepodařilo se aktualizovat stav úkolu: ${err.message || 'Neznámá chyba'}`);
            // Revert to original state in case of error
            loadTasks();
        }
    };

    const renderTaskCard = (task) => {
        const { title, priority, description } = parseTaskBasicInfo(task.text);
        const isCompleted = task.state === 2;

        return (
            <div
                key={task.id}
                data-id={task.id}
                className={`task-card ${isCompleted ? 'completed-task' : ''}`}
                draggable={!isCompleted} // Dokončené úkoly nelze přetahovat
                onDragStart={(e) => handleDragStart(e, task)}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
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
                <div
                    className="column"
                    onDragOver={handleDragOver}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, 0)}
                >
                    <h4>Otevřené</h4>
                    <div className="tasks-container">
                        {tasks.open.map(task => renderTaskCard(task))}
                    </div>
                </div>
                <div
                    className="column"
                    onDragOver={handleDragOver}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, 1)}
                >
                    <h4>Probíhající</h4>
                    <div className="tasks-container">
                        {tasks.inProgress.map(task => renderTaskCard(task))}
                    </div>
                </div>
                <div
                    className="column"
                    onDragOver={handleDragOver}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, 2)}
                >
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