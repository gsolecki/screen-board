import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './AdminNav.css';

const AdminNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (isAdminRoute) {
    return null; // Don't show on admin pages
  }

  return (
    <>
      <button
        className="admin-nav-toggle"
        onClick={() => setIsOpen(!isOpen)}
        title="Toggle Admin Menu"
      >
        ⚙️
      </button>

      {isOpen && (
        <div className="admin-nav-menu">
          <div className="admin-nav-header">
            <h3>Admin Panel</h3>
            <button onClick={() => setIsOpen(false)}>✕</button>
          </div>
          <nav className="admin-nav-links">
            <Link to="/admin/kcc/standings" onClick={() => setIsOpen(false)}>
              📊 KCC Standings Manager
            </Link>
            <Link to="/" onClick={() => setIsOpen(false)}>
              🏠 Back to Display
            </Link>
          </nav>
        </div>
      )}

      {isOpen && (
        <div
          className="admin-nav-overlay"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default AdminNav;

