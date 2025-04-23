import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Gallery from './components/Gallery';
import ArtworkDetail from './components/ArtworkDetail';
import Navbar from './components/Navbar';
import Cursor from './components/Cursor';
import About from './components/about';
import Contact from './components/contact';
import IntroAnimation from './components/IntroAnimation';
import './App.css';

function App() {
  const [showIntro, setShowIntro] = useState(!sessionStorage.getItem('hasIntroPlayed'));

  const handleIntroComplete = () => {
    sessionStorage.setItem('hasIntroPlayed', 'true');
    setShowIntro(false);
  };

  return (
    <Router>
      <div className="app">
       <Cursor/>
        <Navbar />
          <Routes>
            <Route 
              path="/" 
              element={
                showIntro 
                ? <IntroAnimation onAnimationComplete={handleIntroComplete} /> 
                : <Gallery /> 
              } 
            />
          <Route path="/artwork/:id" element={<ArtworkDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;