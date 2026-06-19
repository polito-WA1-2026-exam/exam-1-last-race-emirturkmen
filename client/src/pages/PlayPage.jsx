import { useState } from 'react';
import Setup from '../components/Setup.jsx';
import Planning from '../components/Planning.jsx';
import Execution from '../components/Execution.jsx';

function PlayPage() {
    const [phase, setPhase] = useState('setup')
    const [gameData, setGameData] = useState(null)

    if (phase === 'setup')
        return <Setup onNext={() => setPhase('planning')} />

    if (phase === 'planning')
        return <Planning onNext={(data) => { setGameData(data); setPhase('execution') }} />

    // Execution navigates to the ranking page itself once the journey ends.
    if (phase === 'execution')
        return <Execution gameData={gameData} />
}

export default PlayPage;