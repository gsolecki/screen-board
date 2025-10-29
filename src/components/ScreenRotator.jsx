import React, { useState, useEffect } from 'react';
import Concessions from './Concessions';
import KnoxCountyCup from './KnoxCountyCup';
import './ScreenRotator.css';

const ROTATION_INTERVAL = 10000; // 10 seconds
const VIEWS = ['concessions', 'kcc'];

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
            setIsVisible(true);
          }, 1000);
          break;
        case 'ArrowRight':
          setIsVisible(false);
          setTimeout(() => {
            setCurrentViewIndex(prev => (prev < VIEWS.length - 1 ? prev + 1 : 0));
            setIsVisible(true);
          }, 1000);
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
        setIsVisible(true);
      }, 1000);
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
    transition: 'opacity 1s ease-in-out'
  };

  return (
    <div style={style}>
      {currentViewIndex === 0 ? <Concessions /> : <KnoxCountyCup />}
      <Controls />
    </div>
  );
}

export default ScreenRotator;
