import React from 'react';
import './Header.css';

function Header({ title, subtitle }) {
  return (
    <header className="app-header">
      <h1 className="app-title">{title}</h1>
      <div className="app-subtitle">{subtitle}</div>
    </header>
  );
}

export default Header;

