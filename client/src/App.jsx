import { Routes, Route } from 'react-router-dom'
import NavigationBar from './components/NavigationBar'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import PlayPage from './pages/PlayPage'
import RankingPage from './pages/RankingPage'

function App() {
  return (
      // navbar padding in the top for all pages
      <>
          <NavigationBar />
          <div style={{paddingTop: '50px'}}>
              <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/play" element={<PlayPage />} />
                  <Route path="/ranking" element={<RankingPage />} />
              </Routes>
          </div>
      </>
  )
}

export default App