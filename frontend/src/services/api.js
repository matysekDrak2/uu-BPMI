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
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sessionKey: sessionId,
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

            const response = await fetch(`${API_BASE_URL}/taskList`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sessionKey: sessionId,
                    listId: listId
                })
            });

            return await handleResponse(response, 'Unable to load task lists');
        } catch (error) {
            console.error('Get task list error:', error);
            throw error;
        }
    }
};

export { authService, taskListService }; 