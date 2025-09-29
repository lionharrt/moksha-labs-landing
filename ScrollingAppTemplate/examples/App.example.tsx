/**
 * Example App Implementation
 * 
 * This is a complete example showing how to use the ScrollingAppTemplate.
 * Copy this structure to create your own scrolling single-page application.
 */

import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../context';
import { Navigation, Section, ScrollProgress } from '../components';
import '../styles/scrolling.css';
import '../styles/theme.css';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <div className="scroll-snap-container">
          {/* Navigation bar - automatically tracks active section */}
          <Navigation />
          
          {/* Scroll progress indicator */}
          <ScrollProgress />

          {/* Hero Section */}
          <Section
            id="home"
            background="dark"
            layout="hero"
            padding="none"
            animation="fade"
            height="screen"
          >
            <div className="text-white">
              <h1 className="text-5xl font-bold mb-4">Welcome to Your App</h1>
              <p className="text-xl text-gray-300">
                Built with the Scrolling App Template
              </p>
            </div>
          </Section>

          {/* About Section */}
          <Section
            id="about"
            background="gradient"
            layout="center"
            animation="slide"
            height="screen"
          >
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                About Section
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300">
                Add your content here. The section will automatically handle
                animations, scroll snapping, and responsive behavior.
              </p>
            </div>
          </Section>

          {/* Features Section */}
          <Section
            id="features"
            background="light"
            layout="grid"
            animation="fade"
            height="screen"
          >
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-12 text-center">
                Features
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="p-6 bg-white dark:bg-neutral-700 rounded-lg shadow-lg">
                  <h3 className="text-xl font-bold mb-4">Feature 1</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Description of feature 1
                  </p>
                </div>
                <div className="p-6 bg-white dark:bg-neutral-700 rounded-lg shadow-lg">
                  <h3 className="text-xl font-bold mb-4">Feature 2</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Description of feature 2
                  </p>
                </div>
                <div className="p-6 bg-white dark:bg-neutral-700 rounded-lg shadow-lg">
                  <h3 className="text-xl font-bold mb-4">Feature 3</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Description of feature 3
                  </p>
                </div>
              </div>
            </div>
          </Section>

          {/* Contact Section */}
          <Section
            id="contact"
            background="dark"
            layout="center"
            animation="fade"
            height="screen"
          >
            <div className="max-w-4xl mx-auto text-center text-white">
              <h2 className="text-4xl font-bold mb-6">Get In Touch</h2>
              <p className="text-xl text-gray-300 mb-8">
                Contact section content goes here
              </p>
            </div>
          </Section>
        </div>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
