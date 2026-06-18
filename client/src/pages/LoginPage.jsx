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

    const submit = async () => {
        const response = await fetch("http://localhost:3001/api/sessions", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            credentials: "include", // necessary for cookies
            body: JSON.stringify({username, password})
        });

        if(response.ok){
            const data = await response.json()  // {id, username}
            login(data)
            navigate('/')
        }
        else{
            setError("Invalid username or password");
        }
    };




    return (
        <Container className="mt-5" style={{maxWidth: '400px'}}>
            <h2 className="mb-4">Login</h2>

            {error && <Alert variant="danger">{error}</Alert>}

            <Form.Control
                className="mb-3"
                type="text"
                placeholder="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
            />

            <Form.Control
                className="mb-3"
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
            />

            <Button className="w-100" onClick={submit}>Login</Button>
        </Container>
    );
}
export default LoginPage