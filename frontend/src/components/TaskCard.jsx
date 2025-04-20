import React from 'react';

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
    const lowerPriority = priority.toLowerCase();
    if (lowerPriority === 'high') {
        return 'Vysoká';
    } else if (lowerPriority === 'low') {
        return 'Nízká';
    } else {
        return 'Střední';
    }
};

const TaskCard = ({ task, onViewTask, onDragStart, onDragEnd, onDragOver, onDragLeave }) => {
    const { title, priority, description } = parseTaskBasicInfo(task.text);
    const isCompleted = task.state === 2;

    return (
        <div
            key={task.id}
            data-id={task.id}
            className={`task-card ${isCompleted ? 'completed-task' : ''}`}
            draggable={!isCompleted}
            onDragStart={(e) => onDragStart(e, task)}
            onDragEnd={onDragEnd}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
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
                    onClick={() => onViewTask(task)}
                    title="Zobrazit detail"
                >
                    👁️
                </button>
            </div>
        </div>
    );
};

export { TaskCard, parseTaskBasicInfo, getPriorityLabel }; 