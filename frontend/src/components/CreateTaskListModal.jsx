import React from 'react';

const CreateTaskListModal = ({ isOpen, onClose, onSubmit, taskListName, setTaskListName }) => {
    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit();
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h3>Create New Task List</h3>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={taskListName}
                        onChange={(e) => setTaskListName(e.target.value)}
                        placeholder="Enter task list name"
                        autoFocus
                    />
                    <div className="modal-buttons">
                        <button type="button" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit">
                            Create
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateTaskListModal; 