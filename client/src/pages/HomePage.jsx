import { Container, Button, Card } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function HomePage() {
    const { user } = useAuth()
    const navigate = useNavigate()

    return (
        <Container className="mt-4" style={{ maxWidth: '700px' }}>
            {/* Title on the left, play/login action on the right */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="mb-0">Last Race</h1>
                {user ? (
                    <Button size="lg" onClick={() => navigate('/play')}>
                        Play Now ▶️
                    </Button>
                ) : (
                    <Button size="lg" variant="outline-primary" onClick={() => navigate('/login')}>
                        Login to Play
                    </Button>
                )}
            </div>

            <Card className="mb-3">
                <Card.Body>
                    <Card.Title>How to Play</Card.Title>
                    <Card.Text>
                        You will be assigned a starting station and a destination station in a metro network.
                        Your goal is to reach the destination with the highest possible score.
                    </Card.Text>
                </Card.Body>
            </Card>

            <Card className="mb-3">
                <Card.Body>
                    <Card.Title>Game Phases</Card.Title>
                    <ol>
                        <li><strong>Setup</strong> — View the full network map with all lines and stations.</li>
                        <li><strong>Planning</strong> — You have 90 seconds to build your route by selecting segments in order.</li>
                        <li><strong>Execution</strong> — Your route is validated. For each segment, a random event occurs affecting your coins.</li>
                        <li><strong>Result</strong> — Your final score is displayed. Try to beat your best!</li>
                    </ol>
                </Card.Body>
            </Card>

            <Card className="mb-4">
                <Card.Body>
                    <Card.Title>Rules</Card.Title>
                    <ul>
                        <li>Each game starts with <strong>20 coins</strong>.</li>
                        <li>Your route must start and end at the assigned stations.</li>
                        <li>Line changes are only allowed at interchange stations.</li>
                        <li>If your route is invalid, you lose all 20 coins.</li>
                        <li>Final score cannot go below 0.</li>
                    </ul>
                </Card.Body>
            </Card>

        </Container>
    )
}

export default HomePage