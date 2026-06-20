import { Navbar, Nav, Container } from 'react-bootstrap'
import { Link, NavLink, useNavigate } from 'react-router-dom'
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
                <Navbar.Brand as={Link} to="/">🚇 Last Race</Navbar.Brand>
                <Nav className="me-auto">
                    {/* NavLink adds an "active" class automatically for the current route */}
                    <Nav.Link as={NavLink} to="/" end>Home</Nav.Link>
                    {/* Play and Ranking links only when the user is logged in */}
                    {user && <Nav.Link as={NavLink} to="/play">Play</Nav.Link>}
                    {user && <Nav.Link as={NavLink} to="/ranking">Ranking</Nav.Link>}
                </Nav>
                <Nav>
                    {user ? (
                        <>
                            <Navbar.Text className="me-3">Hello, {user.username}</Navbar.Text>
                            <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                        </>
                    ) : (
                        <Nav.Link as={NavLink} to="/login">Login</Nav.Link>
                    )}
                </Nav>
            </Container>
        </Navbar>
    )
}

export default NavigationBar