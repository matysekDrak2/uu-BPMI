import React from 'react';

const CreateTaskListModal = ({ isOpen, onClose, onSubmit, taskListName, setTaskListName, error }) => {
    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit();
    };

    const handleInputChange = (e) => {
        // Omezení na max 50 znaků
        if (e.target.value.length <= 50) {
            setTaskListName(e.target.value);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h3>Vytvořit nový seznam úkolů</h3>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={taskListName}
                        onChange={handleInputChange}
                        placeholder="Zadejte název seznamu úkolů"
                        maxLength={50}
                        autoFocus
                    />
                    <div className="character-count">
                        {taskListName.length}/50 znaků
                    </div>
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