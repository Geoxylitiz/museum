import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import './Navbar.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);
  
  // Handle menu animation
  useEffect(() => {
    if (menuOpen) {
      // Animate menu open
      gsap.to('.menu-overlay', {
        duration: 0.6,
        opacity: 1,
        y: 0,
        ease: 'power3.out',
        visibility: 'visible'
      });
      
      gsap.to('.menu-link', {
        duration: 0.8,
        opacity: 1,
        y: 0,
        stagger: 0.1,
        ease: 'power3.out',
        delay: 0.3
      });
    } else {
      // Animate menu close
      gsap.to('.menu-link', {
        duration: 0.4,
        opacity: 0,
        y: -20,
        stagger: 0.05,
        ease: 'power3.in'
      });
      
      gsap.to('.menu-overlay', {
        duration: 0.5,
        opacity: 0,
        y: -50,
        ease: 'power3.in',
        delay: 0.3,
        onComplete: () => {
          gsap.set('.menu-overlay', { visibility: 'hidden' });
        }
      });
    }
  }, [menuOpen]);
  
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  
  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <Link to="/" className="nav-logo">TEAM 0-7</Link>
          <button className={`menu-toggle ${menuOpen ? 'active' : ''}`} onClick={toggleMenu}>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>
      
      <div className="menu-overlay">
        <div className="menu-content">
          <div className="menu-links">
            <Link to="/" className="menu-link" onClick={toggleMenu}>Home</Link>
            <Link to="/projects" className="menu-link" onClick={toggleMenu}>Projects</Link>
            <Link to="/about" className="menu-link" onClick={toggleMenu}>About</Link>
            <Link to="/approach" className="menu-link" onClick={toggleMenu}>Approach</Link>
            <Link to="/contact" className="menu-link" onClick={toggleMenu}>Contact</Link>
          </div>
          <div className="menu-footer">
            <p>© 2024 Powerhouse Gallery</p>
            <div className="social-links">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;