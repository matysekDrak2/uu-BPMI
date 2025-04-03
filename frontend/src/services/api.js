// Base URL 
const API_BASE_URL = 'http://localhost:8080/api/v1';

async function handleResponse(response, defaultErrorMessage = 'Požadavek selhal') {
    if (!response.ok) {
        const responseText = await response.text();
        let errorMessage = defaultErrorMessage;

        try {
            if (responseText && (responseText.startsWith('{') || responseText.startsWith('['))) {
                const errorData = JSON.parse(responseText);

                if (errorData.err) {
                    if (errorData.err === "Unable to logIn") {
                        errorMessage = "Nesprávný email nebo heslo";
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
        return { message: 'Operace byla úspěšná' };
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

            const data = await handleResponse(response, 'Přihlášení se nezdařilo');

            if (data.sessionId) {
                localStorage.setItem('sessionId', data.sessionId);
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

            return await handleResponse(response, 'Registrace se nezdařila');
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
        return localStorage.getItem('sessionId') !== null;
    },

    logout: function () {
        localStorage.removeItem('sessionId');
    },

    getUserData: async function () {
        try {
            const sessionId = localStorage.getItem('sessionId');

            if (!sessionId) {
                throw new Error('Uživatel není přihlášen');
            }

            const response = await fetch(API_BASE_URL + '/user/authTest', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ sessionKey: sessionId }),
            });

            return await handleResponse(response, 'Nepodařilo se načíst data uživatele');
        } catch (error) {
            console.error('Get user data error:', error);
            throw error;
        }
    },
};

export { authService }; 