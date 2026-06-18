import { useState, useEffect } from 'react';
import { Container, Table } from 'react-bootstrap';

function RankingPage() {
    const [ranking, setRanking] = useState([])  // ranking list

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
            <h2>Ranking</h2>
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