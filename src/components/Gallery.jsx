import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { artworks } from '../data/artwork';
import { useLocomotive } from '../hooks/useLocomotive';
import './Gallery.css';

const Gallery = () => {
  const scrollRef = useRef(null);
  
  // Use our custom hook for animations
  useLocomotive(scrollRef);

  // Properly shuffle artworks to create a random layout
  const Artworkz = [...artworks].sort();

  return (
    <div className="scroll-container" ref={scrollRef} data-scroll-container>
      <div className="gallery-container" data-scroll-section>
        <div className="gallery-header" data-scroll data-scroll-speed="1">
          <h1>TEAM O-7 GALLERY</h1>
          <p className="gallery-subtitle">Explore our curated collection of exceptional artworks</p>
        </div>

        <div className="gallery-grid">
          {Artworkz.map((artwork) => (
            <Link 
              to={`/artwork/${artwork.id}`} 
              key={artwork.id} 
              className={`artwork-item artwork-item-${artwork.id}`}
              data-scroll
              data-scroll-speed={0.3}
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
  );
};

export default Gallery;