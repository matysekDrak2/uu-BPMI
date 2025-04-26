import React, { useState } from 'react';
import { taskService } from '../services/api';
import TaskComments from './TaskComments';

const TaskDetailModal = ({ isOpen, task, onClose }) => {
    if (!isOpen || !task) return null;

    const [editing, setEditing] = useState(null);
    const [editValue, setEditValue] = useState('');
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);

    const parseTaskData = (text) => {
        if (!text) return {};

        const lines = text.split('\n');
        const taskData = {};

        lines.forEach(line => {
            const colonIndex = line.indexOf(':');
            if (colonIndex > 0) {
                const key = line.substring(0, colonIndex).trim();
                const value = line.substring(colonIndex + 1).trim();
                taskData[key] = value;
            }
        });

        return taskData;
    };

    const getPriorityClass = (priority) => {
        if (!priority) return 'priority-normal';
        switch (priority.toLowerCase()) {
            case 'high': return 'priority-high';
            case 'low': return 'priority-low';
            default: return 'priority-normal';
        }
    };

    const getPriorityLabel = (priority) => {
        if (!priority) return 'Střední';
        switch (priority.toLowerCase()) {
            case 'high': return 'Vysoká';
            case 'low': return 'Nízká';
            default: return 'Střední';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';

        try {
            const date = new Date(dateString);

            // Check if date is valid
            if (isNaN(date.getTime())) {
                return dateString;
            }

            const czechMonths = [
                'leden', 'únor', 'březen', 'duben', 'květen', 'červen',
                'červenec', 'srpen', 'září', 'říjen', 'listopad', 'prosinec'
            ];
            const monthName = czechMonths[date.getMonth()];

            // Format the date in Czech format with month name: day. month_name year
            return date.getDate() + '. ' + monthName + ' ' + date.getFullYear();
        } catch (error) {
            return dateString;
        }
    };

    const taskData = parseTaskData(task.text);

    const startEditing = (field, value) => {
        setEditing(field);
        setEditValue(value || '');
    };

    const cancelEditing = () => {
        setEditing(null);
        setEditValue('');
    };

    const saveEdit = async () => {
        if (!editing) return;

        setSaving(true);
        setError(null);

        try {
            let lines = task.text.split('\n');
            let updated = false;

            // We update the value in the existing line
            for (let i = 0; i < lines.length; i++) {
                if (lines[i].startsWith(`${editing}:`)) {
                    lines[i] = `${editing}: ${editValue}`;
                    updated = true;
                    break;
                }
            }

            if (!updated) {
                lines.push(`${editing}: ${editValue}`);
            }

            const updatedText = lines.join('\n');

            const updatedTask = await taskService.updateTask(task.id, { text: updatedText });

            if (updatedTask && updatedTask.id) {
                task.id = updatedTask.id;
                task.text = updatedTask.text || updatedText;
                console.log('Úkol aktualizován, nové ID:', updatedTask.id);
            } else {
                task.text = updatedText;
            }

            setEditing(null);
            setSaving(false);
        } catch (err) {
            setError(`Chyba při ukládání: ${err.message}`);
            setSaving(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal task-detail-modal">
                <h3>Detail úkolu</h3>

                <div className="task-detail-content">
                    <div className="task-detail-header">
                        {editing === 'Název' ? (
                            <div className="edit-container">
                                <input
                                    type="text"
                                    value={editValue}
                                    onChange={(e) => setEditValue(e.target.value)}
                                    className="edit-input"
                                />
                                <div className="edit-buttons">
                                    <button onClick={saveEdit} disabled={saving}>Uložit</button>
                                    <button onClick={cancelEditing}>Zrušit</button>
                                </div>
                            </div>
                        ) : (
                            <h4
                                className="task-detail-title clickable"
                                onClick={() => startEditing('Název', taskData['Název'])}
                            >
                                {taskData['Název'] || 'Untitled Task'}
                            </h4>
                        )}

                        {editing === 'Priorita' ? (
                            <div className="edit-container">
                                <select
                                    value={editValue}
                                    onChange={(e) => setEditValue(e.target.value)}
                                    className="edit-input"
                                >
                                    <option value="high">Vysoká</option>
                                    <option value="normal">Střední</option>
                                    <option value="low">Nízká</option>
                                </select>
                                <div className="edit-buttons">
                                    <button onClick={saveEdit} disabled={saving}>Uložit</button>
                                    <button onClick={cancelEditing}>Zrušit</button>
                                </div>
                            </div>
                        ) : (
                            <span
                                className={`task-priority ${getPriorityClass(taskData['Priorita'])} clickable`}
                                onClick={() => startEditing('Priorita', taskData['Priorita'] || 'normal')}
                            >
                                {getPriorityLabel(taskData['Priorita'])}
                            </span>
                        )}
                    </div>

                    <div className="task-detail-section">
                        <h5>Popis</h5>
                        {editing === 'Popis' ? (
                            <div className="edit-container">
                                <textarea
                                    value={editValue}
                                    onChange={(e) => setEditValue(e.target.value)}
                                    rows="4"
                                    className="edit-input"
                                />
                                <div className="edit-buttons">
                                    <button onClick={saveEdit} disabled={saving}>Uložit</button>
                                    <button onClick={cancelEditing}>Zrušit</button>
                                </div>
                            </div>
                        ) : (
                            <p
                                className="clickable"
                                onClick={() => startEditing('Popis', taskData['Popis'])}
                            >
                                {taskData['Popis'] || 'Klikněte pro přidání popisu'}
                            </p>
                        )}
                    </div>

                    <div className="task-detail-info">
                        <div className="task-detail-item">
                            <span className="task-detail-label">
                                <span className="deadline-icon">📅</span> Termín:
                            </span>
                            {editing === 'Termín' ? (
                                <div className="edit-container">
                                    <input
                                        type="date"
                                        value={editValue}
                                        onChange={(e) => setEditValue(e.target.value)}
                                        className="edit-input"
                                    />
                                    <div className="edit-buttons">
                                        <button onClick={saveEdit} disabled={saving}>Uložit</button>
                                        <button onClick={cancelEditing}>Zrušit</button>
                                    </div>
                                </div>
                            ) : (
                                <span
                                    className="task-detail-value deadline-value clickable"
                                    onClick={() => startEditing('Termín', taskData['Termín'])}
                                >
                                    {formatDate(taskData['Termín']) || 'Klikněte pro přidání termínu'}
                                </span>
                            )}
                        </div>

                        <div className="task-detail-item">
                            <span className="task-detail-label">
                                <span className="attachment-icon">📎</span> Příloha:
                            </span>
                            {editing === 'Příloha' ? (
                                <div className="edit-container">
                                    <input
                                        type="text"
                                        value={editValue}
                                        onChange={(e) => setEditValue(e.target.value)}
                                        className="edit-input"
                                    />
                                    <div className="edit-buttons">
                                        <button onClick={saveEdit} disabled={saving}>Uložit</button>
                                        <button onClick={cancelEditing}>Zrušit</button>
                                    </div>
                                </div>
                            ) : (
                                <span
                                    className="task-detail-value attachment-value clickable"
                                    onClick={() => startEditing('Příloha', taskData['Příloha'])}
                                >
                                    {taskData['Příloha'] || 'Klikněte pro přidání přílohy'}
                                </span>
                            )}
                        </div>
                    </div>

                    {error && <div className="modal-error">{error}</div>}
                    {saving && <div className="loading-message">Ukládám změny...</div>}
                </div>

                <div className="modal-buttons">
                    <button type="button" onClick={onClose}>
                        Zavřít
                    </button>
                </div>

                {task && task.id && (
                    <TaskComments taskId={task.id} />
                )}
            </div>
        </div>
    );
};

export default TaskDetailModal; 