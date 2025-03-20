import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { artworks } from '../data/artwork';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import LocomotiveScroll from 'locomotive-scroll';
import './ArtworkDetail.css';
import { useGSAP } from '@gsap/react';
import SceneInit from './SceneInit.js'; // Adjust the import path as needed


// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const ArtworkDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const artwork = artworks.find(art => art.id === parseInt(id));
  const [viewMode, setViewMode] = useState('2d');
  const threeContainer = useRef(null);
  const detailRef = useRef(null);
  const headerRef = useRef(null);
  const imageContainerRef = useRef(null);
  const descriptionRef = useRef(null);
  const relatedRef = useRef(null);
  const cursorRef = useRef(null);
  const sceneRef = useRef(null);
  const scrollRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isHovering3D, setIsHovering3D] = useState(false);
  const loadingOverlayRef = useRef(null);
  const loadingProgressRef = useRef(null);
  const contentRef = useRef(null);
  
  // Initialize locomotive scroll
  useGSAP(() => {
    if (!artwork || isLoading) return;
    
    // Initialize locomotive scroll after loading
    scrollRef.current = new LocomotiveScroll({
      el: document.querySelector('[data-scroll-container]'),
      smooth: true,
      multiplier: 0.8,
      smartphone: {
        smooth: true
      },
      tablet: {
        smooth: true
      }
    });
    
    // Update locomotive scroll
    ScrollTrigger.scrollerProxy('[data-scroll-container]', {
      scrollTop(value) {
        return arguments.length 
          ? scrollRef.current.scrollTo(value, 0, 0) 
          : scrollRef.current.scroll.instance.scroll.y;
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
    
    // Set up scroll-based animations
    const sections = [
      { ref: imageContainerRef, delay: 0 },
      { ref: descriptionRef, delay: 0.2 },
      { ref: relatedRef, delay: 0.2 }
    ];
    
    sections.forEach(({ ref, delay }) => {
      if (!ref.current) return;
      
      ScrollTrigger.create({
        trigger: ref.current,
        scroller: '[data-scroll-container]',
        start: 'top bottom-=100',
        onEnter: () => {
          gsap.fromTo(ref.current,
            { y: 100, opacity: 0 },
            { y: 0, opacity: 1, duration: 1.2, delay, ease: 'power3.out' }
          );
        },
        once: true
      });
    });
    
    // Clean up
    return () => {
      if (scrollRef.current) {
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        scrollRef.current.destroy();
      }
    };
  }, [artwork, isLoading]);
  
  // Handle 3D view hover state to disable/enable scrolling
  useEffect(() => {
    if (!scrollRef.current || viewMode !== '3d') return;
    
    if (isHovering3D) {
      // Disable scrolling when hovering over 3D view
      scrollRef.current.stop();
      document.body.style.overflow = 'hidden';
      document.documentElement.classList.add('no-scroll');
      if (threeContainer.current) {
        threeContainer.current.classList.add('interacting');
      }
    } else {
      // Re-enable scrolling when not hovering over 3D view
      scrollRef.current.start();
      document.body.style.overflow = '';
      document.documentElement.classList.remove('no-scroll');
      if (threeContainer.current) {
        threeContainer.current.classList.remove('interacting');
      }
    }
    
    return () => {
      // Clean up
      document.body.style.overflow = '';
      document.documentElement.classList.remove('no-scroll');
      if (scrollRef.current) {
        scrollRef.current.start();
      }
    };
  }, [isHovering3D, viewMode]);
  
  // Loading sequence
  useEffect(() => {
    if (!artwork) return;
    
    // Initially hide the main content
    if (contentRef.current) {
      gsap.set(contentRef.current, { 
        opacity: 0,
        visibility: 'hidden'
      });
    }
    
    const loadingTimeline = gsap.timeline({
      onComplete: () => {
        setIsLoading(false);
        
        // Show content after loading completes
        if (contentRef.current) {
          gsap.to(contentRef.current, {
            opacity: 1,
            visibility: 'visible',
            duration: 0.5
          });
        }
        
        
      }
    });
    
    loadingTimeline
      .to(loadingOverlayRef.current, {
        duration: 0.5,
        opacity: 1,
        visibility: 'visible'
      })
      .to(loadingProgressRef.current, {
        width: '100%',
        duration: 1.5,
        ease: 'power2.inOut'
      })
      .to(loadingOverlayRef.current, {
        opacity: 0,
        duration: 0.5,
        pointerEvents: 'none',
        visibility: 'hidden'
      });
    
  }, [artwork]);

// Clean up Three.js when component changes
useEffect(() => {
  if (!artwork) return;
  
  // Reset view mode when artwork changes
  setViewMode('2d');
  setIsLoading(true);
  
  // Clean up previous Three.js scene if any
  if (sceneRef.current) {
    sceneRef.current.cleanup();
    sceneRef.current = null;
  }
  
  return () => {
    if (sceneRef.current) {
      sceneRef.current.cleanup();
      sceneRef.current = null;
    }
  };
}, [id, artwork]);

                // Set up 3D view
                useEffect(() => {
                  // Clean up 3D view when switching to 2D
                  if (viewMode === '2d') {
                    if (sceneRef.current) {
                      sceneRef.current.cleanup();
                      sceneRef.current = null;
                    }
                    return;
                  }
                  
                  if (!threeContainer.current || !artwork) {
                    return;
                  }
                  
                  // Initialize the 3D scene
                  const scene = new SceneInit(threeContainer.current);
                  sceneRef.current = scene;
                  
                  const initialized = scene.init();
                  if (!initialized) return;
                  
                  // Handle different artwork types
                  if (artwork.category === 'sculpture') {
                    // Add special lighting for sculptures
                   
                    scene.addSculptureLighting();
                    
                    // Load the 3D model
                    if(artwork.id === 12){
                      scene.loadModel('/models/roza.glb')
                      .catch(error => console.error('Failed to load model:', error));
                    }
                    else if(artwork.id === 6){
                      scene.loadModel('/models/david.glb')
                      .catch(error => console.error('Failed to load model:', error));
                    }
                    else if(artwork.id === 3){
                      scene.loadModel('/models/thinker.glb')
                      .catch(error => console.error('Failed to load model:', error));
                    }
                    else if(artwork.id === 9){
                      scene.loadModel('/models/bernard.glb')
                      .catch(error => console.error('Failed to load model:', error));
                    }
                    
                  
                    
                  } else {
                    // Create a painting with frame
                    scene.createPainting(artwork.imageUrl);
    
                  }
                  // Start the animation loop
                  scene.startAnimation(0.001);
                 
                  
                }, [viewMode, artwork]);

// Handle back navigation with animation
const handleBack = (e) => {
  e.preventDefault();
  
  // More sophisticated exit animation
  const tl = gsap.timeline({
    onComplete: () => navigate('/')
  });
  
  tl.to(detailRef.current, {
    opacity: 0,
    y: 50,
    duration: 0.7,
    ease: 'power3.inOut'
  });
  
  tl.to('.artwork-display', {
    scale: 0.9,
    opacity: 0,
    duration: 0.5,
    ease: 'power2.in'
  }, '-=0.5');
};

// Get related artworks (same category or artist)
const relatedArtworks = artwork 
  ? artworks
      .filter(art => (art.category === artwork.category || art.artist === artwork.artist) && art.id !== artwork.id)
      .slice(0, 3) 
  : [];

if (!artwork) {
  return (
    <div className="not-found">
      <div className="not-found-content">
        <h2>Artwork Not Found</h2>
        <p>The artwork you're looking for doesn't exist or has been moved.</p>
        <Link to="/" className="back-home-button">Return to Gallery</Link>
      </div>
    </div>
  );
}

return (
  <>
    {/* Loading overlay */}
    <div className="loading-overlay" ref={loadingOverlayRef}>
      <div className="loading-content">
        <h2>{artwork.title}</h2>
        <div className="loading-bar">
          <div className="loading-progress" ref={loadingProgressRef}></div>
        </div>
      </div>
    </div>
    
    {/* Main content - initially hidden */}
    <div ref={contentRef} style={{ opacity: 0, visibility: 'hidden' }}>
      <div className="artwork-detail-wrapper" ref={detailRef} data-scroll-container>
        <header className="artwork-nav" ref={headerRef}>
          <Link to="/" className="back-button" onClick={handleBack}>
            <span className="back-icon">←</span>
            <span className="back-text">Gallery</span>
          </Link>
        </header>
        
        <div className="artwork-detail-container">
          <div className="artwork-detail-header">
            <h1 className="artwork-title">{artwork.title}</h1>
            <h2 className="artwork-artist">by {artwork.artist}, {artwork.year}</h2>
            
            <div className="view-options">
              <button 
                className={viewMode === '2d' ? 'active' : ''} 
                onClick={() => setViewMode('2d')}
              >
                2D View
              </button>
              <button 
                className={viewMode === '3d' ? 'active' : ''} 
                onClick={() => setViewMode('3d')}
              >
                3D View
              </button>
            </div>
          </div>
          
          <div className="artwork-display" ref={imageContainerRef} data-scroll data-scroll-speed="0.3">
            {viewMode === '2d' && (
              <div className="artwork-image">
                <img src={artwork.imageUrl} alt={artwork.title} />
                <div className="image-overlay">
                  <div className="overlay-content">
                    <span className="overlay-title">{artwork.title}</span>
                    <span className="overlay-year">{artwork.year}</span>
                  </div>
                </div>
              </div>
            )}
            {viewMode === '3d' && (
              <div 
                className="artwork-3d" 
                ref={threeContainer}
                onMouseEnter={() => setIsHovering3D(true)}
                onMouseLeave={() => setIsHovering3D(false)}
              >
                <div className="three-instructions">
                  <p>Click and drag to rotate • Scroll to zoom</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="artwork-info-section" ref={descriptionRef} data-scroll data-scroll-speed="0.1">
            <div className="artwork-meta">
              <div className="artwork-details">
                <div className="detail-item">
                  <span className="detail-label">Category</span>
                  <span className="detail-value">{artwork.category}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Medium</span>
                  <span className="detail-value">{artwork.medium}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Dimensions</span>
                  <span className="detail-value">{artwork.dimensions}</span>
                </div>
              </div>
              
              <div className="artwork-quote">
                <blockquote>"{artwork.title}" captures the essence of {artwork.artist}'s vision.</blockquote>
              </div>
            </div>
            
            <div className="artwork-description">
              <h3>About this piece</h3>
              <p>{artwork.description}</p>
              
              <div className="artwork-analysis">
                <h4>Artistic Analysis</h4>
                <p>
                  This {artwork.category} exemplifies {artwork.artist}'s unique approach to 
                  {artwork.medium.toLowerCase()} as a medium, demonstrating technical mastery 
                  and conceptual depth that characterizes their work from this period.
                </p>
              </div>
            </div>
          </div>
          
          {relatedArtworks.length > 0 && (
            <div className="related-artworks" ref={relatedRef} data-scroll data-scroll-speed="0.05">
              <h3>
                <span className="heading-line"></span>
                <span className="heading-text">Related Works</span>
              </h3>
              <div className="related-grid">
                {relatedArtworks.map(related => (
                  <Link 
                    to={`/artwork/${related.id}`} 
                    key={related.id} 
                    className="related-item"
                  >
                    <div className="related-image-container">
                      <img src={related.imageUrl} alt={related.title} />
                      <div className="related-hover-overlay">
                        <span>View Details</span>
                      </div>
                    </div>
                    <div className="related-info">
                      <h4>{related.title}</h4>
                      <p>{related.artist}, {related.year}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
          
          <footer className="artwork-footer">
            <div className="footer-content">
              <div className="footer-navigation">
                <Link to="/" className="footer-link">Home</Link>
                <Link to="/collection" className="footer-link">Collection</Link>
                <Link to="/artists" className="footer-link">Artists</Link>
              </div>
              <div className="footer-copyright">
                <p>© {new Date().getFullYear()} TEAM 0-7. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  </>
);
};

export default ArtworkDetail;