import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { artworks } from '../data/artwork';
import './Gallery.css';
import { useLocomotive } from '../hooks/useLocomotive';
import gsap from 'gsap';

const Gallery = () => {
  const scrollRef = useRef(null);
  const introRef = useRef(null);
  const titleRef = useRef(null);
  const imagesRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const locoInstance = useLocomotive(scrollRef);
  
  const Artworkz = [...artworks].sort();

  useEffect(() => {
    // Trigger initial animation sequence
    const timer = setTimeout(() => {
      setLoaded(true);
      
      // Initialize GSAP animations after frames slide in
      const textAnimationTimer = setTimeout(() => {
        if (titleRef.current && imagesRef.current) {
          // Floating particles animation
          const particlesContainer = document.querySelector('.particles-container');
          if (particlesContainer) {
            const particles = particlesContainer.querySelectorAll('.particle');
            
            particles.forEach((particle) => {
              gsap.to(particle, {
                x: gsap.utils.random(-100, 100),
                y: gsap.utils.random(-100, 100),
                opacity: gsap.utils.random(0.3, 0.8),
                duration: gsap.utils.random(2, 6),
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
              });
            });
          }
          
          // Additional animation for the gallery name
          const titleLines = titleRef.current.querySelectorAll('.title-line');
          gsap.to(titleLines, {
            scale: 1.02,
            duration: 6,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
          });
          
          // Floating artwork images animation
          const introImages = imagesRef.current.querySelectorAll('.intro-image');
          introImages.forEach((image) => {
            gsap.to(image, {
              y: gsap.utils.random(-15, 15),
              x: gsap.utils.random(-10, 10),
              duration: gsap.utils.random(3, 6),
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut"
            });
          });
        }
      }, 1500);
      
      return () => clearTimeout(textAnimationTimer);
    }, 300);
    
    // Set animation as complete after intro finishes
    const completionTimer = setTimeout(() => {
      setAnimationComplete(true);
      
      // Update locomotive scroll after animation completes
      if (locoInstance) {
        setTimeout(() => {
          locoInstance.update();
        }, 500);
      }
    }, 6000); // Extended animation time
    
    return () => {
      clearTimeout(timer);
      clearTimeout(completionTimer);
    };
  }, [locoInstance]);

  return (
    <>
      {/* Intro animation sequence */}
      <div 
        ref={introRef}
        className={`intro-animation ${loaded ? 'active' : ''} ${animationComplete ? 'completed' : ''}`}
      >
        <div className="intro-backdrop"></div>
        
        {/* Animated pattern overlay */}
        <div className="pattern-overlay">
          <svg className="pattern-svg" width="100%" height="100%" preserveAspectRatio="none">
            <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1"></path>
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid-pattern)"></rect>
          </svg>
        </div>
        
        {/* Floating particles */}
        <div className="particles-container">
          {[...Array(30)].map((_, i) => (
            <div key={i} className="particle"></div>
          ))}
        </div>
        
        <div className="intro-frames">
          <div className="frame frame-1"></div>
          <div className="frame frame-2"></div>
          <div className="frame frame-3"></div>
        </div>
        
        <div className="intro-content">
          {/* Gallery name with perspective effect */}
          <div className="intro-title-container">
            <div className="perspective-wrapper">
              <div ref={titleRef} className="intro-title">
                <div className="title-line">
                  <span className="letter-animation">T</span>
                  <span className="letter-animation">E</span>
                  <span className="letter-animation">A</span>
                  <span className="letter-animation">M</span>
                </div>
                <div className="title-line">
                  <span className="letter-animation">O</span>
                  <span className="letter-animation">-</span>
                  <span className="letter-animation">7</span>
                </div>
                
                {/* Highlight effect */}
                <div className="title-highlight"></div>
              </div>
            </div>
          </div>
          
          {/* Tagline with split word animation */}
          <div className="intro-subtitle">
            <span className="word-animation">Where</span>
            <span className="word-animation">Art</span>
            <span className="word-animation">Meets</span>
            <span className="word-animation">Vision</span>
          </div>
          
          {/* Decorative line */}
          <div className="decorative-line"></div>
          
          {/* Featured artwork images with parallax effect */}
          <div ref={imagesRef} className="intro-images">
            {Artworkz.slice(0, 3).map((art, index) => (
              <div key={index} className={`intro-image intro-image-${index + 1}`}>
                <div className="image-frame"></div>
                <img src={art.thumbnailUrl} alt="" />
                <div className="image-caption">
                  <span className="caption-text">{art.title}</span>
                </div>
              </div>
            ))}
          </div>
          
          {/* Scroll indicator */}
          <div className="scroll-indicator">
            <span>explore</span>
            <div className="scroll-arrow"></div>
          </div>
        </div>
      </div>

      {/* Main gallery content */}
      <div className="scroll-container" ref={scrollRef} data-scroll-container>
        <div className={`gallery-container ${loaded ? 'fade-in' : ''}`} data-scroll-section>
          <div className="gallery-header" data-scroll data-scroll-speed="1">
            <h1>TEAM O-7 GALLERY</h1>
            <p className="gallery-subtitle">Explore our curated collection of exceptional artworks</p>
          </div>

          {/* Gallery grid with locomotive scroll */}
          <div className="gallery-grid">
            {Artworkz.map((artwork, index) => (
              <Link 
                to={`/artwork/${artwork.id}`} 
                key={artwork.id} 
                className={`artwork-item artwork-item-${artwork.id}`}
                data-scroll
                data-scroll-speed={0.3}
                data-scroll-delay={index * 0.05}
                style={{ 
                  transitionDelay: `${index * 0.1}s`,
                  opacity: loaded ? 1 : 0,
                  transform: loaded ? 'translateY(0)' : 'translateY(50px)'
                }}
              >
                <div className="artwork-card">
                  <div className="artwork-image-container">
                    <img src={artwork.thumbnailUrl} alt={artwork.title} />
                    <div className="artwork-overlay">
                      <h3>{artwork.title}</h3>
                      <p>{artwork.artist}, {artwork.year}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Gallery;