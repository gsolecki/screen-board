import React from 'react';
import './SlideLayout.css';
import Header from './Header';
import Footer from './Footer';

/**
 * Common layout wrapper for all slide components
 * Provides consistent Header/Content/Footer structure
 */
function SlideLayout({
  className,
  title,
  subtitle,
  children,
  footerLeft = null,
  footerCenter = null,
  footerRight = null
}) {
  // Default to help hint if no left content provided
  const defaultFooterLeft = footerLeft || <span className="help-hint-footer">Press / for help</span>;

  return (
    <div className={`slide-layout ${className || ''}`}>
      <Header title={title} subtitle={subtitle} />
      {children}
      <Footer
        leftContent={defaultFooterLeft}
        centerContent={footerCenter}
        rightContent={footerRight}
      />
    </div>
  );
}

export default SlideLayout;

