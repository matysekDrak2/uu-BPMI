import React from 'react';

const TaskListDropdown = ({
    taskLists,
    activeTaskList,
    onTaskListSelect,
    isOpen,
    onToggle
}) => {
    const activeListName = taskLists.find(list => list.id === activeTaskList)?.name || 'Select Task List';

    return (
        <div className="dropdown-container">
            <button
                className="dropdown-button"
                onClick={onToggle}
            >
                {activeListName}
                <span className="dropdown-arrow">▼</span>
            </button>
            {isOpen && (
                <div className="dropdown-menu">
                    {taskLists.map(list => (
                        <button
                            key={list.id}
                            className={`dropdown-item ${activeTaskList === list.id ? 'active' : ''}`}
                            onClick={() => onTaskListSelect(list.id)}
                        >
                            {list.name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TaskListDropdown; 