import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { artworks } from '../data/artwork';
import gsap from 'gsap';
import './ArtworkDetail.css';

const ArtworkDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const artwork = artworks.find(art => art.id === parseInt(id));
  const [viewMode, setViewMode] = useState('2d'); // Default is 2D
  const threeContainer = useRef(null);
  const detailRef = useRef(null);
  const [scene, setScene] = useState(null);
  const rendererRef = useRef(null);
  const animationFrameRef = useRef(null);
  
  // Initialize animations
  useEffect(() => {
    if (!artwork || !detailRef.current) return;
    
    // Animate content in
    const tl = gsap.timeline();
    
    tl.from('.artwork-detail-header h1', {
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    })
    .from('.artwork-detail-header h2', {
      y: 30,
      opacity: 0,
      duration: 0.6,
      ease: 'power3.out'
    }, '-=0.4')
    .from('.artwork-display', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    }, '-=0.3')
    .from('.artwork-info-section', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    }, '-=0.5')
    .from('.related-artworks', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    }, '-=0.5');
    
  }, [artwork]);
  
  useEffect(() => {
    if (!artwork) return;
    
    // Reset view mode when artwork changes
    setViewMode('2d');
    
    // Clean up previous scene if any
    if (scene) {
      scene.dispose();
    }
    
    // Clean up renderer and animation frame
    cleanupThreeJS();
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
  
  useEffect(() => {
    // Clean up 3D view when switching to 2D
    if (viewMode === '2d') {
      cleanupThreeJS();
      return;
    }
    
    if (!threeContainer.current || !artwork) {
      return;
    } 
    
    // Set up Three.js scene
    const width = threeContainer.current.clientWidth;
    const height = threeContainer.current.clientHeight;
    
    const newScene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    rendererRef.current = renderer;
    
    renderer.setSize(width, height);
    renderer.setClearColor(0xf5f5f5);
    threeContainer.current.innerHTML = '';
    threeContainer.current.appendChild(renderer.domElement);
    
    // Add orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    
    // Create a basic 3D representation based on artwork type
    let object;
    
    if (artwork.category === 'painting') {
     //Create a plane with the artwork texture
      const textureLoader = new THREE.TextureLoader();
      const texture = textureLoader.load(artwork.imageUrl);
      const geometry = new THREE.PlaneGeometry(4, 3);
      const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
      object = new THREE.Mesh(geometry, material);
    } else if (artwork.category === 'sculpture') {
      // Create a basic shape to represent a sculpture
      const textureLoader = new THREE.TextureLoader();
      const texture = textureLoader.load(artwork.imageUrl);
      const geometry = new THREE.SphereGeometry(2, 32, 32);
      const material = new THREE.MeshStandardMaterial({ 
        map: texture,
        color: 0xffffff,
        roughness: 0.7,
        metalness: 0.2
      });
      object = new THREE.Mesh(geometry, material);
    } else {
      // Default to a cube for other art types
      const textureLoader = new THREE.TextureLoader();
      const texture = textureLoader.load(artwork.imageUrl);
      texture.encoding = THREE.sRGBEncoding;

      const geometry = new THREE.BoxGeometry(3, 3, 3, 10, 10, 10);
      const material = new THREE.MeshPhysicalMaterial({
        map: texture,
        roughness: 0.5,
        metalness: 0.5,
        clearcoat: 0.3,
        transmission: 0.2,
        thickness: 0.5
      });

      object = new THREE.Mesh(geometry, material);
    }
    
    newScene.add(object);
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    newScene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    newScene.add(directionalLight);
    
    // Position camera
    camera.position.z = 5;
    
    // Animation loop
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      controls.update();
      renderer.render(newScene, camera);
    };
    
    animate();
    
    // Handle window resize
    const handleResize = () => {
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
    
    // Animate out
    const tl = gsap.timeline({
      onComplete: () => navigate('/')
    });
    
    tl.to(detailRef.current, {
      y: 50,
      opacity: 0,
      duration: 0.5,
      ease: 'power3.in'
    });
  };
  
  // Get related artworks (same category)
  const relatedArtworks = artwork 
    ? artworks
        .filter(art => art.category === artwork.category && art.id !== artwork.id)
        .slice(0, 3) 
    : [];
  console.log(relatedArtworks)
  if (!artwork) {
    return <div className="not-found">Artwork not found</div>;
  }
  
  return (
    <div className="artwork-detail-container"  >
      <div className="artwork-nav">
        <Link to="/" className="back-button" onClick={handleBack}>← Back to Gallery</Link>
      </div>
      
      <div className="artwork-detail-header">
        <h1>{artwork.title}</h1>
        <h2>by {artwork.artist}, {artwork.year}</h2>
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
      
      <div className="artwork-display">
        {viewMode === '2d' && (
          <div className="artwork-image">
            <img src={artwork.imageUrl} alt={artwork.title} />
          </div>
        )}
        {viewMode === '3d' && (
          <div className="artwork-3d" ref={threeContainer}></div>
        )}
      </div>
      
      <div className="artwork-info-section">
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
        <div className="artwork-description">
          <h3>About this piece</h3>
          <p>{artwork.description}</p>
        </div>
      </div>
      
      {relatedArtworks.length > 0 && (
        <div className="related-artworks">
          <h3>Related Works</h3>
          <div className="related-grid">
            {relatedArtworks.map(related => (
              <Link 
                to={`/artwork/${related.id}`} 
                key={related.id} 
                className="related-item"
              >
                <img src={related.imageUrl} alt={related.title} />
                <div className="related-info">
                  <h4>{related.title}</h4>
                  <p>{related.artist}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtworkDetail;