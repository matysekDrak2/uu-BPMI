import React from 'react';

const TaskList = ({ isVisible }) => {
    return (
        <div className={`tasklist ${isVisible ? 'visible' : 'hidden'}`}>
            <div className="tasklist-content">
                <div className="column">
                    <h4>Open</h4>
                </div>
                <div className="column">
                    <h4>In progress</h4>
                </div>
                <div className="column">
                    <h4>Done</h4>
                </div>
            </div>
        </div>
    );
};

export default TaskList; 