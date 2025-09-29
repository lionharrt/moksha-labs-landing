import React, { useEffect, useState } from 'react';
import './IntroSplash.css';

export const IntroSplash: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section id="intro_splash" className="intro-splash">
      <div className={`halo ${isVisible ? 'fade-in' : ''}`} />
      <h1 className={`logo ${isVisible ? 'fade-up' : ''}`}>
        Moksha Labs
      </h1>
    </section>
  );
};
