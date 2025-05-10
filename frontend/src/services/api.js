import { API_BASE_URL, SESSION_EXPIRATION_DAYS } from '../config';

const sessionManager = {
    setSession: function (sessionId) {
        const expirationDate = new Date();
        //expirationDate.setSeconds(expirationDate.getSeconds() + SESSION_EXPIRATION_DAYS);
        // we will use this in production
        expirationDate.setDate(expirationDate.getDate() + SESSION_EXPIRATION_DAYS);

        const sessionData = {
            sessionId: sessionId,
            expiresAt: expirationDate.toISOString()
        };

        localStorage.setItem('sessionData', JSON.stringify(sessionData));
    },

    getSessionId: function () {
        const sessionDataStr = localStorage.getItem('sessionData');
        if (!sessionDataStr) return null;

        try {
            const sessionData = JSON.parse(sessionDataStr);
            const expiresAt = new Date(sessionData.expiresAt);
            const now = new Date();

            if (now > expiresAt) {
                this.clearSession();
                return null;
            }

            return sessionData.sessionId;
        } catch (e) {
            this.clearSession();
            return null;
        }
    },

    clearSession: function () {
        localStorage.removeItem('sessionData');
    }
};

async function handleResponse(response, defaultErrorMessage = 'Požadavek selhal') {
    if (!response.ok) {
        const responseText = await response.text();
        let errorMessage = defaultErrorMessage;

        try {
            if (responseText && (responseText.startsWith('{') || responseText.startsWith('['))) {
                const errorData = JSON.parse(responseText);

                if (errorData.err) {
                    if (errorData.err === "Unable to logIn") {
                        errorMessage = "Invalid email or password";
                    } else {
                        errorMessage = errorData.err;
                    }
                }

                if (errorData.error) {
                    errorMessage = errorData.error;
                }
            }
        } catch (e) {
            console.log('Error parsing JSON:', e);
        }

        throw new Error(errorMessage);
    }

    try {
        return await response.json();
    } catch (e) {

        console.log('Error parsing JSON response:', e);
        return { message: 'Operation was successful' };
    }
}

const authService = {
    login: async function (email, password) {
        try {
            const response = await fetch(API_BASE_URL + '/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                }),
            });

            const data = await handleResponse(response, 'Login failed');

            if (data.sessionId) {
                sessionManager.setSession(data.sessionId);
            }

            return data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    register: async function (name, email, password) {
        try {
            const response = await fetch(API_BASE_URL + '/user/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: password
                }),
            });

            return await handleResponse(response, 'Registration failed');
        } catch (error) {
            console.error('Register error:', error);
            throw error;
        }
    },

    googleAuth: async function (name, email, password) {
        try {
            return await this.login(email, password);
        } catch (error) {
            await this.register(name, email, password);
            return await this.login(email, password);
        }
    },

    isLoggedIn: function () {
        return sessionManager.getSessionId() !== null;
    },

    logout: function () {
        sessionManager.clearSession();
    },

    getUserData: async function () {
        try {
            const sessionId = sessionManager.getSessionId();

            if (!sessionId) {
                throw new Error('User is not signed');
            }

            const response = await fetch(API_BASE_URL + '/user/authTest', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ sessionKey: sessionId }),
            });

            return await handleResponse(response, 'Unable to load task lists');
        } catch (error) {
            console.error('Get user data error:', error);
            throw error;
        }
    },
};

const taskListService = {
    getAllTaskLists: async function () {
        try {
            const sessionId = sessionManager.getSessionId();

            if (!sessionId) {
                throw new Error('User is not signed');
            }

            console.log('Sending request to get task lists with session ID:', sessionId);

            const response = await fetch(`${API_BASE_URL}/user/taskLists`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'sessionkey': sessionId
                }
            });

            const result = await handleResponse(response, 'Unable to load task lists');
            console.log('Received task lists:', result);
            return result;
        } catch (error) {
            console.error('Get task lists error:', error);
            throw error;
        }
    },

    createTaskList: async function (name) {
        try {
            const sessionId = sessionManager.getSessionId();

            if (!sessionId) {
                throw new Error('User is not signed');
            }

            const response = await fetch(`${API_BASE_URL}/taskList`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'sessionkey': sessionId
                },
                body: JSON.stringify({
                    name: name
                }),
            });

            return await handleResponse(response, 'Unable to load task lists');
        } catch (error) {
            console.error('Create task list error:', error);
            throw error;
        }
    },

    getTaskList: async function (listId) {
        try {
            const sessionId = sessionManager.getSessionId();

            if (!sessionId) {
                throw new Error('User is not signed');
            }

            const response = await fetch(`${API_BASE_URL}/taskList?listId=${listId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'sessionkey': sessionId
                }
            });

            return await handleResponse(response, 'Unable to load task lists');
        } catch (error) {
            console.error('Get task list error:', error);
            throw error;
        }
    }
};

const taskService = {
    createTask: async function (taskListId, text, state = 0) {
        try {
            const sessionId = sessionManager.getSessionId();

            if (!sessionId) {
                throw new Error('Uživatel není přihlášen');
            }

            const response = await fetch(`${API_BASE_URL}/task`, {
                method: 'PUT',  // PUT for task creation as per backend implementation
                headers: {
                    'Content-Type': 'application/json',
                    'sessionkey': sessionId
                },
                body: JSON.stringify({
                    taskListId: taskListId,
                    text: text,
                    state: state
                })
            });

            return await handleResponse(response, 'Nepodařilo se vytvořit úkol');
        } catch (error) {
            console.error('Create task error:', error);
            throw error;
        }
    },

    getTask: async function (taskId) {
        try {
            const sessionId = sessionManager.getSessionId();

            if (!sessionId) {
                throw new Error('Uživatel není přihlášen');
            }

            const response = await fetch(`${API_BASE_URL}/task?id=${taskId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'sessionkey': sessionId
                }
            });

            return await handleResponse(response, 'Nepodařilo se načíst úkol');
        } catch (error) {
            console.error('Get task error:', error);
            throw error;
        }
    },

    updateTask: async function (taskId, updatedData) {
        try {
            const sessionId = sessionManager.getSessionId();

            if (!sessionId) {
                throw new Error('Uživatel není přihlášen');
            }

            // Získáme aktuální úkol pro ověření existence
            const task = await this.getTask(taskId);

            if (!task) {
                throw new Error('Nepodařilo se načíst úkol');
            }

            // Odesíláme pouze vlastnosti, které validační schéma backendu povoluje
            const updateData = {
                id: taskId,
                text: updatedData.text !== undefined ? updatedData.text : task.text,
                state: updatedData.state !== undefined ? updatedData.state : task.state
            };

            console.log('Odesílám data pro aktualizaci úkolu:', updateData);

            const response = await fetch(`${API_BASE_URL}/task`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'sessionkey': sessionId
                },
                body: JSON.stringify(updateData)
            });

            // Zpracování odpovědi a vrácení dat včetně nového ID
            const updatedTask = await handleResponse(response, 'Nepodařilo se aktualizovat úkol');
            return updatedTask; // Backend vrací nový úkol s novým ID
        } catch (error) {
            console.error('Update task error:', error);
            throw error;
        }
    },

    getTasksByListId: async function (taskListId) {
        try {
            const sessionId = sessionManager.getSessionId();

            if (!sessionId) {
                throw new Error('Uživatel není přihlášen');
            }

            // Use the proper endpoint for getting all tasks for a task list
            const response = await fetch(`${API_BASE_URL}/taskList/tasks?taskListId=${taskListId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'sessionkey': sessionId
                }
            });

            const tasks = await handleResponse(response, 'Nepodařilo se načíst úkoly');

            // Organize the tasks by state
            return {
                open: tasks.filter(task => task.state === 0),
                inProgress: tasks.filter(task => task.state === 1),
                completed: tasks.filter(task => task.state === 2)
            };
        } catch (error) {
            console.error('Get tasks by list ID error:', error);
            throw error;
        }
    },
};

const commentService = {
    getCommentsByTask: async function (taskId) {
        try {
            const sessionId = sessionManager.getSessionId();

            if (!sessionId) {
                throw new Error('Uživatel není přihlášen');
            }

            // Použití nového endpointu pro získání komentářů podle ID úkolu
            const response = await fetch(`${API_BASE_URL}/comment/byTask?taskId=${taskId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'sessionkey': sessionId
                }
            });

            return await handleResponse(response, 'Nepodařilo se načíst komentáře');
        } catch (error) {
            console.error('Get comments error:', error);
            throw error;
        }
    },

    createComment: async function (taskId, text) {
        try {
            const sessionId = sessionManager.getSessionId();

            if (!sessionId) {
                throw new Error('Uživatel není přihlášen');
            }

            const response = await fetch(`${API_BASE_URL}/comment`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'sessionkey': sessionId
                },
                body: JSON.stringify({
                    taskId: taskId,
                    text: text
                })
            });

            return await handleResponse(response, 'Nepodařilo se vytvořit komentář');
        } catch (error) {
            console.error('Create comment error:', error);
            throw error;
        }
    },

    updateComment: async function (commentId, text) {
        try {
            const sessionId = sessionManager.getSessionId();

            if (!sessionId) {
                throw new Error('Uživatel není přihlášen');
            }

            const response = await fetch(`${API_BASE_URL}/comment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'sessionkey': sessionId
                },
                body: JSON.stringify({
                    id: commentId,
                    text: text
                })
            });

            return await handleResponse(response, 'Nepodařilo se aktualizovat komentář');
        } catch (error) {
            console.error('Update comment error:', error);
            throw error;
        }
    }
};

const userService = {
    getUserById: async function (userId) {
        try {
            const sessionId = sessionManager.getSessionId();

            if (!sessionId) {
                throw new Error('Uživatel není přihlášen');
            }

            const response = await fetch(`${API_BASE_URL}/user/get?id=${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'sessionkey': sessionId
                }
            });

            return await handleResponse(response, 'Nepodařilo se načíst uživatele');
        } catch (error) {
            console.error('Get user error:', error);
            throw error;
        }
    }
};

const attachmentService = {
    uploadFile: async function (file, taskId) {
        try {
            const sessionId = sessionManager.getSessionId();

            if (!sessionId) {
                throw new Error('Uživatel není přihlášen');
            }

            // Create FormData to send the file
            const formData = new FormData();
            formData.append('file', file);

            console.log('Uploading file:', file.name, 'for task:', taskId);

            // Build URL with taskId parameter
            const url = `${API_BASE_URL}/attachment?taskId=${taskId}`;
            console.log('Upload URL:', url);

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'sessionkey': sessionId
                    // Note: Don't set Content-Type header with FormData
                },
                body: formData
            });

            if (!response.ok) {
                const errText = await response.text();
                console.error('Server error response:', errText);
                throw new Error('Nepodařilo se nahrát soubor');
            }

            return await response.json();
        } catch (error) {
            console.error('Upload file error:', error);
            throw error;
        }
    },

    uploadFileToComment: async function (file, commentId) {
        try {
            const sessionId = sessionManager.getSessionId();

            if (!sessionId) {
                throw new Error('Uživatel není přihlášen');
            }

            // Create FormData to send the file
            const formData = new FormData();
            formData.append('file', file);

            console.log('Uploading file:', file.name, 'for comment:', commentId);

            // Build URL with commentId parameter
            const url = `${API_BASE_URL}/attachment?commentId=${commentId}`;
            console.log('Upload URL:', url);

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'sessionkey': sessionId
                    // Note: Don't set Content-Type header with FormData
                },
                body: formData
            });

            if (!response.ok) {
                const errText = await response.text();
                console.error('Server error response:', errText);
                throw new Error('Nepodařilo se nahrát soubor ke komentáři');
            }

            return await response.json();
        } catch (error) {
            console.error('Upload file to comment error:', error);
            throw error;
        }
    },

    downloadFile: async function (fileName) {
        try {
            const sessionId = sessionManager.getSessionId();

            if (!sessionId) {
                throw new Error('Uživatel není přihlášen');
            }

            const response = await fetch(`${API_BASE_URL}/attachment?fileName=${fileName}`, {
                method: 'GET',
                headers: {
                    'sessionkey': sessionId
                }
            });

            if (!response.ok) {
                throw new Error('Nepodařilo se stáhnout soubor');
            }

            return response.blob();
        } catch (error) {
            console.error('Download file error:', error);
            throw error;
        }
    }
};

export { authService, taskListService, taskService, commentService, userService, attachmentService }; 