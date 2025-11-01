import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Concessions, KCCStandings, KCCSchedule } from './slides/Slides';
import './ScreenRotator.css';

const ROTATION_INTERVAL = 10000; // 10 seconds
const FADE_DURATION = 250; // 1 second fade in/out (in milliseconds)
const VIEWS = ['concessions', 'kcc-standings', 'kcc-schedule'];

function ScreenRotator() {
  const [currentViewIndex, setCurrentViewIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [rotationKey, setRotationKey] = useState(0); // Used to reset the rotation timer
  const [showHelp, setShowHelp] = useState(false); // Help modal state
  const navigate = useNavigate();

  // Handle keyboard controls
  useEffect(() => {
    const handleKeyPress = (e) => {
      switch(e.key) {
        case 'ArrowLeft':
          setIsVisible(false);
          setTimeout(() => {
            setCurrentViewIndex(prev => (prev > 0 ? prev - 1 : VIEWS.length - 1));
            // Use requestAnimationFrame to ensure view changes before fade-in starts
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                setIsVisible(true);
              });
            });
          }, FADE_DURATION / 2);
          // Reset the auto-rotation timer
          setRotationKey(prev => prev + 1);
          break;
        case 'ArrowRight':
          setIsVisible(false);
          setTimeout(() => {
            setCurrentViewIndex(prev => (prev < VIEWS.length - 1 ? prev + 1 : 0));
            // Use requestAnimationFrame to ensure view changes before fade-in starts
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                setIsVisible(true);
              });
            });
          }, FADE_DURATION / 2);
          // Reset the auto-rotation timer
          setRotationKey(prev => prev + 1);
          break;
        case ' ':
          e.preventDefault();
          setIsPaused(prev => !prev);
          break;
        case '/':
          e.preventDefault();
          setShowHelp(prev => !prev);
          break;
        case 'Escape':
          setShowHelp(false);
          break;
        case 'a':
        case 'A':
          navigate('/admin/kcc/standings');
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [navigate]);

  // Handle auto-rotation
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentViewIndex(prev => (prev < VIEWS.length - 1 ? prev + 1 : 0));
        // Use requestAnimationFrame to ensure view changes before fade-in starts
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setIsVisible(true);
          });
        });
      }, FADE_DURATION / 2);
    }, ROTATION_INTERVAL);

    return () => clearInterval(interval);
  }, [isPaused, rotationKey]); // Adding rotationKey here resets timer when it changes

  // Controls overlay
  const Controls = () => (
    <div className={`controls ${isPaused ? 'paused' : ''}`}>
      <div className="control-hint left">← Previous</div>
      <div className="control-hint space">{isPaused ? '▶️ Press Space to Resume' : '⏸️ Press Space to Pause'}</div>
      <div className="control-hint right">Next →</div>
    </div>
  );

  const style = {
    opacity: isVisible ? 1 : 0,
    transition: `opacity ${FADE_DURATION}ms ease-in-out`
  };

  const renderCurrentView = () => {
    switch(currentViewIndex) {
      case 0:
        return <Concessions />;
      case 1:
        return <KCCStandings />;
      case 2:
        return <KCCSchedule />;
      default:
        return <Concessions />;
    }
  };

  return (
    <div style={style}>
      {renderCurrentView()}
      <Controls />

      {/* Help modal */}
      {showHelp && (
        <div className="help-modal-overlay" onClick={() => setShowHelp(false)}>
          <div className="help-modal" onClick={(e) => e.stopPropagation()}>
            <button className="help-close" onClick={() => setShowHelp(false)}>×</button>
            <h2>Keyboard Shortcuts</h2>
            <div className="help-content">
              <div className="help-section">
                <h3>Navigation</h3>
                <div className="help-item">
                  <kbd>←</kbd>
                  <span>Previous slide</span>
                </div>
                <div className="help-item">
                  <kbd>→</kbd>
                  <span>Next slide</span>
                </div>
                <div className="help-item">
                  <kbd>Space</kbd>
                  <span>Pause/Resume auto-rotation</span>
                </div>
                <div className="help-item">
                  <kbd>/</kbd>
                  <span>Show/Hide this help</span>
                </div>
                <div className="help-item">
                  <kbd>Esc</kbd>
                  <span>Close this help</span>
                </div>
              </div>

              <div className="help-section">
                <h3>Admin</h3>
                <div className="help-item">
                  <kbd>A</kbd>
                  <span>Open Admin Panel</span>
                </div>
              </div>

              <div className="help-section">
                <h3>Auto-Rotation</h3>
                <div className="help-info">
                  <p>Slides automatically rotate every <strong>{ROTATION_INTERVAL / 1000} seconds</strong></p>
                  <p>Manual navigation resets the timer to give you more time to view the slide</p>
                </div>
              </div>

              <div className="help-section">
                <h3>Slides</h3>
                <div className="help-info">
                  <ol>
                    <li>Concessions - Menu and pricing</li>
                    <li>KCC Standings - Group phase standings</li>
                    <li>KCC Schedule - Match schedule</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ScreenRotator;
