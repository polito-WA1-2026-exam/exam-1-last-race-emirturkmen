import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Setup from '../components/Setup.jsx';
import Planning from '../components/Planning.jsx';
import Execution from '../components/Execution.jsx';
import Result from '../components/Result.jsx';

function PlayPage() {
    const { user, loading } = useAuth()
    const [phase, setPhase] = useState('setup')
    const [gameData, setGameData] = useState(null)
    const [result, setResult] = useState(null)   // { valid, score } from Execution
    const [gameInfo, setGameInfo] = useState(null)
    const [gameInfoError, setGameInfoError] = useState(false)
    const [segments, setSegments] = useState([])
    const [gameResult, setGameResult] = useState(null)
    const [executionError, setExecutionError] = useState(false)

    // Wait for the session check before deciding, so we don't bounce a logged-in user
    if (loading)
        return null

    // Block direct URL access: send guests to the login page
    if (!user)
        return <Navigate to="/login" />

    const startGame = () => {
        setGameInfo(null)
        setSegments([])
        setGameInfoError(false)
        setPhase('planning')

        Promise.all([
            fetch('http://localhost:3001/api/game/new', { credentials: 'include' }).then(res => {
                if (!res.ok) throw new Error('Could not start game')
                return res.json()
            }),
            fetch('http://localhost:3001/api/segments', { credentials: 'include' }).then(res => {
                if (!res.ok) throw new Error('Could not load segments')
                return res.json()
            })
        ])
            .then(([gameInfoData, segmentsData]) => {
                setGameInfo(gameInfoData)
                setSegments(segmentsData.sort(() => Math.random() - 0.5))
            })
            .catch(() => setGameInfoError(true))
    }

    const submitRouteData = (data) => {
        setGameData(data)
        setGameResult(null)
        setExecutionError(false)
        setPhase('execution')

        fetch('http://localhost:3001/api/games', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                startId: data.gameInfo.start,
                endId: data.gameInfo.end,
                segments: data.segments.map(s => s.id)
            })
        })
            .then(res => {
                if (!res.ok) throw new Error('Could not submit game')
                return res.json()
            })
            .then(resData => {
                if (!resData.valid) {
                    setResult({ valid: false, score: 0 })
                    setPhase('result')
                } else {
                    setGameResult(resData)
                }
            })
            .catch(() => setExecutionError(true))
    }

    if (phase === 'setup')
        return <Setup onNext={startGame} />

    if (phase === 'planning')
        return (
            <Planning
                gameInfo={gameInfo}
                gameInfoError={gameInfoError}
                segments={segments}
                onNext={submitRouteData}
            />
        )

    if (phase === 'execution')
        return (
            <Execution
                gameData={gameData}
                gameResult={gameResult}
                executionError={executionError}
                onFinish={(r) => {
                    setResult(r)
                    setPhase('result')
                }}
            />
        )

    // Play Again resets the state back to the start (works because it stays on /play).
    if (phase === 'result')
        return <Result result={result} gameInfo={gameData.gameInfo} onRestart={() => setPhase('setup')} />
}

export default PlayPage;
