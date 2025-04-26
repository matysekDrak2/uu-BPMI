import React, { useState, useEffect } from 'react';
import { commentService } from '../services/api';
import '../styles/TaskComments.css';

const TaskComments = ({ taskId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadComments();
    }, [taskId]);

    const loadComments = async () => {
        if (!taskId) return;

        try {
            setLoading(true);
            setError(null);
            const commentData = await commentService.getCommentsByTask(taskId);
            setComments(commentData || []);
        } catch (err) {
            console.error('Error loading comments:', err);
            setError('Nepodařilo se načíst komentáře');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitComment = async (e) => {
        e.preventDefault();

        if (!newComment.trim() || !taskId) return;

        try {
            setSubmitting(true);
            setError(null);

            console.log('Odesílám komentář pro úkol:', taskId, 'Text:', newComment.trim());

            const response = await commentService.createComment(taskId, newComment.trim());
            console.log('Komentář úspěšně vytvořen:', response);

            setNewComment('');

            // Krátká pauza pro zajištění, že server stihne zpracovat změny
            setTimeout(async () => {
                try {
                    await loadComments();
                } catch (loadError) {
                    console.error('Chyba při načítání komentářů po vytvoření:', loadError);
                    setError('Komentář byl vytvořen, ale seznam se nepodařilo aktualizovat.');
                } finally {
                    setSubmitting(false);
                }
            }, 500);
        } catch (err) {
            console.error('Error creating comment:', err);
            setError('Nepodařilo se přidat komentář: ' + err.message);
            setSubmitting(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';

        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;

        return new Intl.DateTimeFormat('cs-CZ', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    return (
        <div className="task-comments-section">
            <h4>Komentáře</h4>

            {loading ? (
                <div className="loading-message">Načítání komentářů...</div>
            ) : error ? (
                <div className="error-message">{error}</div>
            ) : (
                <>
                    <div className="comments-list">
                        {comments.length === 0 ? (
                            <p className="no-comments">Zatím žádné komentáře</p>
                        ) : (
                            comments.map(comment => (
                                <div key={comment.id} className="comment-item">
                                    <div className="comment-header">
                                        <span className="comment-author">
                                            {comment.creator || 'Uživatel'}
                                        </span>
                                        <span className="comment-date">
                                            {formatDate(comment.createdAt)}
                                        </span>
                                    </div>
                                    <div className="comment-text">
                                        {comment.text}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <form className="new-comment-form" onSubmit={handleSubmitComment}>
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Napište komentář..."
                            disabled={submitting}
                            rows={3}
                        />
                        <button
                            type="submit"
                            disabled={!newComment.trim() || submitting}
                        >
                            {submitting ? 'Odesílání...' : 'Odeslat komentář'}
                        </button>
                    </form>
                </>
            )}
        </div>
    );
};

export default TaskComments; 