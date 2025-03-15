import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { artworks } from '../data/artwork';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import LocomotiveScroll from 'locomotive-scroll';
import './ArtworkDetail.css';

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
  const [scene, setScene] = useState(null);
  const rendererRef = useRef(null);
  const animationFrameRef = useRef(null);
  const scrollRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Initialize locomotive scroll
  useEffect(() => {
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
      { ref: relatedRef, delay: 0.4 }
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
  
  // Loading sequence
  useEffect(() => {
    if (!artwork) return;
    
    const loadingTimeline = gsap.timeline({
      onComplete: () => {
        setIsLoading(false);
        
        // Start entrance animations once loading is complete
        const entranceTimeline = gsap.timeline();
        
        entranceTimeline
          .from('.artwork-title', {
            y: 100,
            opacity: 0,
            duration: 1.2,
            ease: 'power3.out',
            clearProps: 'all'
          })
          .from('.artwork-artist', {
            y: 50,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out',
            clearProps: 'all'
          }, '-=0.8')
          .from('.view-options', {
            y: 30,
            opacity: 0,
            duration: 0.6,
            ease: 'power3.out',
            clearProps: 'all'
          }, '-=0.6')
          .from('.back-button', {
            x: -30,
            opacity: 0,
            duration: 0.6,
            ease: 'power3.out',
            clearProps: 'all'
          }, '-=0.6');
      }
    });
    
    loadingTimeline
      .to('.loading-overlay', {
        duration: 0.5,
        opacity: 1
      })
      .to('.loading-progress', {
        width: '100%',
        duration: 1.5,
        ease: 'power2.inOut'
      })
      .to('.loading-overlay', {
        opacity: 0,
        duration: 0.5,
        pointerEvents: 'none'
      });
    
  }, [artwork]);
  
  // Clean up Three.js when component changes
  useEffect(() => {
    if (!artwork) return;
    
    // Reset view mode when artwork changes
    setViewMode('2d');
    setIsLoading(true);
    
    // Clean up previous scene if any
    if (scene) {
      scene.dispose();
    }
    
    // Clean up renderer and animation frame
    cleanupThreeJS();
    
    return () => {
      cleanupThreeJS();
    };
  }, [id, artwork, scene]);

  // Function to clean up Three.js resources
  const cleanupThreeJS = () => {
    // Cancel any ongoing animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    // Dispose renderer
    if (rendererRef.current) {
      rendererRef.current.dispose();
      rendererRef.current = null;
    }
    
    // Clear the container
    if (threeContainer.current) {
      threeContainer.current.innerHTML = '';
    }
  };
  
  // Set up 3D view
  useEffect(() => {
    // Clean up 3D view when switching to 2D
    if (viewMode === '2d') {
      cleanupThreeJS();
      return;
    }
    
    if (!threeContainer.current || !artwork) {
      return;
    }
    
    // Enhanced 3D setup with better lighting and effects
    const width = threeContainer.current.clientWidth;
    const height = threeContainer.current.clientHeight;
    
    const newScene = new THREE.Scene();
    newScene.background = new THREE.Color(0x111111);
    
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    });
    rendererRef.current = renderer;
    
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    
    threeContainer.current.innerHTML = '';
    threeContainer.current.appendChild(renderer.domElement);
    
    // Enhanced orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 3;
    controls.maxDistance = 10;
    
    // Create a more sophisticated 3D representation
    let object;
    
    if (artwork.category === 'painting') {
      // Create a plane with the artwork texture and a frame
      const textureLoader = new THREE.TextureLoader();
      const texture = textureLoader.load(artwork.imageUrl);
      
      // Creating a frame for the painting
      const frameGroup = new THREE.Group();
      
      // Painting plane
      const paintingGeometry = new THREE.PlaneGeometry(4, 3);
      const paintingMaterial = new THREE.MeshStandardMaterial({ 
        map: texture, 
        side: THREE.FrontSide 
      });
      const painting = new THREE.Mesh(paintingGeometry, paintingMaterial);
      
      // Frame
      const frameThickness = 0.1;
      const frameWidth = 4 + frameThickness * 2;
      const frameHeight = 3 + frameThickness * 2;
      const frameDepth = 0.2;
      
      const frameGeometry = new THREE.BoxGeometry(frameWidth, frameHeight, frameDepth);
      const frameMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x8B4513, 
        roughness: 0.5, 
        metalness: 0.2 
      });
      const frame = new THREE.Mesh(frameGeometry, frameMaterial);
      frame.position.z = -0.15;
      
      // Inner cutout for frame
      const innerGeometry = new THREE.BoxGeometry(4.05, 3.05, frameDepth + 0.05);
      const innerMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x000000, 
        side: THREE.BackSide 
      });
      const innerCutout = new THREE.Mesh(innerGeometry, innerMaterial);
      
      frameGroup.add(frame);
      frameGroup.add(innerCutout);
      frameGroup.add(painting);
      
      object = frameGroup;
    } else if (artwork.category === 'sculpture') {
      // More detailed sculpture representation
      const geometry = new THREE.SphereGeometry(2, 64, 64);
      const material = new THREE.MeshStandardMaterial({ 
        color: 0xFFFFFF,
        roughness: 0.3,
        metalness: 0.4
      });
      
      // Load texture if available
      const textureLoader = new THREE.TextureLoader();
      textureLoader.load(artwork.imageUrl, (texture) => {
        material.map = texture;
        material.needsUpdate = true;
      });
      
      object = new THREE.Mesh(geometry, material);
      object.castShadow = true;
    } else {
      // Enhanced default object with more complex geometry
      const geometry = new THREE.DodecahedronGeometry(2, 1);
      const material = new THREE.MeshPhysicalMaterial({
        color: 0xFFFFFF,
        roughness: 0.2,
        metalness: 0.7,
        clearcoat: 0.8,
        clearcoatRoughness: 0.2,
        reflectivity: 1.0
      });
      
      // Load texture if available
      const textureLoader = new THREE.TextureLoader();
      textureLoader.load(artwork.imageUrl, (texture) => {
        material.map = texture;
        material.needsUpdate = true;
      });
      
      object = new THREE.Mesh(geometry, material);
      object.castShadow = true;
    }
    
    newScene.add(object);
    
    // Advanced lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    newScene.add(ambientLight);
    
    const spotLight = new THREE.SpotLight(0xffffff, 1);
    spotLight.position.set(5, 8, 5);
    spotLight.angle = Math.PI / 6;
    spotLight.penumbra = 0.3;
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    newScene.add(spotLight);
    
    const fillLight = new THREE.DirectionalLight(0xFFFFFF, 0.3);
    fillLight.position.set(-5, 0, -5);
    newScene.add(fillLight);
    
    // Create a platform/floor for the object
    const floorGeometry = new THREE.CircleGeometry(8, 32);
    const floorMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x222222,
      roughness: 0.8,
      metalness: 0.2
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -3;
    floor.receiveShadow = true;
    newScene.add(floor);
    
    // Position camera
    camera.position.set(0, 0, 6);
    
    // Enhanced animation loop with gentle rotation
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      
      if (object && viewMode === '3d') {
        object.rotation.y += 0.001;
      }
      
      controls.update();
      renderer.render(newScene, camera);
    };
    
    animate();
    
    // Handle window resize
    const handleResize = () => {
      if (!threeContainer.current) return;
      
      const width = threeContainer.current.clientWidth;
      const height = threeContainer.current.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      cleanupThreeJS();
      
      // Clean up materials, geometries, etc.
      newScene.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
    };
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
    <div className="loading-overlay">
      <div className="loading-content">
        <h2>{artwork.title}</h2>
        <div className="loading-bar">
          <div className="loading-progress"></div>
        </div>
      </div>
    </div>
    
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
            <div className="artwork-3d" ref={threeContainer}>
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
              <p>© {new Date().getFullYear()} Modern Art Gallery. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  </>
);
};

export default ArtworkDetail;