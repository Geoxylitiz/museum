import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { artworks } from '../data/artwork';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import LocomotiveScroll from 'locomotive-scroll';
import imagesLoaded from 'imagesloaded';
import './Gallery.css';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const Gallery = () => {
  const scrollRef = useRef(null);
  const galleryRef = useRef(null);
  
  // Initialize locomotive scroll and GSAP
  useEffect(() => {
    // Initialize locomotive scroll
    const locoScroll = new LocomotiveScroll({
      el: scrollRef.current,
      smooth: true,
      multiplier: 0.8,
      class: 'is-revealed',
      smartphone: {
        smooth: true
      },
      tablet: {
        smooth: true
      },
      reloadOnContextChange: true
    });

    // Update ScrollTrigger when locomotive scroll updates
    locoScroll.on('scroll', ScrollTrigger.update);

    // Setup ScrollTrigger to work with locomotive-scroll
    ScrollTrigger.scrollerProxy(scrollRef.current, {
      scrollTop(value) {
        return arguments.length 
          ? locoScroll.scrollTo(value, 0, 0) 
          : locoScroll.scroll.instance.scroll.y;
      },
      getBoundingClientRect() {
        return {
          top: 0, 
          left: 0, 
          width: window.innerWidth, 
          height: window.innerHeight
        };
      }
    });

    // Wait for images to load before initializing animations
    const imgLoad = imagesLoaded(galleryRef.current);
    
    imgLoad.on('always', () => {
      // Refresh locomotive scroll
      locoScroll.update();
      
      // Animate gallery items
      const galleryItems = document.querySelectorAll('.artwork-item');
      
      gsap.set(galleryItems, { 
        y: 100, 
        opacity: 0 
      });
      
      gsap.to(galleryItems, {
        y: 0,
        opacity: 1,
        stagger: 0.1,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: galleryRef.current,
          scroller: scrollRef.current,
          start: "top bottom",
          end: "bottom top",
        }
      });
    });

    // Handle resize
    const handleResize = () => {
      locoScroll.update();
      ScrollTrigger.update();
    };

    window.addEventListener('resize', handleResize);

    // Clean up
    return () => {
      if (locoScroll) {
        locoScroll.destroy();
      }
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Shuffle artworks to create an unordered layout
  const shuffledArtworks = [...artworks].sort(() => Math.random() - 0.5);

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
              data-scroll-speed={Math.random() * 0.5 + 0.1}
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