import React, { useState } from 'react';
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

    const handleCreateTask = () => {
        setError(null);
        setIsTaskModalOpen(true);
    };

    const handleTaskSubmit = async (taskListId, taskText) => {
        try {
            setError(null);
            // Create the task with state 0 (open)
            const newTask = await taskService.createTask(taskListId, taskText, 0);

            // Add the new task to the open tasks
            setTasks({
                ...tasks,
                open: [...tasks.open, newTask]
            });

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