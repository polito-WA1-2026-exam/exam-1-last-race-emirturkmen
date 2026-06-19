import { useState } from 'react';
import Setup from '../components/Setup.jsx';
import Planning from '../components/Planning.jsx';
import Execution from '../components/Execution.jsx';
import Result from '../components/Result.jsx';

function PlayPage() {
    const [phase, setPhase] = useState('setup')
    const [gameData, setGameData] = useState(null)
    const [score, setScore] = useState(0)

    if (phase === 'setup')
        return <Setup onNext={() => setPhase('planning')} />

    if (phase === 'planning')
        return <Planning onNext={(data) => { setGameData(data); setPhase('execution') }} />

    if (phase === 'execution')
        return <Execution gameData={gameData} onNext={(data) => { setScore(data.score); setPhase('result') }} />

    if (phase === 'result')
        return <Result score={score} onRestart={() => setPhase('setup')} />
}

export default PlayPage;