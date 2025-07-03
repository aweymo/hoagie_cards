import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.160.1/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.160.1/examples/jsm/controls/OrbitControls.js';

function initViewer(containerId, modelPath) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container with id "${containerId}" not found.`);
    return;
  }

  // Loading indicator
  const loadingMsg = document.createElement('div');
  loadingMsg.style.cssText = `
    position: absolute;
    top: 10px; left: 10px;
    color: white;
    background-color: rgba(0,0,0,0.7);
    padding: 5px 10px;
    border-radius: 5px;
    z-index: 100;
  `;
  loadingMsg.textContent = 'Loading 3D model...';
  container.style.position = 'relative'; // Ensure container can position absolute children
  container.appendChild(loadingMsg);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000); // Black background

  const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
  camera.position.set(0, 1, 3);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.25;

  // Lighting
  scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 1));
  scene.add(new THREE.AmbientLight(0x404040, 0.8));
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(1, 1, 1).normalize();
  scene.add(directionalLight);
  const pointLight = new THREE.PointLight(0xffffff, 0.5, 10);
  pointLight.position.set(2, 3, 4);
  scene.add(pointLight);

  const loader = new GLTFLoader();

  console.log(`Loading model from: ${modelPath}`);

  fetch(modelPath)
    .then(response => {
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      return response;
    })
    .then(() => {
      loader.load(
        modelPath,
        gltf => {
          console.log('Model loaded successfully:', gltf);
          container.removeChild(loadingMsg);
          scene.add(gltf.scene);

          // Auto-scale and center model
          const box = new THREE.Box3().setFromObject(gltf.scene);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z);
          const scale = 1.0 / maxDim;

          gltf.scene.position.sub(center);
          gltf.scene.scale.set(scale, scale, scale);

          // Animate rotation
          function animateModel() {
            requestAnimationFrame(animateModel);
            gltf.scene.rotation.y += 0.005;
            renderer.render(scene, camera);
          }
          animateModel();
        },
        xhr => {
          if (xhr.lengthComputable) {
            const percentComplete = (xhr.loaded / xhr.total) * 100;
            console.log(`Model ${containerId} ${percentComplete.toFixed(2)}% loaded`);
            loadingMsg.textContent = `Loading: ${percentComplete.toFixed(0)}%`;
          }
        },
        error => {
          console.error(`Failed to load model for container "${containerId}":`, error);
          loadingMsg.textContent = 'Error loading model';
          loadingMsg.style.color = 'red';

          const geometry = new THREE.BoxGeometry(1, 1, 1);
          const material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
          const cube = new THREE.Mesh(geometry, material);
          scene.add(cube);
        }
      );
    })
    .catch(error => {
      console.error(`Failed to access model file: ${error}`);
      loadingMsg.textContent = `Error: Model not found (${modelPath})`;
      loadingMsg.style.color = 'red';
    });

  function resizeRenderer() {
    const width = container.clientWidth;
    const height = container.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  resizeRenderer();

  window.addEventListener('resize', resizeRenderer);
  document.addEventListener('fullscreenchange', resizeRenderer);

  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();
}

document.addEventListener('DOMContentLoaded', () => {
  initViewer('viewer1', 'assets/bella.glb');
  initViewer('viewer2', 'assets/xani.glb');
});
