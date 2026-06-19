import { Container, Button } from 'react-bootstrap';

function Setup({ onNext }) {
    return (
        <Container className="mt-4" style={{ maxWidth: '700px' }}>
            <h2>Network Map</h2>
            <p>Study the network carefully before planning your route.</p>
            <img src="/metro_map.png" alt="Metro Map" style={{
                maxWidth: '100%',  // Ekrandan dışarı taşmasını engeller
                height: 'auto',     // Oranının (aspect ratio) bozulmasını engeller
                display: 'block'    // Altındaki boşlukları temizler
            }} />

            <Button className="mt-4" onClick={onNext}>
                Ready to Play
            </Button>
        </Container>
    )
}

export default Setup;