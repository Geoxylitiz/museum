import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

class SceneInit {
  constructor(container) {
    this.container = container;
    this.scene = new THREE.Scene();
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.animationFrameId = null;
    this.object = null;
    this.pedestal = null;

    // Scene settings for museum aesthetic
    this.scene.background = new THREE.Color(0xf5f5f5); // Soft off-white for elegance
    this.scene.fog = new THREE.Fog(0xf5f5f5, 10, 30); // Subtle fog for depth
  }

  init() {
    if (!this.container) {
      console.error('Container is not available');
      return false;
    }

    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    // Camera setup
    this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    this.camera.position.set(0, 2.5, 8); // Slightly higher and further back

    // Renderer setup
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false
    });
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;

    this.container.innerHTML = '';
    this.container.appendChild(this.renderer.domElement);

    // Controls setup
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.minPolarAngle = Math.PI / 4;
    this.controls.maxPolarAngle = Math.PI / 2 - 0.1;
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.1;
    this.controls.minDistance = 2;
    this.controls.maxDistance = 12;
    this.controls.target.set(0, 1.5, 0);

    // Add museum elements
    this.addMuseumElements();

    // Add lights
    this.addLights();

    // Handle resize
    this.handleResize = this.handleResize.bind(this);
    window.addEventListener('resize', this.handleResize);

    return true;
  }

  addLights() {
    // Ambient light for soft base illumination
    const ambientLight = new THREE.AmbientLight(0xe6e6e6, 0.4);
    this.scene.add(ambientLight);

    // Main directional light (ceiling light simulation)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(0, 12, 8);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.set(2048, 2048);
    directionalLight.shadow.camera.near = 0.1;
    directionalLight.shadow.camera.far = 25;
    directionalLight.shadow.camera.left = -15;
    directionalLight.shadow.camera.right = 15;
    directionalLight.shadow.camera.top = 15;
    directionalLight.shadow.camera.bottom = -15;
    directionalLight.shadow.bias = -0.0002;
    this.scene.add(directionalLight);

    // Spotlights for exhibits
    const createSpotLight = (position, target, intensity, angle) => {
      const spotLight = new THREE.SpotLight(0xfff8e1, intensity);
      spotLight.position.set(...position);
      spotLight.target.position.set(...target);
      spotLight.angle = angle;
      spotLight.penumbra = 0.6;
      spotLight.decay = 2;
      spotLight.distance = 15;
      spotLight.castShadow = true;
      spotLight.shadow.mapSize.set(2048, 2048);
      spotLight.shadow.bias = -0.0002;
      this.scene.add(spotLight, spotLight.target);
      return spotLight;
    };

    // Spotlight for back wall paintings
    createSpotLight([0, 6, -4], [0, 2, -9.8], 3, Math.PI / 10);
    // Spotlight for pedestal
    createSpotLight([0, 6, 4], [0, 1.5, 0], 2.5, Math.PI / 8);
  }

  addMuseumElements() {
    const textureLoader = new THREE.TextureLoader();

    // Floor: Polished marble
    const floorTexture = textureLoader.load('/models/textures/concrete_tiles.jpg');
    floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(4, 4);
    const floorNormal = textureLoader.load('/models/textures/concrete_tiles.jpg');
    floorNormal.wrapS = floorNormal.wrapT = THREE.RepeatWrapping;
    floorNormal.repeat.set(4, 4);

    const floorGeometry = new THREE.PlaneGeometry(20, 20);
    const floorMaterial = new THREE.MeshStandardMaterial({
      map: floorTexture,
      normalMap: floorNormal,
      roughness: 0.2,
      metalness: 0.3
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.scene.add(floor);

    // Walls: Textured plaster with subtle details
    const wallTexture = textureLoader.load('/models/textures/subtle_plaster.jpg');
    wallTexture.wrapS = wallTexture.wrapT = THREE.RepeatWrapping;
    wallTexture.repeat.set(8, 4);
    const wallMaterial = new THREE.MeshStandardMaterial({
      map: wallTexture,
      roughness: 0.7,
      metalness: 0
    });

    // Ceiling: Simple white with subtle texture
    const ceilingTexture = textureLoader.load('/models/textures/suble_plaster.jpg');
    ceilingTexture.wrapS = ceilingTexture.wrapT = THREE.RepeatWrapping;
    ceilingTexture.repeat.set(4, 4);
    const ceilingMaterial = new THREE.MeshStandardMaterial({
      map: ceilingTexture,
      roughness: 0.8,
      metalness: 0
    });

    const wallHeight = 6;
    const wallThickness = 0.2;
    const roomWidth = 20;
    const roomDepth = 20;

    // Wall geometries
    const backWallGeometry = new THREE.BoxGeometry(roomWidth, wallHeight, wallThickness);
    const sideWallGeometry = new THREE.BoxGeometry(wallThickness, wallHeight, roomDepth);
    const ceilingGeometry = new THREE.PlaneGeometry(roomWidth, roomDepth);

    // Back wall
    const backWall = new THREE.Mesh(backWallGeometry, wallMaterial);
    backWall.position.set(0, wallHeight / 2, -roomDepth / 2);
    backWall.receiveShadow = true;
    this.scene.add(backWall);

    // Left wall
    const leftWall = new THREE.Mesh(sideWallGeometry, wallMaterial);
    leftWall.position.set(-roomWidth / 2, wallHeight / 2, 0);
    leftWall.receiveShadow = true;
    this.scene.add(leftWall);

    // Right wall
    const rightWall = new THREE.Mesh(sideWallGeometry, wallMaterial);
    rightWall.position.set(roomWidth / 2, wallHeight / 2, 0);
    rightWall.receiveShadow = true;
    this.scene.add(rightWall);

    // Ceiling
    const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.set(0, wallHeight, 0);
    ceiling.receiveShadow = true;
    this.scene.add(ceiling);

    // Cornices
    const corniceMaterial = new THREE.MeshStandardMaterial({
      color: 0xe0e0e0,
      roughness: 0.5,
      metalness: 0.1
    });
    const corniceGeometry = new THREE.BoxGeometry(roomWidth, 0.3, 0.3);
    const cornice1 = new THREE.Mesh(corniceGeometry, corniceMaterial);
    cornice1.position.set(0, wallHeight - 0.15, -roomDepth / 2 + 0.15);
    this.scene.add(cornice1);
    const cornice2 = new THREE.Mesh(corniceGeometry, corniceMaterial);
    cornice2.position.set(0, wallHeight - 0.15, roomDepth / 2 - 0.15);
    this.scene.add(cornice2);

    // Pillars
    const pillarMaterial = new THREE.MeshStandardMaterial({
      color: 0xe8e8e8,
      roughness: 0.4,
      metalness: 0.2
    });
    const pillarGeometry = new THREE.CylinderGeometry(0.25, 0.25, wallHeight, 32);
    const pillars = [
      [-8, -8], [8, -8], [-8, 8], [8, 8]
    ].map(([x, z]) => {
      const pillar = new THREE.Mesh(pillarGeometry, pillarMaterial);
      pillar.position.set(x, wallHeight / 2, z);
      pillar.castShadow = true;
      pillar.receiveShadow = true;
      this.scene.add(pillar);
      return pillar;
    });

    // Pedestal
    const pedestalGeometry = new THREE.BoxGeometry(1.2, 1.2, 1.2);
    const pedestalMaterial = new THREE.MeshStandardMaterial({
      color: 0x2a2a2a,
      roughness: 0.3,
      metalness: 0.4
    });
    this.pedestal = new THREE.Mesh(pedestalGeometry, pedestalMaterial);
    this.pedestal.position.set(0, 0.6, 0);
    this.pedestal.castShadow = true;
    this.pedestal.receiveShadow = true;
    this.pedestal.visible = false;
    this.scene.add(this.pedestals);

    // Benches
    const benchMaterial = new THREE.MeshStandardMaterial({
      color: 0x333333,
      roughness: 0.5,
      metalness: 0.2
    });
    const benchGeometry = new THREE.BoxGeometry(2.5, 0.4, 0.7);
    const benches = [
      [-5, 6], [5, 6], [0, -6]
    ].map(([x, z]) => {
      const bench = new THREE.Mesh(benchGeometry, benchMaterial);
      bench.position.set(x, 0.2, z);
      bench.castShadow = true;
      bench.receiveShadow = true;
      this.scene.add(bench);
      return bench;
    });
  }

  addSculptureLighting() {
    this.camera.position.set(2, 2, 5);
    this.controls.target.set(0, 1.5, 0);
  }

  loadModel(modelPath) {
    return new Promise((resolve, reject) => {
      const gltfLoader = new GLTFLoader();
      gltfLoader.load(
        modelPath,
        (gltfScene) => {
          const model = gltfScene.scene;
          model.traverse((child) => {
            if (child.isMesh) {
              child.material.roughness = Math.min(child.material.roughness, 0.5);
              child.material.metalness = Math.min(child.material.metalness, 0.3);
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });

          const box = new THREE.Box3().setFromObject(model);
          const size = box.getSize(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z);
          const scale = Math.min(2 / maxDim, 1);
          model.scale.set(scale, scale, scale);

          const scaledBox = new THREE.Box3().setFromObject(model);
          const scaledSize = scaledBox.getSize(new THREE.Vector3());
          const scaledCenter = scaledBox.getCenter(new THREE.Vector3());

          const pedestalTopY = this.pedestal.position.y + 0.6;
          model.position.set(
            this.pedestal.position.x,
            pedestalTopY - scaledCenter.y + scaledSize.y / 2,
            this.pedestal.position.z
          );

          this.pedestal.visible = true;
          this.object = model;
          this.scene.add(model);
          this.addSculptureLighting();
          resolve(model);
        },
        undefined,
        reject
      );
    });
  }

  createPainting(imageUrl) {
    const frameGroup = new THREE.Group();
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(imageUrl);
    texture.encoding = THREE.sRGBEncoding;

    const aspectRatio = texture.image ? texture.image.width / texture.image.height : 4 / 3;
    const paintingHeight = 2.5;
    const paintingWidth = paintingHeight * aspectRatio;

    const paintingGeometry = new THREE.PlaneGeometry(paintingWidth, paintingHeight);
    const paintingMaterial = new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.4,
      metalness: 0
    });
    const painting = new THREE.Mesh(paintingGeometry, paintingMaterial);
    painting.castShadow = true;
    painting.receiveShadow = true;

    const frameThickness = 0.15;
    const frameDepth = 0.15;
    const frameGeometry = new THREE.BoxGeometry(
      paintingWidth + frameThickness * 2,
      paintingHeight + frameThickness * 2,
      frameDepth
    );
    const frameMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      roughness: 0.3,
      metalness: 0.5
    });
    const frame = new THREE.Mesh(frameGeometry, frameMaterial);
    frame.position.z = -frameDepth / 2 - 0.01;
    frame.castShadow = true;
    frame.receiveShadow = true;

    painting.position.z = frameDepth / 2 + 0.02;
    frameGroup.add(frame, painting);
    frameGroup.position.set(0, 2.5, -9.8);

    this.object = frameGroup;
    this.scene.add(frameGroup);

    this.camera.position.set(0, 2.5, 4);
    this.controls.target.set(0, 2.5, -9.8);
    return frameGroup;
  }

  startAnimation() {
    this.animate = () => {
      this.animationFrameId = requestAnimationFrame(this.animate);
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
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    window.removeEventListener('resize', this.handleResize);
    if (this.renderer) {
      this.renderer.dispose();
      this.renderer = null;
    }
    if (this.container) {
      this.container.innerHTML = '';
    }
    if (this.scene) {
      this.scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(mat => mat.dispose());
          } else {
            ['map', 'lightMap', 'bumpMap', 'normalMap', 'specularMap', 'envMap']
              .forEach(map => object.material[map]?.dispose());
            object.material.dispose();
          }
        }
      });
      while (this.scene.children.length) {
        this.scene.remove(this.scene.children[0]);
      }
    }
    if (this.controls) {
      this.controls.dispose();
      this.controls = null;
    }
    this.pedestal = null;
    this.object = null;
  }
}

export default SceneInit;