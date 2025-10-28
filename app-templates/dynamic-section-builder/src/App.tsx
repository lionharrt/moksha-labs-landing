import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { VariantProvider } from './contexts/VariantContext';
import { ThemeWrapper } from './components/ThemeWrapper';
import DevToolbar from './components/DevToolbar';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import { YourCompanyHomePage } from './pages/YourCompanyHomePage';
import './App.css';

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <VariantProvider>
        <ThemeWrapper>
          <Router>
            <div className="App">
              <Navigation />
              <main className="scroll-snap-container h-screen overflow-y-auto overflow-x-hidden">
                <Routes>
                  <Route path="/" element={<YourCompanyHomePage />} />
                </Routes>
                <Footer />
              </main>
              <DevToolbar />
            </div>
          </Router>
        </ThemeWrapper>
      </VariantProvider>
    </HelmetProvider>
  );
};

export default App;

