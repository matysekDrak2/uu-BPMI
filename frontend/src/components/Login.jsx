import { useState } from 'react'
import { GoogleLogin } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'
import FormInput from './common/FormInput'
import { authService } from '../services/api'
import { validateEmail, validatePassword } from '../utils/validators'

function Login({ onSwitchToRegister }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!email || !password) {
            setError('Prosím vyplňte všechna pole')
            return
        }

        if (!validateEmail(email)) {
            setError('Zadejte platný email')
            return
        }

        try {
            setIsLoading(true)
            setError('')

            try {
                await authService.login(email, password)
                window.switchToDashboard()
            } catch (apiError) {
                if (apiError.message === 'Nesprávný email nebo heslo') {
                    setError('Nesprávný email nebo heslo')
                } else {
                    setError(apiError.message || 'Přihlášení se nezdařilo')
                }
                throw apiError
            }

        } catch (err) {
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
            const googlePassword = decoded.sub

            try {
                await authService.googleAuth(decoded.name, decoded.email, googlePassword)
                window.switchToDashboard()
            } catch (apiError) {
                setError('Přihlášení přes Google se nezdařilo: ' + apiError.message)
                throw apiError // Pro logování
            }

        } catch (err) {
            console.error('Google login error:', err)
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
                    {isLoading ? 'Přihlašování...' : 'Přihlásit se'}
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

            {/* Link to switch to register */}
            <p className="switch-prompt">
                Nemáte účet? <a onClick={onSwitchToRegister}>Zaregistrovat se</a>
            </p>
        </div>
    )
}

export default Login 