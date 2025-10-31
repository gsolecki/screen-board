import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ScreenRotator from './components/ScreenRotator'
import KCCStandingsAdmin from './components/admin/KCCStandingsAdmin'
import AdminNav from './components/common/AdminNav'

export default function App() {
  return (
    <Router>
      <div className="app">
        <AdminNav />
        <Routes>
          <Route path="/" element={<ScreenRotator />} />
          <Route path="/admin/kcc/standings" element={<KCCStandingsAdmin />} />
        </Routes>
      </div>
    </Router>
  )
}
