import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { artworks } from '../data/artwork';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import LocomotiveScroll from 'locomotive-scroll';
import './Gallery.css';

gsap.registerPlugin(ScrollTrigger);

const Gallery = () => {
  const [filter, setFilter] = useState('all');
  const galleryRef = useRef(null);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    // Initialize Locomotive Scroll
    const locoScroll = new LocomotiveScroll({
      el: galleryRef.current,
      smooth: true
    });

    // Horizontal scrolling effect with GSAP
    gsap.to('.gallery-grid', {
      x: () => -document.querySelector('.gallery-grid').scrollWidth + window.innerWidth,
      ease: 'power2.inOut',
      scrollTrigger: {
        trigger: '.horizontal-scroll-container',
        start: 'top top',
        end: '+=200%',
        scrub: 1,
        pin: true
      }
    });

    return () => {
      locoScroll.destroy();
    };
  }, []);

  const filteredArtworks =
    filter === 'all' ? artworks : artworks.filter((art) => art.category === filter);

  return (
    <div ref={galleryRef} data-scroll-container className="gallery-container">
      <div className="gallery-header">
        <h1 data-scroll data-scroll-speed="1">Art Gallery</h1>
        <div className="filter-options">
          {['all', 'painting', 'sculpture', 'digital'].map((category) => (
            <button
              key={category}
              className={filter === category ? 'active' : ''}
              onClick={() => setFilter(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div ref={scrollContainerRef} className="horizontal-scroll-container">
        <div className="gallery-grid">
          {filteredArtworks.map((artwork, index) => (
            <Link to={`/artwork/${artwork.id}`} key={artwork.id} className="artwork-item">
              <div
                className="artwork-card"
                data-scroll
                data-scroll-speed={(index % 2 === 0 ? '2' : '-2')} // Parallax effect
              >
                <img src={artwork.thumbnailUrl} alt={artwork.title} />
                <div className="artwork-info">
                  <h3>{artwork.title}</h3>
                  <p>{artwork.artist}</p>
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