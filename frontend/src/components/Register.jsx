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

            console.log('Registrace uživatele:', { name, email, password })
            // ON SUCCESSFUL REGISTRATION THERE WILL BE API CALL AND THEN REDIRECT TO LOGIN
            
            onSwitchToLogin()

        } catch (err) {
            setError('Registrace se nezdařila. Zkuste to prosím znovu.')
            console.error('Registration error:', err)
        } finally {
            setIsLoading(false)
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