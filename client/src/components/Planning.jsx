import { useState, useEffect } from 'react'
import { Container, Button, ListGroup, Badge, Alert, Form, Row, Col, ProgressBar, Card } from 'react-bootstrap'

function Planning({ onNext }) {
    const [connections, setConnections] = useState([])
    const [gameInfo, setGameInfo] = useState(null)
    const [selectedSegments, setSelectedSegments] = useState([])
    const [timeLeft, setTimeLeft] = useState(90)
    const [search, setSearch] = useState('')

    // Submit the route built so far. Shared by the "Submit Route" button and by the
    // timeout below, so running out of time behaves exactly like pressing Submit.
    // The server then decides: a complete valid route is scored, otherwise it is invalid.
    const submitRoute = () => onNext({ gameInfo, segments: selectedSegments })

    useEffect(() => {
        fetch('http://localhost:3001/api/game/new', { credentials: 'include' })
            .then(res => res.json())
            .then(data => setGameInfo(data))
    }, [])

    useEffect(() => {
        fetch('http://localhost:3001/api/connections', { credentials: 'include' })
            .then(res => res.json())
            // shuffle once so the segments are not shown in a predictable order
            .then(data => setConnections(data.sort(() => Math.random() - 0.5)))
    }, [])

    useEffect(() => {
        // When the 90 seconds run out, auto-submit the current route (as if Submit was pressed)
        if (timeLeft === 0) {
            submitRoute()
            return
        }
        const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000)
        return () => clearTimeout(timer)
    }, [timeLeft])

    // Current station (last reached stop): start from startId and walk through the
    // selected segments. Segments are undirected, so at each step we move to the "other end".
    // Because it is derived, undo (removing the last segment) automatically returns to the
    // correct current station with no extra state to keep in sync.
    let currentStation = gameInfo ? gameInfo.start : null
    for (const seg of selectedSegments) {
        if (seg.station1_id === currentStation) currentStation = seg.station2_id
        else if (seg.station2_id === currentStation) currentStation = seg.station1_id
    }

    // Resolve a station id to its name using the loaded connections.
    const stationName = (id) => {
        for (const c of connections) {
            if (c.station1_id === id) return c.station1_name
            if (c.station2_id === id) return c.station2_name
        }
        return id
    }

    const toggleSegment = (connection) => {
        setSelectedSegments(prev => {
            const exists = prev.find(s => s.id === connection.id)
            if (exists) return prev.filter(s => s.id !== connection.id)
            return [...prev, connection]
        })
    }

    // Clear the whole route so the user can start over.
    const resetRoute = () => setSelectedSegments([])

    const filteredConnections = connections.filter(conn =>
        conn.station1_name.toLowerCase().includes(search.toLowerCase()) ||
        conn.station2_name.toLowerCase().includes(search.toLowerCase())
    )

    // Only connections attached to the current station (one of their two ends equals current)
    // are reachable. The last selected segment also touches current, so it stays clickable to undo.
    const isDisabled = (connection) => {
        if (currentStation === null) return true
        return connection.station1_id !== currentStation && connection.station2_id !== currentStation
    }

    return (
        <Container className="mt-4" style={{ maxWidth: '1250px' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="mb-0">Plan Your Route</h2>
                <Badge
                    bg={timeLeft < 20 ? 'danger' : 'primary'}
                    className="d-flex align-items-center"
                    style={{ fontSize: '1.2rem', padding: '0.5rem 0.75rem' }}
                >
                    {timeLeft}s
                </Badge>
            </div>

            {/* Countdown bar mirroring the timer, turns red in the last 20 seconds */}
            <ProgressBar
                now={timeLeft}
                max={90}
                variant={timeLeft < 20 ? 'danger' : 'primary'}
                className="mb-3"
            />

            {gameInfo && (
                <Alert variant="info">
                    From: <strong>{gameInfo.startName}</strong> → To: <strong>{gameInfo.endName}</strong>
                    {currentStation !== null && (
                        <div className="mt-1">
                            Current station: <strong>{stationName(currentStation)}</strong>
                        </div>
                    )}
                </Alert>
            )}

            {/* Tell the user when the route already reaches the destination */}
            {gameInfo && currentStation === gameInfo.end && (
                <Alert variant="success">✓ Destination reached! You can submit your route.</Alert>
            )}

            <Row>
                {/* Left: station map for reference while planning */}
                <Col md={5}>
                    <Card>
                        <Card.Header>Station Map</Card.Header>
                        <Card.Body className="text-center">
                            <img src="/metro_map_wo_stations.png" alt="Station Map"
                                style={{ maxWidth: '100%', display: 'block', margin: '0 auto' }} />
                        </Card.Body>
                    </Card>
                </Col>

                {/* Middle: list of all segments */}
                <Col md={4}>
                    <h5>All Segments</h5>
                    {/* Legend so the user can tell selectable vs unreachable at a glance */}
                    <div className="d-flex gap-3 mb-2 small text-muted">
                        <span><Badge bg="success">&nbsp;</Badge> Selectable</span>
                        <span><Badge bg="primary">&nbsp;</Badge> In route</span>
                        <span><Badge bg="secondary">&nbsp;</Badge> Unreachable</span>
                    </div>
                    <Form.Control
                        className="mb-2"
                        placeholder="Search stations..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    <ListGroup style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        {filteredConnections.map(conn => {
                            const selected = selectedSegments.some(s => s.id === conn.id)
                            const disabled = isDisabled(conn)
                            // Selectable = reachable from current station and not already in the route.
                            const selectable = !disabled && !selected
                            return (
                                <ListGroup.Item
                                    key={conn.id}
                                    action
                                    active={selected}
                                    onClick={() => toggleSegment(conn)}
                                    disabled={disabled}
                                    variant={selectable ? 'success' : undefined}
                                    className="d-flex justify-content-between align-items-center"
                                    style={{ opacity: disabled && !selected ? 0.55 : 1 }}
                                >
                                    <span>{conn.station1_name} — {conn.station2_name}</span>
                                    {selectable && <Badge bg="success">Select →</Badge>}
                                    {selected && <Badge bg="light" text="dark">In route</Badge>}
                                </ListGroup.Item>
                            )
                        })}
                    </ListGroup>
                </Col>

                {/* Right: selected segments */}
                <Col md={3}>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <h5 className="mb-0">Your Route <Badge bg="secondary">{selectedSegments.length}</Badge></h5>
                        <Button
                            size="sm"
                            variant="outline-danger"
                            disabled={selectedSegments.length === 0}
                            onClick={resetRoute}
                        >
                            Reset
                        </Button>
                    </div>
                    {selectedSegments.length === 0 ? (
                        <p className="text-muted">No segments selected yet.</p>
                    ) : (
                        <ListGroup>
                            {selectedSegments.map((seg, index) => {
                                // Only the last segment can be undone so the chain is never broken in the middle.
                                const isLast = index === selectedSegments.length - 1
                                return (
                                    <ListGroup.Item key={seg.id} className="d-flex justify-content-between">
                                        <span>{index + 1}. {seg.station1_name} — {seg.station2_name}</span>
                                        {isLast && (
                                            <Badge
                                                bg="danger"
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => toggleSegment(seg)}
                                            >
                                                ✕
                                            </Badge>
                                        )}
                                    </ListGroup.Item>
                                )
                            })}
                        </ListGroup>
                    )}

                    {/* Submit lives under the selected route so it is always visible */}
                    <Button
                        className="mt-3 w-100"
                        variant="success"
                        disabled={selectedSegments.length === 0}
                        onClick={submitRoute}
                    >
                        Submit Route
                    </Button>
                </Col>
            </Row>
        </Container>
    )
}

export default Planning;
