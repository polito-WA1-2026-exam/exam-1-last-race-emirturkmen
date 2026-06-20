import { Container, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

// Shown after the execution phase ends. Receives the outcome from PlayPage.
// "Play Again" resets the PlayPage state (via onRestart) instead of navigating,
// because we are already on the /play route.
function Result({ result, gameInfo, onRestart }) {
    const navigate = useNavigate()
    const { valid, score } = result

    const actions = (
        <div className="d-flex gap-3 justify-content-center">
            <Button variant="primary" size="lg" onClick={onRestart}>Play Again 🔄</Button>
            <Button
                variant="outline-secondary"
                size="lg"
                onClick={() => navigate('/ranking', { state: { lastScore: score } })}
            >
                View Ranking 🏆
            </Button>
        </div>
    )

    if (!valid) {
        return (
            <Container className="mt-5 text-center" style={{ maxWidth: '500px' }}>
                <Alert variant="danger">
                    <Alert.Heading>Invalid Route!</Alert.Heading>
                    <p>Your route was invalid. You lost all your coins.</p>
                </Alert>
                {actions}
            </Container>
        )
    }

    // Score color: green if profitable, orange if positive, red if zero.
    const scoreColor = score > 20 ? '#198754' : score > 0 ? '#fd7e14' : '#dc3545'

    return (
        <Container className="mt-5 text-center" style={{ maxWidth: '500px' }}>
            <h2 className="mb-1">Destination Reached!</h2>
            <p className="text-muted mb-4">
                {gameInfo.startName} → {gameInfo.endName}
            </p>
            <p className="mb-1 text-muted">Final Score</p>
            <div style={{ fontSize: '4rem', fontWeight: 700, color: scoreColor, lineHeight: 1.1 }}>
                {score}
            </div>
            <div className="mb-4" style={{ fontSize: '1.3rem', color: scoreColor }}>coins</div>
            {actions}
        </Container>
    )
}

export default Result;
