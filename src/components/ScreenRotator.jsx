import React, { useState, useEffect } from 'react';
import Concessions from './Concessions';
import KnoxCountyCup from './KnoxCountyCup';

const ROTATION_INTERVAL = 10000; // 10 seconds

function ScreenRotator() {
  const [currentScreen, setCurrentScreen] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      // Start fade out
      setIsVisible(false);

      // Wait for fade out, then change screen
      setTimeout(() => {
        setCurrentScreen((current) => (current === 0 ? 1 : 0));
        setIsVisible(true);
      }, 1000); // Match the CSS animation duration
    }, ROTATION_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  const style = {
    opacity: isVisible ? 1 : 0,
    transition: 'opacity 1s ease-in-out'
  };

  return (
    <div style={style}>
      {currentScreen === 0 ? <Concessions /> : <KnoxCountyCup />}
    </div>
  );
}

export default ScreenRotator;
