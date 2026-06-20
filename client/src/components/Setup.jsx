import { Container, Button, Card } from 'react-bootstrap';

function Setup({ onNext }) {
    return (
        <Container className="mt-4" style={{ maxWidth: '700px' }}>
            {/* Heading on the left, action button on the right */}
            <div className="d-flex justify-content-between align-items-center">
                <h2 className="mb-0">Network Map</h2>
                <Button onClick={onNext}>
                    Ready to Play
                </Button>
            </div>
            <p className="mt-2">Study the network carefully before planning your route.</p>

            <Card className="mb-4">
                <Card.Body className="text-center">
                    <img src="/metro_map.png" alt="Metro Map" style={{
                        maxWidth: '100%',  // keeps the image inside the screen
                        height: 'auto',    // keeps the aspect ratio
                        display: 'block'   // removes the gap under the image
                    }} />
                </Card.Body>
            </Card>
        </Container>
    )
}

export default Setup;
