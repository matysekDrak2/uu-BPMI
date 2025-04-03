import { useEffect, useState } from 'react'
import { authService } from '../services/api'

function Dashboard() {
    const [userData, setUserData] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                if (!authService.isLoggedIn()) {
                    window.location.href = '/'
                    return
                }

                try {
                    const userData = await authService.getUserData();
                    setUserData(userData);
                } catch (apiError) {
                    setError('Nepodařilo se načíst data: ' + apiError.message);
                    authService.logout();

                    setTimeout(() => {
                        window.location.href = '/'
                    }, 2000);
                    throw apiError;
                }
            } catch (err) {
                console.error('Error fetching user data:', err);
            } finally {
                setIsLoading(false)
            }
        }

        fetchUserData()
    }, [])

    const handleLogout = () => {
        authService.logout()
        window.location.href = '/'
    }

    if (isLoading) {
        return <div className="dashboard-container">Načítání...</div>
    }

    if (error) {
        return <div className="dashboard-container error-message">{error}</div>
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>Dashboard</h1>
                <button onClick={handleLogout} className="logout-button">
                    Odhlásit se
                </button>
            </div>

            <div className="user-info-card">
                <h2>Informace o uživateli</h2>
                {userData && (
                    <div className="user-info">
                        <p><strong>Jméno:</strong> {userData.name}</p>
                        <p><strong>Email:</strong> {userData.email}</p>
                        <p><strong>ID:</strong> {userData.userId}</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Dashboard 