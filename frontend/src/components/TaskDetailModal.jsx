import React from 'react';

const TaskDetailModal = ({ isOpen, task, onClose }) => {
    if (!isOpen || !task) return null;

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

            // Get Czech month name
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

    return (
        <div className="modal-overlay">
            <div className="modal task-detail-modal">
                <h3>Detail úkolu</h3>

                <div className="task-detail-content">
                    <div className="task-detail-header">
                        <h4 className="task-detail-title">{taskData['Název'] || 'Untitled Task'}</h4>
                        {taskData['Priorita'] && (
                            <span className={`task-priority ${getPriorityClass(taskData['Priorita'])}`}>
                                {getPriorityLabel(taskData['Priorita'])}
                            </span>
                        )}
                    </div>

                    {taskData['Popis'] && (
                        <div className="task-detail-section">
                            <h5>Popis</h5>
                            <p>{taskData['Popis']}</p>
                        </div>
                    )}

                    <div className="task-detail-info">
                        {taskData['Termín'] && (
                            <div className="task-detail-item">
                                <span className="task-detail-label">
                                    <span className="deadline-icon">📅</span> Termín:
                                </span>
                                <span className="task-detail-value deadline-value">
                                    {formatDate(taskData['Termín'])}
                                </span>
                            </div>
                        )}

                        {taskData['Příloha'] && (
                            <div className="task-detail-item">
                                <span className="task-detail-label">
                                    <span className="attachment-icon">📎</span> Příloha:
                                </span>
                                <span className="task-detail-value">
                                    {taskData['Příloha']}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="modal-buttons">
                    <button type="button" onClick={onClose}>
                        Zavřít
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TaskDetailModal; 