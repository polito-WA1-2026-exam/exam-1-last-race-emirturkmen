import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Button, Alert, ListGroup, Badge } from 'react-bootstrap';

function Execution({ gameData }) {
    const [result, setResult] = useState(null)
    // -1 = no segment revealed yet (shows 0/N); increments to N-1 as user advances.
    const [currentStep, setCurrentStep] = useState(-1)
    const [finished, setFinished] = useState(false)
    const navigate = useNavigate()

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
            <div className="d-flex gap-2">
                <Button variant="primary" onClick={() => navigate('/play')}>Play Again</Button>
                <Button variant="outline-secondary" onClick={() => navigate('/ranking', { state: { lastScore: 0 } })}>
                    View Ranking
                </Button>
            </div>
        </Container>
    )

    const totalSteps = result.events.length
    const stepsRevealed = currentStep + 1   // 0 before first reveal, up to totalSteps

    // Precompute travel direction (from → to) for each segment by walking from startId.
    // Segments are undirected in the DB; we determine direction based on which end connects
    // to the station we arrived at, matching the same logic used in Planning and the backend.
    let station = gameData.gameInfo.start
    const segmentLabels = gameData.segments.map(seg => {
        if (seg.station1_id === station) {
            station = seg.station2_id
            return `${seg.station1_name} → ${seg.station2_name}`
        } else {
            station = seg.station1_id
            return `${seg.station2_name} → ${seg.station1_name}`
        }
    })

    // Live running score starting from 20 coins, clamped to 0 during reveal.
    // On the final step the server's clamped finalScore is used as the authoritative value.
    const runningScore = 20 + result.events
        .slice(0, stepsRevealed)
        .reduce((sum, e) => sum + e.effect, 0)
    const displayScore = stepsRevealed === totalSteps ? result.finalScore : Math.max(0, runningScore)

    // Result screen shown after the user clicks through all segments.
    if (finished) {
        const score = result.finalScore
        const scoreColor = score > 20 ? '#198754' : score > 0 ? '#fd7e14' : '#dc3545'
        return (
            <Container className="mt-5 text-center" style={{ maxWidth: '500px' }}>
                <h2 className="mb-1">Destination Reached!</h2>
                <p className="text-muted mb-4">
                    {gameData.gameInfo.startName} → {gameData.gameInfo.endName}
                </p>
                <p className="mb-1 text-muted">Final Score</p>
                <div style={{ fontSize: '4rem', fontWeight: 700, color: scoreColor, lineHeight: 1.1 }}>
                    {score}
                </div>
                <div className="mb-4" style={{ fontSize: '1.3rem', color: scoreColor }}>coins</div>
                <div className="d-flex gap-3 justify-content-center">
                    <Button variant="primary" size="lg" onClick={() => navigate('/play')}>Play Again</Button>
                    <Button variant="outline-secondary" size="lg"
                        onClick={() => navigate('/ranking', { state: { lastScore: score } })}>
                        View Ranking
                    </Button>
                </div>
            </Container>
        )
    }

    // Visual step progress: N+1 circles (one per station stop) connected by lines.
    // Circles 0..stepsRevealed are filled; the rest are empty.
    const StepIndicator = () => (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-1">
                <span className="fw-semibold text-muted small text-uppercase" style={{ letterSpacing: '0.05em' }}>
                    Progress
                </span>
                <span className="fw-bold">
                    Stop {stepsRevealed} / {totalSteps}
                </span>
            </div>
            <div className="d-flex align-items-center" style={{ overflowX: 'auto', paddingBottom: 2 }}>
                {Array.from({ length: totalSteps + 1 }, (_, i) => (
                    <span key={i} className="d-flex align-items-center" style={{ flexShrink: 0 }}>
                        <span style={{
                            width: 30, height: 30, borderRadius: '50%',
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            fontWeight: 700, fontSize: '0.8rem',
                            background: i <= stepsRevealed ? '#0d6efd' : '#dee2e6',
                            color: i <= stepsRevealed ? '#fff' : '#6c757d',
                            border: i === stepsRevealed && stepsRevealed < totalSteps
                                ? '2px solid #0d6efd' : '2px solid transparent',
                            boxSizing: 'border-box',
                        }}>
                            {i}
                        </span>
                        {i < totalSteps && (
                            <span style={{
                                flex: 1, height: 3, minWidth: 24,
                                background: i < stepsRevealed ? '#0d6efd' : '#dee2e6',
                                display: 'inline-block',
                            }} />
                        )}
                    </span>
                ))}
            </div>
        </div>
    )

    return (
        <Container className="mt-4" style={{ maxWidth: '700px' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="mb-0">Journey Execution</h2>
                {/* Live score badge, updates on every segment reveal */}
                <Badge
                    bg={displayScore > 20 ? 'success' : displayScore > 0 ? 'warning' : 'danger'}
                    text={displayScore > 0 && displayScore <= 20 ? 'dark' : undefined}
                    style={{ fontSize: '1.1rem', padding: '0.5rem 0.8rem' }}
                >
                    {displayScore} coins
                </Badge>
            </div>

            <div className="mb-4">
                <StepIndicator />
            </div>

            {stepsRevealed === 0 ? (
                <p className="text-muted">Click "Next Segment" to start your journey.</p>
            ) : (
                <ListGroup className="mb-3">
                    {result.events.slice(0, stepsRevealed).map((event, index) => (
                        <ListGroup.Item key={index}>
                            <div className="d-flex justify-content-between align-items-start">
                                <div>
                                    <div className="fw-semibold">{segmentLabels[index]}</div>
                                    <div className="text-muted small">{event.description}</div>
                                </div>
                                <Badge
                                    bg={event.effect >= 0 ? 'success' : 'danger'}
                                    className="ms-2 flex-shrink-0"
                                >
                                    {event.effect >= 0 ? '+' : ''}{event.effect}
                                </Badge>
                            </div>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            )}

            {stepsRevealed < totalSteps ? (
                <Button onClick={() => setCurrentStep(s => s + 1)}>
                    {stepsRevealed === 0 ? 'Start Journey' : 'Next Segment'}
                </Button>
            ) : (
                <Button variant="success" onClick={() => setFinished(true)}>
                    See Result
                </Button>
            )}
        </Container>
    )
}

export default Execution;
