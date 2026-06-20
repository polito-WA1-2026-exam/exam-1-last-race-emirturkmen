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

    // Wait for the session check before deciding, so we don't bounce a logged-in user
    if (loading)
        return null

    // Block direct URL access: send guests to the login page
    if (!user)
        return <Navigate to="/login" />

    if (phase === 'setup')
        return <Setup onNext={() => setPhase('planning')} />

    if (phase === 'planning')
        return <Planning onNext={(data) => { setGameData(data); setPhase('execution') }} />

    if (phase === 'execution')
        return <Execution gameData={gameData} onFinish={(r) => { setResult(r); setPhase('result') }} />

    // Play Again resets the state back to the start (works because it stays on /play).
    if (phase === 'result')
        return <Result result={result} gameInfo={gameData.gameInfo} onRestart={() => setPhase('setup')} />
}

export default PlayPage;
