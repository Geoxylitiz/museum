import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { artworks } from '../data/artwork';
import './Gallery.css';
import { useGalleryAnimations } from '../hooks/useGalleryAnimations';



const Gallery = () => {
  const scrollRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const { locoInstance } = useGalleryAnimations(scrollRef);
  
  // Sort artworks by their id to ensure consistent order
  const Artworkz = [...artworks].sort((a, b) => a.id - b.id);

  useEffect(() => {
    // Initialize gallery immediately
    setLoaded(true);
    
    // Update locomotive scroll instance if it exists
    if (locoInstance) {
      setTimeout(() => {
        locoInstance.update();
      }, 500);
    }
  }, [locoInstance]);

  // Get a slight random rotation for collage effect
  const getRandomRotation = (index) => {
    // Create a deterministic but varied rotation based on index
    // Keep rotations subtle between -2 and 2 degrees
    const rotationValues = [-2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2];
    return rotationValues[index % rotationValues.length];
  };

  return (
    <>
    <div className="gallery-header" data-scroll data-scroll-speed="1">
          <h1>TEAM O-7 GALLERY</h1>
          <p className="gallery-subtitle">Explore our curated collection of exceptional artworks</p>
    </div>


    <div className="horizontal-scroll-container" ref={scrollRef} data-scroll-container data-scroll-direction="horizontal">
      <div className={`gallery-container ${loaded ? 'fade-in' : ''}`} data-scroll-section>
        {/* Horizontal gallery grid with masonry/collage layout */}
        <div className="horizontal-gallery-grid">
          {Artworkz.map((artwork, index) => (
            <Link 
              to={`/artwork/${artwork.id}`} 
              key={artwork.id} 
              className={`artwork-item artwork-item-${artwork.id}`}
              data-scroll
              data-scroll-speed={index % 2 === 0 ? "0.05" : "0.1"}
              data-scroll-position="left"
              style={{ 
                transitionDelay: `${index * 0.1}s`,
                opacity: loaded ? 1 : 0,
                transform: loaded ? `translateX(0) rotate(${getRandomRotation(index)}deg)` : 'translateX(50px)',
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