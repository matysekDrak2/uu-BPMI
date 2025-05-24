import React, { useState, useEffect } from 'react';
import { taskListService, userService, authService } from '../services/api';
import '../styles/ManageUsersModal.css';

const ManageUsersModal = ({ isOpen, onClose, taskList, onUpdate }) => {
    const [userEmail, setUserEmail] = useState('');
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [currentUserId, setCurrentUserId] = useState(null);

    useEffect(() => {
        if (isOpen && taskList) {
            loadUsers();
            loadCurrentUser();
        }
    }, [isOpen, taskList]);

    const loadCurrentUser = async () => {
        try {
            const userData = await authService.getUserData();
            setCurrentUserId(userData.userId);
        } catch (err) {
            console.error('Error loading current user:', err);
        }
    };

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
                            return { id: userId, name: 'Neznámý uživatel', email: 'neznámý' };
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
            setError('Nepodařilo se načíst uživatele');
            console.error('Error loading users:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddUser = async () => {
        if (!userEmail) {
            setError('Zadejte prosím e-mail uživatele');
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
                    setError(`Uživatel s e-mailem ${userEmail} nebyl nalezen`);
                } else {
                    setError(`Chyba při hledání uživatele: ${err.message}`);
                }
                setLoading(false);
                return;
            }

            if (!foundUser || !foundUser.id) {
                setError(`Uživatel s e-mailem ${userEmail} nebyl nalezen`);
                setLoading(false);
                return;
            }

            const newData = {
                ...taskList,
                members: [...(taskList.members || [])],
                admins: [...(taskList.admins || [])]
            };

            if (newData.members.includes(foundUser.id)) {
                setError(`Uživatel ${foundUser.name || userEmail} je již členem`);
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
            console.error('Error adding user:', err);

            // Kontrola, jestli se jedná o chybu autorizace
            if (err.message && (
                err.message.includes('Neoprávněný přístup') ||
                err.message.includes('Unauthorized') ||
                err.message.includes('403') ||
                err.message.includes('Musíte být vlastník') ||
                err.message.includes('administrátor')
            )) {
                setError('Nemáte oprávnění přidávat uživatele do tohoto seznamu úkolů');
            } else {
                setError(`Nepodařilo se přidat uživatele: ${err.message || 'Neznámá chyba'}`);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveUser = async (userId) => {
        if (userId === taskList.owner) {
            setError('Nelze odstranit vlastníka seznamu úkolů');
            return;
        }

        const isSelfRemoval = userId === currentUserId;

        setLoading(true);
        setError(null);

        try {
            const newData = {
                ...taskList,
                members: [...(taskList.members || [])],
                admins: [...(taskList.admins || [])]
            };

            newData.members = newData.members.filter(id => id !== userId);
            newData.admins = newData.admins.filter(id => id !== userId);

            const updatedTaskList = await taskListService.updateTaskList(taskList.id, {
                members: newData.members || [],
                admins: newData.admins || []
            });

            if (updatedTaskList) {
                if (isSelfRemoval) {
                    // Pokud se odhlašujeme sami, zavřeme modál a předáme info na Dashboard
                    onClose();
                    onUpdate(updatedTaskList, true); // true = isSelfRemoval
                } else {
                    // Běžné odebrání jiného uživatele
                    onUpdate(updatedTaskList);
                    loadUsers();
                }
            }
        } catch (err) {
            setError(`Nepodařilo se odstranit uživatele: ${err.message}`);
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
                    <h3 title={taskList?.name}>Správa uživatelů - {taskList?.name}</h3>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>

                <div className="modal-body">
                    {error && <div className="error-message">{error}</div>}

                    <div className="add-user-form">
                        <h4>Přidat uživatele</h4>
                        <div className="form-row">
                            <input
                                type="email"
                                placeholder="E-mail uživatele"
                                value={userEmail}
                                onChange={(e) => setUserEmail(e.target.value)}
                            />
                            <button
                                onClick={handleAddUser}
                                disabled={loading}
                                className="add-button"
                            >
                                Přidat
                            </button>
                        </div>
                    </div>

                    <div className="users-list">
                        <h4>Uživatelé</h4>
                        {loading && users.length === 0 ? (
                            <p>Načítání...</p>
                        ) : users.length === 0 ? (
                            <p>Žádní uživatelé</p>
                        ) : (
                            <ul>
                                {users.map(user => (
                                    <li key={user.id}>
                                        <span>
                                            {user.name} ({user.email})
                                            {taskList.owner === user.id ? (
                                                <span className="user-tag owner-tag">Vlastník</span>
                                            ) : (
                                                <span className="user-tag member-tag">Člen</span>
                                            )}
                                        </span>
                                        {taskList.owner !== user.id && (
                                            <button
                                                onClick={() => handleRemoveUser(user.id)}
                                                disabled={loading}
                                                className="remove-button"
                                            >
                                                Odstranit
                                            </button>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                <div className="modal-footer">
                    <button onClick={onClose}>Zavřít</button>
                </div>
            </div>
        </div>
    );
};

export default ManageUsersModal; 