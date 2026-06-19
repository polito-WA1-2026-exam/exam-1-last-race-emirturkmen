import { useState, useEffect } from 'react';
import { Container, Button, ListGroup } from 'react-bootstrap';

function Setup({ onNext }) {
    const [network, setNetwork] = useState([])

    useEffect(() => {
        fetch('http://localhost:3001/api/network', {
            credentials: 'include'
        })
            .then(res => res.json())
            .then(data => setNetwork(data))
    }, [])

    return (
        <Container className="mt-4" style={{ maxWidth: '700px' }}>
            <h2>Network Map</h2>
            <p>Study the network carefully before planning your route.</p>

            {network.map(line => (
                <div key={line.id} className="mb-3">
                    <h5>{line.name}</h5>
                    <ListGroup horizontal>
                        {line.stations.map((station, index) => (
                            <ListGroup.Item key={station.id}>
                                {station.name}
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </div>
            ))}

            <Button className="mt-4" onClick={onNext}>
                Ready to Play
            </Button>
        </Container>
    )
}

export default Setup;