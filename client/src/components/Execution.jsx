import { useState, useEffect } from 'react';
import { Container, Button, Alert, ListGroup, Badge } from 'react-bootstrap';

function Execution({ onNext, gameData }) {
    const [result, setResult] = useState(null)
    const [currentStep, setCurrentStep] = useState(0)

    useEffect(() => {
        if (!gameData) return

        fetch('http://localhost:3001/api/games', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                startId: gameData.gameInfo.start,
                endId: gameData.gameInfo.end,
                segments: gameData.segments.map(s => s.id)
            })
        })
            .then(res => res.json())
            .then(data => setResult(data))
    }, [])

    if (!result) return <Container className="mt-4"><p>Validating route...</p></Container>

    if (!result.valid) return (
        <Container className="mt-4" style={{ maxWidth: '700px' }}>
            <Alert variant="danger">
                <Alert.Heading>Invalid Route!</Alert.Heading>
                <p>Your route was invalid. You lost all your coins.</p>
            </Alert>
            <Button onClick={() => onNext({ score: 0 })}>See Result</Button>
        </Container>
    )

    return (
        <Container className="mt-4" style={{ maxWidth: '700px' }}>
            <h2>Journey Execution</h2>
            <ListGroup className="mb-3">
                {result.events.slice(0, currentStep + 1).map((event, index) => (
                    <ListGroup.Item key={index} className="d-flex justify-content-between">
                        <span>Segment {index + 1}: {event.description}</span>
                        <Badge bg={event.effect >= 0 ? 'success' : 'danger'}>
                            {event.effect >= 0 ? '+' : ''}{event.effect}
                        </Badge>
                    </ListGroup.Item>
                ))}
            </ListGroup>

            {currentStep < result.events.length - 1 ? (
                <Button onClick={() => setCurrentStep(s => s + 1)}>Next Segment</Button>
            ) : (
                <Button onClick={() => onNext({ score: result.finalScore })}>See Final Score</Button>
            )}
        </Container>
    )
}

export default Execution;