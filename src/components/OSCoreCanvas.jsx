import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function OSCoreCanvas({ scrollProgress = 0 }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 500;

    // Scene setup
    const scene = new THREE.Scene();

    // Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 8.5);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Group to hold all 180.OS 3D elements
    const osGroup = new THREE.Group();
    scene.add(osGroup);

    // --- 1. Inner Core (Matte Black Spherical Kernel) ---
    const coreGeo = new THREE.SphereGeometry(1.2, 64, 64);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x0a0a0c,
      roughness: 0.3,
      metalness: 0.8,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    osGroup.add(coreMesh);

    // --- 2. 180° Equatorial Ring (System Meridian) ---
    const ringGeo = new THREE.TorusGeometry(1.7, 0.04, 32, 100, Math.PI); // Half circle 180°
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0x111111,
      roughness: 0.2,
      metalness: 0.9,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    osGroup.add(ringMesh);

    // Second complementary ring for full balance
    const ring2Geo = new THREE.TorusGeometry(1.7, 0.02, 32, 100);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0xcccccc,
      roughness: 0.1,
      metalness: 0.5,
      transparent: true,
      opacity: 0.4,
    });
    const ring2Mesh = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2Mesh.rotation.x = Math.PI / 3;
    osGroup.add(ring2Mesh);

    // --- 3. Layered Glass Disc Panels (Outer Architecture) ---
    const glassGeo = new THREE.CylinderGeometry(2.4, 2.4, 0.03, 64);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.35,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.9,
      ior: 1.5,
      reflectivity: 0.5,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
    });

    const topGlass = new THREE.Mesh(glassGeo, glassMat);
    topGlass.position.y = 0.6;
    osGroup.add(topGlass);

    const bottomGlass = new THREE.Mesh(glassGeo, glassMat);
    bottomGlass.position.y = -0.6;
    osGroup.add(bottomGlass);

    // --- 4. Orbiting UI Nodes & Indicators ---
    const nodeGroup = new THREE.Group();
    const nodeGeo = new THREE.SphereGeometry(0.08, 16, 16);
    const nodeMat = new THREE.MeshBasicMaterial({ color: 0x000000 });

    const numNodes = 6;
    for (let i = 0; i < numNodes; i++) {
      const angle = (i / numNodes) * Math.PI * 2;
      const radius = 2.8;
      const node = new THREE.Mesh(nodeGeo, nodeMat);
      node.position.set(Math.cos(angle) * radius, Math.sin(angle) * 0.5, Math.sin(angle) * radius);
      nodeGroup.add(node);
    }
    osGroup.add(nodeGroup);

    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.5);
    dirLight1.position.set(5, 8, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xffffff, 1.0);
    dirLight2.position.set(-5, -5, -2);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0xffffff, 1.5, 10);
    pointLight.position.set(0, 0, 3);
    scene.add(pointLight);

    // --- Animation & Render Loop ---
    let reqId;
    let targetRotY = 0;
    let targetRotX = 0;

    const animate = () => {
      // Base continuous rotation
      osGroup.rotation.y += 0.004;
      nodeGroup.rotation.y -= 0.008;

      // React to scroll progress (rotate 180° smoothly)
      const scrollRot = (window.scrollY / (document.body.scrollHeight || 1)) * Math.PI * 2;
      osGroup.rotation.x = Math.sin(scrollRot * 0.5) * 0.3;
      osGroup.rotation.z = Math.cos(scrollRot * 0.5) * 0.15;

      // Expand glass layers slightly as user scrolls
      const separation = 0.6 + Math.sin(scrollRot) * 0.3;
      topGlass.position.y = separation;
      bottomGlass.position.y = -separation;

      renderer.render(scene, camera);
      reqId = requestAnimationFrame(animate);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    />
  );
}
