import * as THREE from 'three';
import type { DicomVolumeData } from './dicomService';

export const initThreeScene = (canvas: HTMLCanvasElement) => {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
  camera.position.z = 2;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
  dirLight.position.set(1, 1, 2);
  scene.add(dirLight);

  let animationId: number;
  const render = () => {
    animationId = requestAnimationFrame(render);
    renderer.render(scene, camera);
  };
  render();

  const cleanup = () => {
    cancelAnimationFrame(animationId);
    renderer.dispose();
  };

  return { scene, camera, renderer, cleanup };
};

export const renderVolumeData = (scene: THREE.Scene, volumeData: DicomVolumeData) => {
  // A simplistic visualization: point cloud or slice-based proxy for volume rendering
  // Since full raymarching requires complex shaders and a 3D texture,
  // we will construct a point cloud representing dense pixels for a simple 3D effect.

  // Clean up old volume objects
  const existingVolume = scene.getObjectByName('dicomVolume');
  if (existingVolume) {
    scene.remove(existingVolume);
  }

  const { pixelData, dimensions, spacing } = volumeData;
  const [width, height, depth] = dimensions;
  const [sx, sy, sz] = spacing;

  // Calculate center offsets
  const cx = (width * sx) / 2;
  const cy = (height * sy) / 2;
  const cz = (depth * sz) / 2;

  // Max points limit to avoid performance death on client
  const MAX_POINTS = 500000;
  let pointsCount = 0;

  const positions = [];
  const colors = [];

  // Find min/max for normalization
  let min = Infinity, max = -Infinity;
  for (let i = 0; i < pixelData.length; i++) {
      if (pixelData[i] < min) min = pixelData[i];
      if (pixelData[i] > max) max = pixelData[i];
  }
  const range = max - min;

  // Simple threshold to show only denser tissues (like bone)
  const threshold = min + range * 0.7;

  const step = Math.max(1, Math.floor(Math.pow(pixelData.length / MAX_POINTS, 1/3)));

  for (let z = 0; z < depth; z+=step) {
    for (let y = 0; y < height; y+=step) {
      for (let x = 0; x < width; x+=step) {
        const i = z * width * height + y * width + x;
        const val = pixelData[i];

        if (val > threshold && pointsCount < MAX_POINTS) {
          const px = (x * sx) - cx;
          const py = -(y * sy) + cy; // Flip Y for medical coords
          const pz = (z * sz) - cz;

          positions.push(px * 0.01, py * 0.01, pz * 0.01); // Scale down

          const normalized = (val - threshold) / (max - threshold);
          colors.push(normalized, normalized, normalized);

          pointsCount++;
        }
      }
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.01,
    vertexColors: true,
    transparent: true,
    opacity: 0.8
  });

  const points = new THREE.Points(geometry, material);
  points.name = 'dicomVolume';
  scene.add(points);
};
