import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../context/AuthContext.jsx";
import { Form, Button, Alert, Container } from 'react-bootstrap';

function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login } = useAuth()
    const navigate = useNavigate()

    const submit = async (event) => {
        event.preventDefault();  // stop the browser from reloading the page on submit
        try {
            const response = await fetch("http://localhost:3001/api/sessions", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                credentials: "include", // necessary for cookies
                body: JSON.stringify({username, password})
            });

            if (response.ok) {
                const data = await response.json()  // {id, username}
                login(data)
                navigate('/')
            } else {
                setError("Invalid username or password");
            }
        } catch {
            setError("Could not connect to the server. Please try again.");
        }
    };

    return (
        <Container className="mt-5" style={{maxWidth: '400px'}}>
            <h2 className="mb-4">Login</h2>

            {error && <Alert variant="danger">{error}</Alert>}

            {/* Wrapping inputs in a Form lets the user submit by pressing Enter */}
            <Form onSubmit={submit}>
                <Form.Group className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter username"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                </Form.Group>

                <Button className="w-100" type="submit" disabled={!username || !password}>
                    Login
                </Button>
            </Form>
        </Container>
    );
}
export default LoginPage
