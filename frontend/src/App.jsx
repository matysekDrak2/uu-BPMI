import { useState } from 'react'
import Login from './components/Login'
import Register from './components/Register'
import './App.css'

/**
 * Main App component that handles authentication page state
 * Toggles between login and registration views
 * After login, it should redirect us to the dashboard
 */
function App() {
    const [currentPage, setCurrentPage] = useState('login')

    return (
        <div className="app-container">
            {currentPage === 'login' ? (
                <Login onSwitchToRegister={() => setCurrentPage('register')} />
            ) : (
                <Register onSwitchToLogin={() => setCurrentPage('login')} />
            )}
        </div>
    )
}

export default App
