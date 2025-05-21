import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import './Navbar.css';
import GcashModal from './GcashModal';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
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

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
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
            <Link to="/about" className="menu-link" onClick={toggleMenu}>About</Link>
            <Link to="/contact" className="menu-link" onClick={toggleMenu}>Contact</Link>
          </div>
          <div className="menu-footer">
            <p>© 2024 BERNARD o-7</p>
            <div className="social-links">
              <a href="#"  onClick={toggleModal} >Donate Us</a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
              <a href="https://www.facebook.com/legendoffarleo" target="_blank" rel="noopener noreferrer">Facebook</a>
            </div>
          </div>
        </div>
      </div>
      <GcashModal isOpen={isModalOpen} onClose={toggleModal} />
    </>
  );
};

export default Navbar;