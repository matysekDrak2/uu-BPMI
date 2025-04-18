import React, { useState } from 'react';

const CreateTaskModal = ({ isOpen, onClose, onSubmit, taskListId }) => {
    const [taskData, setTaskData] = useState({
        title: '',
        description: '',
        priority: 'normal',
        deadline: '',
        attachments: null
    });
    const [error, setError] = useState(null);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTaskData({
            ...taskData,
            [name]: value
        });
    };

    const handleFileChange = (e) => {
        setTaskData({
            ...taskData,
            attachments: e.target.files[0]
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!taskData.title.trim()) {
            setError('Název úkolu je povinný');
            return;
        }

        // Create task text from form data
        const taskText = `Název: ${taskData.title}\n` +
            `Popis: ${taskData.description}\n` +
            `Priorita: ${taskData.priority}\n` +
            (taskData.deadline ? `Termín: ${taskData.deadline}\n` : '') +
            (taskData.attachments ? `Příloha: ${taskData.attachments.name}` : '');

        onSubmit(taskListId, taskText);
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h3>Vytvořit nový úkol</h3>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="title">Název úkolu</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={taskData.title}
                            onChange={handleChange}
                            placeholder="Zadejte název úkolu"
                            maxLength={100}
                            autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Popis úkolu</label>
                        <textarea
                            id="description"
                            name="description"
                            value={taskData.description}
                            onChange={handleChange}
                            placeholder="Zadejte popis úkolu"
                            rows={3}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="priority">Priorita úkolu</label>
                        <select
                            id="priority"
                            name="priority"
                            value={taskData.priority}
                            onChange={handleChange}
                        >
                            <option value="low">Nízká</option>
                            <option value="normal">Střední</option>
                            <option value="high">Vysoká</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="deadline">Termín úkolu</label>
                        <input
                            type="date"
                            id="deadline"
                            name="deadline"
                            value={taskData.deadline}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="attachments">Připojit soubor</label>
                        <input
                            type="file"
                            id="attachments"
                            name="attachments"
                            onChange={handleFileChange}
                        />
                    </div>

                    {error && <div className="modal-error">{error}</div>}

                    <div className="modal-buttons">
                        <button type="button" onClick={onClose}>
                            Zrušit
                        </button>
                        <button type="submit">
                            Potvrdit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateTaskModal; 