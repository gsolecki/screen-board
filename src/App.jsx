import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ScreenRotator from './components/ScreenRotator'
import KCCStandingsAdmin from './components/admin/KCCStandingsAdmin'

export default function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<ScreenRotator />} />
          <Route path="/admin/kcc/standings" element={<KCCStandingsAdmin />} />
        </Routes>
      </div>
    </Router>
  )
}
