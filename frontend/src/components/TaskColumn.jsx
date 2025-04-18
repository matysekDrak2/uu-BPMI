import React from 'react';

const TaskColumn = ({ title, tasks, columnState, onDragOver, onDragEnter, onDragLeave, onDrop, renderTaskCard }) => {
    return (
        <div
            className="column"
            onDragOver={onDragOver}
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
            onDrop={(e) => onDrop(e, columnState)}
        >
            <h4>{title}</h4>
            <div className="tasks-container">
                {tasks.map(task => renderTaskCard(task))}
            </div>
        </div>
    );
};

export default TaskColumn; 