import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

class SceneInit {
  constructor(container) {
    // Essential properties
    this.container = container;
    this.scene = new THREE.Scene();
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.animationFrameId = null;
    this.object = null;
    
    // Scene settings
    this.scene.background = new THREE.Color(0x111111);
  }

  init() {
    if (!this.container) {
      console.error('Container is not available');
      return false;
    }

    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    // Camera setup
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.set(0, 0, 3.5);

    // Renderer setup
    this.renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true
    });
    
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    
    // Clear container and add renderer
    this.container.innerHTML = '';
    this.container.appendChild(this.renderer.domElement);
    
    // Controls setup
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;


    // Add lights
    this.addLights();
    
    // Add floor
    this.addFloor();
    
    // Set up resize handling
    this.handleResize = this.handleResize.bind(this);
    window.addEventListener('resize', this.handleResize);
    
    return true;
  }

  addLights() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    this.scene.add(ambientLight);
    
    // Spot light
    const spotLight = new THREE.SpotLight(0xffffff, 1);
    spotLight.position.set(5, 8, 5);
    spotLight.angle = Math.PI / 6;
    spotLight.penumbra = 0.3;
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    this.scene.add(spotLight);
    
    // Main directional light
    const mainLight = new THREE.DirectionalLight(0xffffff, 1);
    mainLight.position.set(5, 5, 5);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    this.scene.add(mainLight);
  }

  addFloor() {
    // Create a platform/floor
    const floorGeometry = new THREE.CircleGeometry(8, 32);
    const floorMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x635d4c,
      roughness: 0.8,
      metalness: 0.2
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -3;
    floor.receiveShadow = true;
    this.scene.add(floor);
  }
  
  addSculptureLighting() {
    // Add additional lighting for sculptures
    const sunLight = new THREE.DirectionalLight(0xffffff, 1);
    sunLight.position.set(10, 10, 10);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 50;
    this.scene.add(sunLight);
    
    // Reposition camera for better sculpture viewing
    this.camera.position.set(0, 0, 6);
  }

  loadModel(modelPath) {
    return new Promise((resolve, reject) => {
      const gltfLoader = new GLTFLoader();
      gltfLoader.load(
        modelPath,
        (gltfScene) => {
          const model = gltfScene.scene;
          console.log(model);
          
          // Process materials
          model.traverse((child) => {
            if (child.isMesh) {
              child.material.needsUpdate = true;
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });
          
          
          // Calculate model size
          const box = new THREE.Box3().setFromObject(model);
          const size = box.getSize(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z);
          
          // Target size range
          const minTargetSize = 2; // Minimum desired size
          const maxTargetSize = 6; // Maximum desired size
          
          // Scale model if it's too small or too large
          if (maxDim < minTargetSize) {
            // Scale up small models
            const scale = minTargetSize / maxDim;
            console.log(`Model is too small (${maxDim}), scaling up by factor of ${scale}`);
            model.scale.set(scale, scale, scale);
          } else if (maxDim > maxTargetSize) {
            // Scale down large models
            const scale = maxTargetSize / maxDim;
            console.log(`Model is too large (${maxDim}), scaling down by factor of ${scale}`);
            model.scale.set(scale, scale, scale);
          } else {
            console.log(`Model size (${maxDim}) is within acceptable range, no scaling needed`);
          }
          

          

          this.object = model;
          this.scene.add(model);
          resolve(model);
        },
        undefined,
        (error) => {
          console.error('An error occurred loading the model:', error);
          reject(error);
        }
      );
    });
  }

  createPainting(imageUrl) {
    // Create a frame group
    const frameGroup = new THREE.Group();
    
    // Load texture
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(imageUrl);
    
    // Create painting plane
    const paintingGeometry = new THREE.PlaneGeometry(4, 3);
    const paintingMaterial = new THREE.MeshStandardMaterial({ 
      map: texture, 
      side: THREE.FrontSide 
    });
    const painting = new THREE.Mesh(paintingGeometry, paintingMaterial);
    
    // Frame dimensions
    const frameThickness = 0.1;
    const frameWidth = 4 + frameThickness * 2;
    const frameHeight = 3 + frameThickness * 2;
    const frameDepth = 0.2;
    
    // Create frame
    const frameGeometry = new THREE.BoxGeometry(frameWidth, frameHeight, frameDepth);
    const frameMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x8B4513, 
      roughness: 0.5, 
      metalness: 0.2 
    });
    const frame = new THREE.Mesh(frameGeometry, frameMaterial);
    frame.position.z = -0.15;
    
    // Create inner cutout for frame
    const innerGeometry = new THREE.BoxGeometry(4.05, 3.05, frameDepth + 0.05);
    const innerMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x000000, 
      side: THREE.BackSide 
    });
    const innerCutout = new THREE.Mesh(innerGeometry, innerMaterial);
    
    // Assemble frame group
    frameGroup.add(frame);
    frameGroup.add(innerCutout);
    frameGroup.add(painting);
    
    this.object = frameGroup;
    this.scene.add(frameGroup);
    
    return frameGroup;
  }

  startAnimation(rotationSpeed = 0.001) {
    this.animate = () => {
      this.animationFrameId = requestAnimationFrame(this.animate);
      
      if (this.object) {
        this.object.rotation.y += rotationSpeed;
      }
      
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
    };
    
    this.animate();
  }

  handleResize() {
    if (!this.container) return;
    
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  cleanup() {
    // Cancel animation frame
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    
    // Remove resize listener
    window.removeEventListener('resize', this.handleResize);
    
    // Dispose renderer
    if (this.renderer) {
      this.renderer.dispose();
      this.renderer = null;
    }
    
    // Clear container
    if (this.container) {
      this.container.innerHTML = '';
    }
    
    // Dispose scene resources
    if (this.scene) {
      this.scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
    }
  }
}

export default SceneInit;