import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function NavigationBar() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    return (
        <nav>
            <Link to="/">Ana Sayfa</Link>
            {' | '}
            <Link to="/ranking">Sıralama</Link>
            {' | '}
            {user ? (
                <>
                    <span>Merhaba, {user.username}</span>
                    {' | '}
                    <button onClick={handleLogout}>Çıkış</button>
                </>
            ) : (
                <Link to="/login">Giriş Yap</Link>
            )}
        </nav>
    )
}

export default NavigationBar