import { Container, Button, Alert } from 'react-bootstrap';

function Result({ onRestart, score }) {
    return (
        <Container className="mt-4" style={{ maxWidth: '500px' }}>
            <h2>Game Over</h2>
            <Alert variant={score > 20 ? 'success' : score > 0 ? 'warning' : 'danger'}>
                <Alert.Heading>Final Score: {score} coins</Alert.Heading>
                <p>
                    {score > 20 ? 'Excellent journey!' : score > 0 ? 'Good effort!' : 'Better luck next time!'}
                </p>
            </Alert>
            <Button onClick={onRestart}>Play Again</Button>
        </Container>
    )
}

export default Result;