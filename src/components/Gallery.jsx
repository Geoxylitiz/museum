import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { artworks } from '../data/artwork';
import './Gallery.css';

const Gallery = () => {
  const [filter, setFilter] = useState('all');
  
  const filteredArtworks = filter === 'all' 
    ? artworks 
    : artworks.filter(artwork => artwork.category === filter);

  return (
    <div className="gallery-container">
      <div className="gallery-header">
        <h1>Art Gallery</h1>
        <div className="filter-options">
          <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>All</button>
          <button className={filter === 'painting' ? 'active' : ''} onClick={() => setFilter('painting')}>Paintings</button>
          <button className={filter === 'sculpture' ? 'active' : ''} onClick={() => setFilter('sculpture')}>Sculptures</button>
          <button className={filter === 'digital' ? 'active' : ''} onClick={() => setFilter('digital')}>Digital</button>
        </div>
      </div>
      
      <div className="gallery-grid">
        {filteredArtworks.map((artwork) => (
          <Link to={`/artwork/${artwork.id}`} key={artwork.id} className="artwork-item">
            <div className="artwork-card">
              <img src={artwork.thumbnailUrl} alt={artwork.title} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Gallery;