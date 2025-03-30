import { useState } from 'react'
import { GoogleLogin } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'
import FormInput from './common/FormInput'

function Login({ onSwitchToRegister }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Form validation
        if (!email || !password) {
            setError('Prosím vyplňte všechna pole')
            return
        }

        try {
            setIsLoading(true)
            setError('')

            // Api call login placebolder..
            console.log('Přihlašování s:', { email, password })

            // Placeholder for redirect to dashboard
            console.log('Přihlášení úspěšné. Přesměrování na dashboard...')
            // AFTER SUCCESSFUL LOGIN THERE WILL BE API CALL AND THEN REDIRECT TO DASHBOARD

        } catch (err) {
            setError('Přihlášení se nezdařilo. Zkontrolujte své údaje.')
            console.error('Login error:', err)
        } finally {
            setIsLoading(false)
        }
    }

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            setIsLoading(true)
            setError('')

            const decoded = jwtDecode(credentialResponse.credential)
            console.log('Google user info:', decoded)

            console.log('Přihlášení přes Google úspěšné')

        } catch (err) {
            console.error('Google login error:', err)
            setError('Přihlášení přes Google se nezdařilo')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="auth-card">
            <h1>Přihlášení</h1>

            {/* Display error only in case there is one */}
            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit}>
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

                <button
                    type="submit"
                    className="primary-button"
                    disabled={isLoading}
                >
                    Přihlásit se
                </button>
            </form>

            <div className="separator">
                <span>nebo</span>
            </div>

            <div className="google-login-container">
                <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => {
                        setError('Google přihlášení selhalo')
                    }}
                    text="continue_with"
                    shape="rectangular"
                    locale="cs_CZ"
                />
            </div>

            {/* Link to switch to registration */}
            <p className="switch-prompt">
                Nemáte účet? <a onClick={onSwitchToRegister}>Registrovat se</a>
            </p>
        </div>
    )
}

export default Login 