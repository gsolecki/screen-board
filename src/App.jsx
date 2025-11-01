import './App.css'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import ScreenRotator from './components/ScreenRotator'
import KCCStandingsAdmin from './components/admin/KCCStandingsAdmin'
import ConcessionsAdmin from './components/admin/ConcessionsAdmin'

function AppContent() {
  const location = useLocation();
  const isDisplayRoute = location.pathname === '/';

  // Manage body overflow based on route
  useEffect(() => {
    if (isDisplayRoute) {
      // Lock scrolling for main display
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      // Allow scrolling for admin pages
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
    }

    // Cleanup
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isDisplayRoute]);

  return (
    <div className={`app ${isDisplayRoute ? 'display-locked' : ''}`}>
      <Routes>
        <Route path="/" element={<ScreenRotator />} />
        <Route path="/admin/kcc/standings" element={<KCCStandingsAdmin />} />
        <Route path="/admin/concessions" element={<ConcessionsAdmin />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}
