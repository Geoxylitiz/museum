import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { artworks } from '../data/artwork';
import './ArtworkDetail.css';

const ArtworkDetail = () => {
  const { id } = useParams();
  const artwork = artworks.find(art => art.id === parseInt(id));
  const [viewMode, setViewMode] = useState('2d'); // Default is 2D
  const threeContainer = useRef(null);
  const [scene, setScene] = useState(null);
  const rendererRef = useRef(null);
  const animationFrameRef = useRef(null);
  
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
    renderer.setClearColor(0x222222);
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
      const material = new THREE.MeshStandardMaterial({ map: texture,
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
  
  if (!artwork) {
    return <div className="not-found">Artwork not found</div>;
  }
  
  return (
    <div className="artwork-detail-container">
      <div className="artwork-nav">
        <Link to="/" className="back-button">← Back to Gallery</Link>
      </div>
      
      <div className="artwork-detail-header">
        <h1>{artwork.title}</h1>
        <h2>by {artwork.artist}</h2>
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
          <p><strong>Year:</strong> {artwork.year}</p>
          <p><strong>Medium:</strong> {artwork.medium}</p>
          <p><strong>Dimensions:</strong> {artwork.dimensions}</p>
        </div>
        <div className="artwork-description">
          <h3>About this piece</h3>
          <p>{artwork.description}</p>
        </div>
      </div>
    </div>
  );
};

export default ArtworkDetail;