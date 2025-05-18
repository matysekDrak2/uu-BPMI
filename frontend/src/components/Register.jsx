import { useState } from 'react'
import FormInput from './common/FormInput'
import { authService } from '../services/api'
import { validateEmail, validatePassword, validateName } from '../utils/validators'

function Register({ onSwitchToLogin }) {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!name || !email || !password || !confirmPassword) {
            setError('Prosím vyplňte všechna pole')
            setSuccess('')
            return
        }

        if (!validateName(name)) {
            setError('Jméno musí mít alespoň 2 znaky')
            setSuccess('')
            return
        }

        if (!validateEmail(email)) {
            setError('Zadejte platný email')
            setSuccess('')
            return
        }

        if (!validatePassword(password)) {
            setError('Heslo musí mít alespoň 6 znaků')
            setSuccess('')
            return
        }

        if (password !== confirmPassword) {
            setError('Hesla se neshodují')
            setSuccess('')
            return
        }

        try {
            setIsLoading(true)
            setError('')
            setSuccess('')

            try {
                await authService.register(name, email, password)

                setSuccess('Registrace byla úspěšná! Nyní se můžete přihlásit.')

                // Vyčistit formulář
                setName('')
                setEmail('')
                setPassword('')
                setConfirmPassword('')

                // Přesměrování po úspěšné registraci
                setTimeout(() => {
                    onSwitchToLogin()
                }, 1000)
            } catch (apiError) {
                if (apiError.message.includes('Uživatel s tímto emailem již existuje')) {
                    setError('Uživatel s tímto emailem již existuje')
                } else {
                    setError(apiError.message || 'Registrace se nezdařila')
                }
                throw apiError
            }

        } catch (err) {
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

            {/* Display success message if there is one */}
            {success && <div className="success-message">{success}</div>}

            <form onSubmit={handleSubmit} noValidate>
                <FormInput
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Zadejte jméno"
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
                    {isLoading ? 'Registrace probíhá...' : 'Registrovat se'}
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