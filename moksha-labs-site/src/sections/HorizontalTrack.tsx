import React, { useRef, useEffect } from 'react';
import './HorizontalTrack.css';

export const HorizontalTrack: React.FC = () => {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (trackRef.current) {
        const rect = trackRef.current.getBoundingClientRect();
        const scrollProgress = Math.max(0, -rect.top) / (rect.height - window.innerHeight);
        const panels = trackRef.current.querySelectorAll('.panel');
        panels.forEach((panel, index) => {
          const element = panel as HTMLElement;
          element.style.transform = `translateX(-${scrollProgress * 100 * panels.length}%)`;
        });
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div id="horizontal_track" className="horizontal-track-wrapper" ref={trackRef}>
      <nav className="horizontal-nav">
        <div className="nav-logo">Moksha Labs</div>
        <ul className="nav-menu">
          <li><a href="#intro_splash">Home</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#services">Services</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
        <button className="nav-cta">Get In Touch</button>
      </nav>

      <div className="horizontal-track">
        <div className="panels-container">
          {/* Panel 1: Hero */}
          <div className="panel panel-hero">
            <h2 className="hero-headline">
              We create cutting-edge digital experiences where stories, design, and technology unite.
            </h2>
          </div>

          {/* Panel 2: Grid */}
          <div className="panel panel-grid">
            <div className="grid-tiles">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="grid-tile">
                  <div className="tile-content">Image {i + 1}</div>
                </div>
              ))}
            </div>
            <div className="grid-overlay">
              <p className="grid-text">
                From ancient myths to digital media, storytelling is the timeless art that shapes our future.
              </p>
            </div>
          </div>

          {/* Panel 3: Manifesto */}
          <div className="panel panel-manifesto">
            <p className="manifesto-text">
              Stories have always shaped how we see the world—but today, technology lets us live them. 
              At Moksha Labs, we specialize in creating immersive experiences where audiences step inside the story. 
              Whether it's branding, digital design, apps, websites, chatbots, or social media, we transform visions 
              into interactive realities—where creativity and technology move as one.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
