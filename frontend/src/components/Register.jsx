import { useState } from 'react'
import FormInput from './common/FormInput'

function Register({ onSwitchToLogin }) {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!name || !email || !password || !confirmPassword) {
            setError('Prosím vyplňte všechna pole')
            return
        }

        if (password !== confirmPassword) {
            setError('Hesla se neshodují')
            return
        }

        try {
            setIsLoading(true)
            setError('')

            const response = await fetch('http://localhost:8080/api/v1/user/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    email,
                    password
                }),
            })

            // DONT FORGET TO REMOVE THIS LINE IN PRODUCTION
            console.log('Odesílám data:', { name, email, password: password });

            if (!response.ok) {
                const responseText = await response.text();
                let errorMessage = responseText || 'Registrace selhala';

                // Pokud to vypadá jako JSON, zkusíme to parsovat
                if (responseText && (responseText.startsWith('{') || responseText.startsWith('['))) {
                    try {
                        const errorData = JSON.parse(responseText);
                        errorMessage = JSON.stringify(errorData);
                    } catch (e) {
                        console.log('Error parsing JSON:', e);
                    }
                }

                throw new Error(errorMessage);
            }

            console.log('Registrace úspěšná');
            onSwitchToLogin();

        } catch (err) {
            setError('Registrace se nezdařila: ' + err.message);
            console.error('Registration error:', err);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="auth-card">
            <h1>Registrace</h1>

            {/* Display error message if there is one */}
            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit}>
                <FormInput
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Zadejte své jméno"
                    disabled={isLoading}
                    label="Jméno"
                />

                <FormInput
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Zadejte email"
                    disabled={isLoading}
                    label="Email"
                />

                <FormInput
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Zadejte heslo"
                    disabled={isLoading}
                    label="Heslo"
                />

                <FormInput
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Potvrďte heslo"
                    disabled={isLoading}
                    label="Potvrzení hesla"
                />

                {/* Submit button */}
                <button
                    type="submit"
                    className="primary-button"
                    disabled={isLoading}
                >
                    Registrovat se
                </button>
            </form>

            {/* Link to switch to login */}
            <p className="switch-prompt">
                Již máte účet? <a onClick={onSwitchToLogin}>Přihlásit se</a>
            </p>
        </div>
    )
}

export default Register 