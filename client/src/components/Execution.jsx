import { useState, useEffect } from 'react';
import { Container, Button, ListGroup, Badge, ProgressBar } from 'react-bootstrap';

function Execution({ gameData, onFinish }) {
    const [result, setResult] = useState(null)
    // -1 = no segment revealed yet (shows 0/N); increments to N-1 as user advances.
    const [currentStep, setCurrentStep] = useState(-1)

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
            .then(data => {
                // Invalid routes have nothing to step through: go straight to the result screen.
                if (!data.valid) {
                    onFinish({ valid: false, score: 0 })
                } else {
                    setResult(data)
                }
            })
    }, [])

    if (!result) return <Container className="mt-4"><p>Validating route...</p></Container>

    const totalSteps = result.events.length
    const stepsRevealed = currentStep + 1   // 0 before first reveal, up to totalSteps

    // Travel direction (from → to) for each segment, computed by walking from startId.
    // Segments are undirected in the DB; we pick the direction based on which end connects
    // to the station we arrived at, matching the logic in Planning and the backend.
    const segmentLabels = []
    let station = gameData.gameInfo.start
    for (const seg of gameData.segments) {
        if (seg.station1_id === station) {
            segmentLabels.push(`${seg.station1_name} → ${seg.station2_name}`)
            station = seg.station2_id
        } else {
            segmentLabels.push(`${seg.station2_name} → ${seg.station1_name}`)
            station = seg.station1_id
        }
    }

    // Live running score starting from 20 coins, clamped to 0 during reveal.
    // On the final step the server's clamped finalScore is the authoritative value.
    const runningScore = 20 + result.events
        .slice(0, stepsRevealed)
        .reduce((sum, e) => sum + e.effect, 0)
    const displayScore = stepsRevealed === totalSteps ? result.finalScore : Math.max(0, runningScore)

    return (
        <Container className="mt-4" style={{ maxWidth: '700px' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="mb-0">Journey Execution</h2>
                {/* Live score badge, updates on every segment reveal */}
                <Badge
                    bg={displayScore > 20 ? 'success' : displayScore > 0 ? 'warning' : 'danger'}
                    text={displayScore > 0 && displayScore <= 20 ? 'dark' : undefined}
                    style={{ fontSize: '1.1rem', padding: '0.5rem 0.8rem', transition: 'all 0.3s ease' }}
                >
                    {displayScore} coins
                </Badge>
            </div>

            {/* Visual progress: how many stops out of the total we have reached */}
            <div className="mb-4">
                <div className="d-flex justify-content-between mb-1">
                    <span className="text-muted">Progress</span>
                    <span className="fw-bold">Stop {stepsRevealed} / {totalSteps}</span>
                </div>
                <ProgressBar now={stepsRevealed} max={totalSteps} />
            </div>

            {stepsRevealed === 0 ? (
                <p className="text-muted">Click "Start Journey" to begin.</p>
            ) : (
                <ListGroup className="mb-3">
                    {result.events.slice(0, stepsRevealed).map((event, index) => (
                        <ListGroup.Item key={index} variant={event.effect >= 0 ? 'success' : 'danger'}>
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
                <Button variant="success" onClick={() => onFinish({ valid: true, score: result.finalScore })}>
                    See Result
                </Button>
            )}
        </Container>
    )
}

export default Execution;
