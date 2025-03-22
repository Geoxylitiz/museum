import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { artworks } from '../data/artwork';
import { useGalleryAnimations } from '../hooks/useGalleryAnimations';
import './Gallery.css';

const Gallery = () => {
  const scrollRef = useRef(null);
  const galleryRef = useRef(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  
  // Shuffle artworks to create an unordered layout
  const shuffledArtworks = [...artworks].sort();
  
  // Track loaded images
  useEffect(() => {
    // Setting a small delay to ensure we don't show a loading state for very fast loads
    const timer = setTimeout(() => {
      if (!imagesLoaded) {
        setImagesLoaded(true);
      }
    }, 2500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Use our custom hook for animations
  useGalleryAnimations(scrollRef, galleryRef);

  return (
    <div className="scroll-container" ref={scrollRef} data-scroll-container>
      <div className="gallery-container" data-scroll-section>
        <div className="gallery-header" data-scroll data-scroll-speed="1">
          <h1>TEAM O-7 GALLERY</h1>
          <p className="gallery-subtitle">Explore our curated collection of exceptional artworks</p>
        </div>

        <div className="gallery-grid" ref={galleryRef}>
          {shuffledArtworks.map((artwork) => (
            <Link 
              to={`/artwork/${artwork.id}`} 
              key={artwork.id} 
              className={`artwork-item artwork-item-${artwork.id}`}
              data-scroll
              data-scroll-speed={0.3}
            >
              <div className="artwork-card">
                <div className="artwork-image-container">
                  <img 
                    src={artwork.thumbnailUrl} 
                    alt={artwork.title} 
                    loading="lazy"
                    decoding="async"
                    onLoad={(e) => {
                      // Add a class to handle fade-in once loaded
                      e.target.classList.add('img-loaded');
                    }}
                  />
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
  );
};

export default Gallery;