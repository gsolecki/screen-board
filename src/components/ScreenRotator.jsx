import React, { useState, useEffect } from 'react';
import { Concessions, KCCStandings, KCCSchedule } from './slides/Slides';
import './ScreenRotator.css';

const ROTATION_INTERVAL = 10000; // 10 seconds
const FADE_DURATION = 250; // 1 second fade in/out (in milliseconds)
const VIEWS = ['concessions', 'kcc-standings', 'kcc-schedule'];

function ScreenRotator() {
  const [currentViewIndex, setCurrentViewIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

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
          break;
        case ' ':
          e.preventDefault();
          setIsPaused(prev => !prev);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

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
  }, [isPaused]);

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
    </div>
  );
}

export default ScreenRotator;
