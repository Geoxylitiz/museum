import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { artworks } from '../data/artwork';
import './Gallery.css';
import { useLocomotive } from '../hooks/useLocomotive';

const Gallery = () => {
  const scrollRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  useLocomotive(scrollRef);

  
  const Artworkz = [...artworks].sort();

  useEffect(() => {
    // Trigger initial animation sequence
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 300);
    
    // Set animation as complete after intro finishes
    const completionTimer = setTimeout(() => {
      setAnimationComplete(true);
    }, 4500);
    
    return () => {
      clearTimeout(timer);
      clearTimeout(completionTimer);
    };
  }, []);

  return (
    <>
      {/* Intro animation sequence */}
      <div className={`intro-animation ${loaded ? 'active' : ''} ${animationComplete ? 'completed' : ''}`}>
        <div className="intro-frames">
          <div className="frame frame-1"></div>
          <div className="frame frame-2"></div>
          <div className="frame frame-3"></div>
        </div>
        <div className="intro-content">
          <div className="intro-title">
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
          </div>
          <div className="intro-subtitle">
            <span className="word-animation">Where</span>
            <span className="word-animation">Art</span>
            <span className="word-animation">Meets</span>
            <span className="word-animation">Vision</span>
          </div>
          <div className="intro-images">
            {Artworkz.slice(0, 3).map((art, index) => (
              <div key={index} className={`intro-image intro-image-${index + 1}`}>
                <img src={art.thumbnailUrl} alt="" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="scroll-container" ref={scrollRef} data-scroll-container>
        <div className={`gallery-container ${loaded ? 'fade-in' : ''}`} data-scroll-section>
          <div className="gallery-header" data-scroll data-scroll-speed="1">
            <h1>TEAM O-7 GALLERY</h1>
            <p className="gallery-subtitle">Explore our curated collection of exceptional artworks</p>
          </div>

          <div className="gallery-grid">
            {Artworkz.map((artwork, index) => (
              <Link 
                to={`/artwork/${artwork.id}`} 
                key={artwork.id} 
                className={`artwork-item artwork-item-${artwork.id}`}
                data-scroll
                data-scroll-speed={0.3}
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