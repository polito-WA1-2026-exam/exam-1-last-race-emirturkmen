import { Navbar, Nav, Container } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function NavigationBar() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = async () => {
        // close the session in server side also
        await fetch('http://localhost:3001/api/sessions/current', {
            method: 'DELETE',
            credentials: 'include'
        })
        logout()
        navigate('/')
    }

    return (
        <Navbar bg="dark" variant="dark" fixed="top">
            <Container>
                <Navbar.Brand as={Link} to="/">Last Race</Navbar.Brand>
                <Nav className="me-auto">
                    <Nav.Link as={Link} to="/">Home</Nav.Link>
                    <Nav.Link as={Link} to="/ranking">Ranking</Nav.Link>
                </Nav>
                <Nav>
                    {user ? (
                        <>
                            <Navbar.Text className="me-3">Hello, {user.username}</Navbar.Text>
                            <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                        </>
                    ) : (
                        <Nav.Link as={Link} to="/login">Login</Nav.Link>
                    )}
                </Nav>
            </Container>
        </Navbar>
    )
}

export default NavigationBar