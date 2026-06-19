import { useState, useEffect } from 'react';
import { Container, Table, Alert, Button } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

function RankingPage() {
    const [ranking, setRanking] = useState([])  // ranking list
    const location = useLocation()
    // Score of the game the user just finished, passed when navigating here from Execution.
    const lastScore = location.state?.lastScore

    useEffect(() => {
        // runs when the page is mounted
        fetch('http://localhost:3001/api/ranking', {
            credentials: 'include'
        })
            .then(res => res.json())
            .then(data => setRanking(data))
    }, [])  // [] = run only once

    return (
        <Container className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
                <h2 className="mb-0">Ranking</h2>
                <Button as={Link} to="/play">Play Again</Button>
            </div>
            {lastScore !== undefined && (
                <Alert variant={lastScore > 0 ? 'success' : 'danger'}>
                    Your last game scored <strong>{lastScore} coins</strong>.
                </Alert>
            )}
            <Table striped bordered>
                <thead>
                <tr>
                    <th>#</th>
                    <th>Username</th>
                    <th>Best Score</th>
                </tr>
                </thead>
                <tbody>
                {ranking.map((row, index) => (
                    <tr key={row.user_id}>
                        <td>{index + 1}</td>
                        <td>{row.user_username}</td>
                        <td>{row.user_max_score}</td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </Container>
    );
}
export default RankingPage