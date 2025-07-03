import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.160.1/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.160.1/examples/jsm/controls/OrbitControls.js';

function initViewer(containerId, modelPath) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container with id "${containerId}" not found.`);
    return;
  }

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf9f3e3);

  const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
  camera.position.set(0, 1, 3);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  const light = new THREE.HemisphereLight(0xffffff, 0x444444);
  scene.add(light);

  const loader = new GLTFLoader();

  console.log(`Loading model from: ${modelPath}`);

  loader.load(
    modelPath,
    gltf => {
      console.log('Model loaded successfully:', gltf);
      scene.add(gltf.scene);
    },
    xhr => {
      if (xhr.lengthComputable) {
        const percentComplete = (xhr.loaded / xhr.total) * 100;
        console.log(`Model ${containerId} ${percentComplete.toFixed(2)}% loaded`);
      }
    },
    error => {
      console.error(`Failed to load model for container "${containerId}":`, error);
    }
  );

  function resizeRenderer() {
    const width = container.clientWidth;
    const height = container.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  window.addEventListener('resize', resizeRenderer);
  document.addEventListener('fullscreenchange', resizeRenderer);

  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }

  animate();
}

// Initialize viewers with your model URLs
initViewer('viewer1', 'assets/bella.glb');
initViewer('viewer2', 'assets/xani.glb');

