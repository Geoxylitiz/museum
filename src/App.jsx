import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Gallery from './components/Gallery';
import ArtworkDetail from './components/ArtworkDetail';
import Navbar from './components/Navbar';
import Cursor from './components/Cursor';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
       <Cursor/>
        <Navbar />
        <Routes>
          <Route path="/" element={<Gallery />} />
          <Route path="/artwork/:id" element={<ArtworkDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;