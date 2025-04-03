import { useState, useEffect } from 'react'
import Login from './components/Login'
import Register from './components/Register'
import Dashboard from './components/Dashboard'
import { authService } from './services/api'
import './App.css'

/**
 * Main App component that handles authentication page state
 * Toggles between login and registration views
 * After login, it should redirect us to the dashboard
 */
function App() {
    const [currentPage, setCurrentPage] = useState('login')

    useEffect(() => {
        // Kontrola přihlášení při načtení stránky
        if (authService.isLoggedIn()) {
            setCurrentPage('dashboard')
        }

        // Event listener pro přepínání na dashboard
        const handleSwitchToDashboard = () => {
            setCurrentPage('dashboard')
        }

        window.switchToDashboard = function () {
            window.dispatchEvent(new Event('switchToDashboard'));
        };

        window.addEventListener('switchToDashboard', handleSwitchToDashboard)

        return () => {
            window.removeEventListener('switchToDashboard', handleSwitchToDashboard)
        }
    }, [])

    const renderPage = () => {
        switch (currentPage) {
            case 'login':
                return <Login onSwitchToRegister={() => setCurrentPage('register')} />
            case 'register':
                return <Register onSwitchToLogin={() => setCurrentPage('login')} />
            case 'dashboard':
                return <Dashboard />
            default:
                return <Login onSwitchToRegister={() => setCurrentPage('register')} />
        }
    }

    return (
        <div className="app-container">
            {renderPage()}
        </div>
    )
}

export default App
