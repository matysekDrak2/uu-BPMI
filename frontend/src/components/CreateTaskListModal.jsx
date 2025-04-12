import React from 'react';

const CreateTaskListModal = ({ isOpen, onClose, onSubmit, taskListName, setTaskListName, error }) => {
    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit();
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h3>Vytvořit nový seznam úkolů</h3>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={taskListName}
                        onChange={(e) => setTaskListName(e.target.value)}
                        placeholder="Zadejte název seznamu úkolů"
                        autoFocus
                    />
                    {error && <div className="modal-error">{error}</div>}
                    <div className="modal-buttons">
                        <button type="button" onClick={onClose}>
                            Zrušit
                        </button>
                        <button type="submit">
                            Vytvořit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateTaskListModal; 