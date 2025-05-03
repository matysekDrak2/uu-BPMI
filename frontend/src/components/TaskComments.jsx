import React, { useState, useEffect } from 'react';
import { commentService, userService, attachmentService } from '../services/api';
import '../styles/TaskComments.css';

const TaskComments = ({ taskId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [userNames, setUserNames] = useState({});

    useEffect(() => {
        loadComments();
    }, [taskId]);

    // Also reload comments when reload-trigger class is added
    useEffect(() => {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.target.classList.contains('reload-trigger')) {
                    loadComments();
                }
            });
        });

        const commentsSection = document.querySelector('.task-comments-section');
        if (commentsSection) {
            observer.observe(commentsSection, {
                attributes: true,
                attributeFilter: ['class']
            });
        }

        return () => observer.disconnect();
    }, []);

    const loadComments = async () => {
        if (!taskId) return;

        try {
            setLoading(true);
            setError(null);
            const commentData = await commentService.getCommentsByTask(taskId);
            setComments(commentData || []);

            const uniqueCreatorIds = [...new Set(commentData.map(comment => comment.creator))];
            const namesPromises = uniqueCreatorIds.map(async (creatorId) => {
                if (!creatorId) return null;
                try {
                    const user = await userService.getUserById(creatorId);
                    return { id: creatorId, name: user.name };
                } catch (err) {
                    console.error(`Error loading user ${creatorId}:`, err);
                    return { id: creatorId, name: 'Neznámý uživatel' };
                }
            });

            const userResults = await Promise.all(namesPromises);
            const namesMap = {};
            userResults.forEach(result => {
                if (result) {
                    namesMap[result.id] = result.name;
                }
            });

            setUserNames(namesMap);
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

            await commentService.createComment(taskId, newComment.trim());
            setNewComment('');
            await loadComments();
        } catch (err) {
            console.error('Error creating comment:', err);
            setError('Nepodařilo se přidat komentář');
        } finally {
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

    const getUserName = (creatorId) => {
        return userNames[creatorId] || 'Uživatel';
    };

    const handleDownloadAttachment = async (fileName, displayName) => {
        try {
            const blob = await attachmentService.downloadFile(fileName);

            // Create a download link and click it
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;

            // Použijeme zobrazované jméno souboru místo ID
            a.download = displayName || fileName.split('/').pop();

            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Error downloading attachment:', err);
            setError('Nepodařilo se stáhnout přílohu');
        }
    };

    const renderComment = (comment) => {
        const isAttachmentComment =
            comment.text.startsWith('Příloha:') &&
            comment.attachments &&
            comment.attachments.length > 0;

        if (isAttachmentComment) {
            const filenameMatch = comment.text.match(/Příloha: (.*)/);
            const displayFilename = filenameMatch ? filenameMatch[1] : 'Soubor';
            const attachment = comment.attachments[0];

            return (
                <div key={comment.id} className="comment-item attachment-comment">
                    <div className="comment-header">
                        <span className="comment-author">
                            {getUserName(comment.creator)}
                        </span>
                        <span className="comment-date">
                            {formatDate(comment.createdAt)}
                        </span>
                    </div>
                    <div className="comment-text attachment-link-container">
                        <span>Příloha: </span>
                        <a
                            href="#"
                            className="attachment-link"
                            onClick={(e) => {
                                e.preventDefault();
                                handleDownloadAttachment(attachment, displayFilename);
                            }}
                        >
                            {displayFilename}
                        </a>
                    </div>
                </div>
            );
        } else {
            // Regular comment
            return (
                <div key={comment.id} className="comment-item">
                    <div className="comment-header">
                        <span className="comment-author">
                            {getUserName(comment.creator)}
                        </span>
                        <span className="comment-date">
                            {formatDate(comment.createdAt)}
                        </span>
                    </div>
                    <div className="comment-text">
                        {comment.text}
                    </div>

                    {/* Regular comment attachments if any */}
                    {comment.attachments && comment.attachments.length > 0 && (
                        <div className="comment-attachments">
                            <h5>Přílohy:</h5>
                            <ul className="attachments-list">
                                {comment.attachments.map((attachment, index) => {
                                    // Pro běžné přílohy extrahujeme jméno z textu komentáře
                                    const filenameMatch = comment.text.match(/Příloha: (.*)/);
                                    const displayName = filenameMatch ? filenameMatch[1] : attachment.split('/').pop();

                                    return (
                                        <li key={index} className="attachment-item">
                                            <a
                                                href="#"
                                                className="attachment-link"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleDownloadAttachment(attachment, displayName);
                                                }}
                                            >
                                                {displayName}
                                            </a>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    )}
                </div>
            );
        }
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
                            comments.map(renderComment)
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