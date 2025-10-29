import React from 'react';
import './Footer.css';

function Footer({ leftContent, centerContent, rightContent }) {
  return (
    <div className="app-footer">
      <div className="footer-section footer-left">
        {leftContent}
      </div>
      <div className="footer-section footer-center">
        {centerContent}
      </div>
      <div className="footer-section footer-right">
        {rightContent}
      </div>
    </div>
  );
}

export default Footer;

