import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const ConstellationScene = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const frameIdRef = useRef(null);
  const [connectedStars, setConnectedStars] = useState([]);
  const [selectedStar, setSelectedStar] = useState(null);

  // Ursa Major star positions
  const starPositions = [
    { x: 0, y: 0, z: -2 }, { x: 1, y: 0.5, z: -2 }, { x: 2, y: 1, z: -2 },
    { x: 3, y: 1, z: -2 }, { x: 4, y: 1.5, z: -2 }, { x: 5, y: 1.5, z: -2 },
    { x: 6, y: 1, z: -2 },
  ];

  const correctConnections = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6]];

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene Setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    rendererRef.current = renderer;
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Starry Background
    const starsGeometry = new THREE.BufferGeometry();
    const starVertices = Array.from({ length: 5000 }, () => (Math.random() - 0.5) * 2000);
    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    const starMaterial = new THREE.PointsMaterial({ color: 0xFFFFFF, size: 0.5 });
    scene.add(new THREE.Points(starsGeometry, starMaterial));

    // Stars for Constellation
    const stars = [];
    const starMaterialConst = new THREE.MeshPhongMaterial({ color: 0xFFFFFF, emissive: 0x444444 });
    const starGeometry = new THREE.SphereGeometry(0.05, 32, 32);
    starPositions.forEach((pos, idx) => {
      const star = new THREE.Mesh(starGeometry, starMaterialConst.clone());
      star.position.set(pos.x, pos.y, pos.z);
      star.userData.index = idx;
      stars.push(star);
      scene.add(star);
    });

    // Lighting
    scene.add(new THREE.AmbientLight(0x222222));
    const light = new THREE.DirectionalLight(0xFFFFFF, 1);
    light.position.set(5, 5, 5);
    scene.add(light);

    // Lines Group
    const linesGroup = new THREE.Group();
    scene.add(linesGroup);

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleClick = (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(stars);

      if (intersects.length > 0) {
        const clickedStar = intersects[0].object;
        if (selectedStar === null) {
          setSelectedStar(clickedStar.userData.index);
        } else {
          const newConnection = [selectedStar, clickedStar.userData.index].sort((a, b) => a - b);
          if (!connectedStars.some(([a, b]) => a === newConnection[0] && b === newConnection[1])) {
            setConnectedStars((prev) => [...prev, newConnection]);
          }
          setSelectedStar(null);
        }
      }
    };

    window.addEventListener('click', handleClick);

    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('click', handleClick);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameIdRef.current);
      mountRef.current.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    const linesGroup = scene.children.find((child) => child.type === 'Group');
    if (!linesGroup) return;

    linesGroup.clear();

    const starMeshes = scene.children.filter((child) => child.type === 'Mesh');

    connectedStars.forEach(([startIdx, endIdx]) => {
      const startPos = starMeshes[startIdx].position;
      const endPos = starMeshes[endIdx].position;
      const geometry = new THREE.BufferGeometry().setFromPoints([startPos, endPos]);
      const line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: 0x4444ff }));
      linesGroup.add(line);
    });

    const isComplete = correctConnections.every(([a, b]) =>
      connectedStars.some(([x, y]) => (x === a && y === b) || (x === b && y === a))
    );

    if (isComplete) {
      starMeshes.forEach((star) => star.material.emissive.setHex(0xFF0000));
    }
  }, [connectedStars]);

  return <div ref={mountRef} style={{ width: '100%', height: '100vh' }} />;
};

export default ConstellationScene;
