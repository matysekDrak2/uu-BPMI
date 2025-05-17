import React, { useState, useEffect } from 'react';
import { commentService, attachmentService } from '../services/api';

const CreateTaskModal = ({ isOpen, onClose, onSubmit, taskListId }) => {
    const [taskData, setTaskData] = useState({
        title: '',
        description: '',
        priority: 'normal',
        deadline: '',
    });
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [error, setError] = useState(null);
    const [uploading, setUploading] = useState(false);
    const MAX_FILES = 5;

    useEffect(() => {
        if (isOpen) {
            resetForm();
        }
    }, [isOpen]);

    const resetForm = () => {
        setTaskData({
            title: '',
            description: '',
            priority: 'normal',
            deadline: '',
        });
        setSelectedFiles([]);
        setError(null);
    };

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTaskData({
            ...taskData,
            [name]: value
        });
    };

    const handleFileChange = (e) => {
        const fileList = Array.from(e.target.files);
        if (fileList.length + selectedFiles.length > MAX_FILES) {
            setError(`Můžete nahrát maximálně ${MAX_FILES} souborů.`);
            return;
        }

        setSelectedFiles(prev => [...prev, ...fileList]);
        setError(null);

        e.target.value = null;
    };

    const removeFile = (index) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!taskData.title.trim()) {
            setError('Název úkolu je povinný');
            return;
        }

        const taskText = `Název: ${taskData.title}\n` +
            `Popis: ${taskData.description}\n` +
            `Priorita: ${taskData.priority}\n` +
            (taskData.deadline ? `Termín: ${taskData.deadline}\n` : '');

        try {
            const createdTask = await onSubmit(taskText);

            if (createdTask && createdTask.id && selectedFiles.length > 0) {
                setUploading(true);

                for (const file of selectedFiles) {
                    const comment = await commentService.createComment(
                        createdTask.id,
                        `Příloha: ${file.name}`
                    );

                    if (comment && comment.id) {
                        // Upload the file to the comment
                        await attachmentService.uploadFileToComment(file, comment.id);
                    }
                }

                setUploading(false);
            }

            // Reset form and close the modal
            resetForm();
            onClose();
        } catch (err) {
            console.error('Error creating task or uploading attachment:', err);
            setError(err.message || 'Nepodařilo se vytvořit úkol nebo nahrát přílohu');
            setUploading(false);
        }
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
                        <label htmlFor="attachments">
                            Připojit soubory
                        </label>
                        <div className="file-input-container">
                            <button
                                type="button"
                                className="choose-files-btn"
                                onClick={() => document.getElementById("attachments").click()}
                                disabled={selectedFiles.length >= MAX_FILES || uploading}
                            >
                                Vybrat soubory
                            </button>
                            <span className="file-count">
                                {selectedFiles.length > 0 ? `${selectedFiles.length} souborů vybráno` : 'Žádné soubory'}
                            </span>
                            <input
                                type="file"
                                id="attachments"
                                name="attachments"
                                onChange={handleFileChange}
                                multiple
                                disabled={selectedFiles.length >= MAX_FILES || uploading}
                                style={{ display: 'none' }}
                            />
                        </div>

                        {selectedFiles.length > 0 && (
                            <div className="selected-files">
                                <ul>
                                    {selectedFiles.map((file, index) => (
                                        <li key={index} className="selected-file-item">
                                            <span className="file-name">{file.name}</span>
                                            <button
                                                type="button"
                                                className="remove-file-btn"
                                                onClick={() => removeFile(index)}
                                                disabled={uploading}
                                            >
                                                ×
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {error && <div className="modal-error">{error}</div>}
                    {uploading && <div className="uploading-message">Nahrávám přílohy... ({selectedFiles.length})</div>}

                    <div className="modal-buttons">
                        <button type="button" onClick={onClose} disabled={uploading}>
                            Zrušit
                        </button>
                        <button type="submit" disabled={uploading}>
                            {uploading ? 'Nahrávám...' : 'Potvrdit'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateTaskModal; 