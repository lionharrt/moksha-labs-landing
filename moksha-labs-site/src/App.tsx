import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './context';
import { Section, ScrollProgress } from './components';
import { IntroSplash } from './sections/IntroSplash';
import { HorizontalTrack } from './sections/HorizontalTrack';
import './App.css';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <div className="scroll-snap-container">
          <ScrollProgress />

          {/* Intro Splash Section */}
          <IntroSplash />

          {/* Horizontal Track Section */}
          <HorizontalTrack />

          {/* About Section */}
          <Section id="about" background="light" height="auto">
            <div className="about-section">
              <h2 className="about-title">
                Who we <span className="italic-highlight">really</span> are
              </h2>
              <div className="about-columns">
                <div className="about-column">
                  <p>
                    At <strong>Moksha Labs</strong>, we're a small but mighty crew, driven by a shared passion for helping <strong>ambitious</strong> small to medium-sized businesses and startups <strong>reach</strong> their <strong>digital potential</strong>. We thrive on the challenge of creating <strong>original</strong>, <strong>high-impact</strong> work that truly moves the needle.
                  </p>
                </div>
                <div className="about-column">
                  <p>
                    What sets us apart? We're not about cookie-cutter solutions. Every project we take on is <strong>custom-tailored</strong> to fit your specific <strong>needs</strong> and <strong>dreams</strong>. We immerse ourselves in your business, becoming an extension of your team to <strong>craft</strong> strategies that <strong>deliver</strong> tangible results, all while keeping a close eye on <strong>timely delivery</strong>.
                  </p>
                </div>
              </div>
              <div className="about-bottom">
                <p>
                  We're here to help you grow, in a way that feels authentic and works perfectly for you. Let's connect and see what we can achieve together!
                </p>
              </div>
            </div>
          </Section>

          {/* Services Section */}
          <Section id="services" background="light" layout="center">
            <div className="services-section">
              <h2 className="services-title">What we do</h2>
              <div className="services-grid">
                <div className="service-card">
                  <h3>Web Development</h3>
                  <p>Custom websites that combine aesthetics with performance.</p>
                </div>
                <div className="service-card">
                  <h3>CRM Solutions</h3>
                  <p>Streamlined systems to help you manage clients efficiently.</p>
                </div>
                <div className="service-card">
                  <h3>Chatbots & Automation</h3>
                  <p>Smart bots and flows to save time and scale support.</p>
                </div>
                <div className="service-card">
                  <h3>Brand Identity</h3>
                  <p>Logos, palettes, and typography that define your story.</p>
                </div>
                <div className="service-card">
                  <h3>Brand Implementation</h3>
                  <p>Consistent roll-out of your brand across every channel.</p>
                </div>
              </div>
            </div>
          </Section>

          {/* Contact Section */}
          <Section id="contact" background="dark">
            <div className="contact-section">
              <h2 className="contact-title">Let's talk</h2>
              <form className="contact-form">
                <input type="text" placeholder="Your Name" className="form-input" />
                <input type="email" placeholder="Email" className="form-input" />
                <textarea placeholder="Project Brief" className="form-textarea" rows={6} />
                <button type="submit" className="form-submit">Get In Touch</button>
              </form>
            </div>
          </Section>

          {/* Footer */}
          <Section id="footer" background="dark" height="auto" padding="medium">
            <div className="footer-section">
              <div className="footer-left">© 2025 Moksha Labs — All rights reserved.</div>
              <div className="footer-right">
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
              </div>
            </div>
          </Section>
        </div>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;