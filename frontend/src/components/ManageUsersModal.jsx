import React, { useState, useEffect } from 'react';
import { taskListService, userService } from '../services/api';
import '../styles/ManageUsersModal.css';

const ManageUsersModal = ({ isOpen, onClose, taskList, onUpdate }) => {
    const [userEmail, setUserEmail] = useState('');
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && taskList) {
            loadUsers();
        }
    }, [isOpen, taskList]);

    const loadUsers = async () => {
        setLoading(true);
        setError(null);

        try {
            const allUserIds = [...(taskList.members || []), ...(taskList.admins || [])];

            // Add owner to the list if not already included
            if (taskList.owner && !allUserIds.includes(taskList.owner)) {
                allUserIds.push(taskList.owner);
            }

            if (allUserIds.length > 0) {
                const userDetails = await Promise.all(
                    allUserIds.map(async userId => {
                        try {
                            return await userService.getUserById(userId);
                        } catch (err) {
                            console.error(`Error fetching user ${userId}:`, err);
                            return { id: userId, name: 'Unknown User', email: 'unknown' };
                        }
                    })
                );

                const sortedUsers = userDetails.sort((a, b) => {
                    if (a.id === taskList.owner) return -1;
                    if (b.id === taskList.owner) return 1;
                    return 0;
                });

                setUsers(sortedUsers);
            } else {
                setUsers([]);
            }
        } catch (err) {
            setError('Failed to load users');
            console.error('Error loading users:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddUser = async () => {
        if (!userEmail) {
            setError('Please enter a user email');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            let foundUser;
            try {
                foundUser = await userService.getUserByEmail(userEmail);
            } catch (err) {
                if (err.message.includes('not found')) {
                    setError(`User with email ${userEmail} not found`);
                } else {
                    setError(`Error finding user: ${err.message}`);
                }
                setLoading(false);
                return;
            }

            if (!foundUser || !foundUser.id) {
                setError(`User with email ${userEmail} not found`);
                setLoading(false);
                return;
            }

            const newData = { ...taskList };
            if (!newData.members) newData.members = [];

            if (newData.members.includes(foundUser.id)) {
                setError(`User ${foundUser.name || userEmail} is already a member`);
                setLoading(false);
                return;
            }

            newData.members.push(foundUser.id);

            const updatedTaskList = await taskListService.updateTaskList(taskList.id, {
                members: newData.members
            });

            if (updatedTaskList) {
                setUserEmail('');
                onUpdate(updatedTaskList);
                loadUsers();
                setError(null);
            }
        } catch (err) {
            setError(`Failed to add user: ${err.message}`);
            console.error('Error adding user:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveUser = async (userId) => {
        if (userId === taskList.owner) {
            setError('Cannot remove the owner of the task list');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const newData = { ...taskList };

            if (newData.members) {
                newData.members = newData.members.filter(id => id !== userId);
            }

            if (newData.admins) {
                newData.admins = newData.admins.filter(id => id !== userId);
            }

            const updatedTaskList = await taskListService.updateTaskList(taskList.id, {
                members: newData.members || [],
                admins: newData.admins || []
            });

            if (updatedTaskList) {
                onUpdate(updatedTaskList);
                loadUsers();
            }
        } catch (err) {
            setError(`Failed to remove user: ${err.message}`);
            console.error('Error removing user:', err);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-backdrop">
            <div className="modal-content manage-users-modal">
                <div className="modal-header">
                    <h3>Manage Users - {taskList?.name}</h3>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>

                <div className="modal-body">
                    {error && <div className="error-message">{error}</div>}

                    <div className="add-user-form">
                        <h4>Add User</h4>
                        <div className="form-row">
                            <input
                                type="email"
                                placeholder="User email"
                                value={userEmail}
                                onChange={(e) => setUserEmail(e.target.value)}
                            />
                            <button
                                onClick={handleAddUser}
                                disabled={loading}
                                className="add-button"
                            >
                                Add
                            </button>
                        </div>
                    </div>

                    <div className="users-list">
                        <h4>Users</h4>
                        {loading && users.length === 0 ? (
                            <p>Loading...</p>
                        ) : users.length === 0 ? (
                            <p>No users</p>
                        ) : (
                            <ul>
                                {users.map(user => (
                                    <li key={user.id}>
                                        <span>
                                            {user.name} ({user.email})
                                            {taskList.owner === user.id ? (
                                                <span className="user-tag owner-tag">Owner</span>
                                            ) : (
                                                <span className="user-tag member-tag">Member</span>
                                            )}
                                        </span>
                                        {taskList.owner !== user.id && (
                                            <button
                                                onClick={() => handleRemoveUser(user.id)}
                                                disabled={loading}
                                                className="remove-button"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                <div className="modal-footer">
                    <button onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default ManageUsersModal; 