import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useNavigate } from 'react-router-dom';

const AstronomyLanding: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [titleVisible, setTitleVisible] = useState(false);
  const [buttonVisible, setButtonVisible] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);

    // Stars
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.05,
    });

    const starVertices = [];
    for (let i = 0; i < 10000; i++) {
      const x = (Math.random() - 0.5) * 2000;
      const y = (Math.random() - 0.5) * 2000;
      const z = -Math.random() * 2000;
      starVertices.push(x, y, z);
    }

    starGeometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(starVertices, 3)
    );
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // Galaxies
    const galaxyCount = 5;
    const galaxies: THREE.Points[] = [];

    for (let i = 0; i < galaxyCount; i++) {
      const galaxyGeometry = new THREE.BufferGeometry();
      const galaxyMaterial = new THREE.PointsMaterial({
        color: new THREE.Color(
          Math.random() * 0.5 + 0.5,
          Math.random() * 0.5 + 0.5,
          Math.random() * 0.5 + 0.5
        ),
        size: 0.05,
      });

      const spiralVertices = [];
      const arms = 5;
      const particlesPerArm = 500;

      for (let a = 0; a < arms; a++) {
        for (let i = 0; i < particlesPerArm; i++) {
          const angle = (i / particlesPerArm) * Math.PI * 10 + ((Math.PI * 2) / arms) * a;
          const radius = (i / particlesPerArm) * 10;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          const z = (Math.random() - 0.5) * 2;
          spiralVertices.push(x, y, z);
        }
      }

      galaxyGeometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(spiralVertices, 3)
      );
      
      const galaxy = new THREE.Points(galaxyGeometry, galaxyMaterial);
      galaxy.position.set(
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 100,
        -Math.random() * 100 - 50
      );
      galaxy.rotation.x = Math.random() * Math.PI;
      galaxy.rotation.y = Math.random() * Math.PI;
      galaxy.rotation.z = Math.random() * Math.PI;
      
      scene.add(galaxy);
      galaxies.push(galaxy);
    }

    // Meteor showers
    const meteorCount = 20;
    const meteors: THREE.Mesh[] = [];
    
    for (let i = 0; i < meteorCount; i++) {
      const meteorGeometry = new THREE.CylinderGeometry(0, 0.05, 2, 8);
      const meteorMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.8,
      });
      
      const meteor = new THREE.Mesh(meteorGeometry, meteorMaterial);
      
      // Set initial positions off-screen
      meteor.position.set(
        Math.random() * 100 - 50,
        Math.random() * 100 + 50,
        Math.random() * -50
      );
      
      // Set rotation for meteor direction
      meteor.rotation.z = Math.PI / 4;
      meteor.rotation.y = Math.random() * Math.PI;
      
      // Set random speed
      const speed = Math.random() * 0.2 + 0.1;
      meteor.userData = { speed };
      
      scene.add(meteor);
      meteors.push(meteor);
    }

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);

      // Rotate stars slightly for subtle movement
      stars.rotation.y += 0.0001;
      
      // Rotate galaxies
      galaxies.forEach(galaxy => {
        galaxy.rotation.z += 0.001;
      });
      
      // Animate meteors
      meteors.forEach(meteor => {
        meteor.position.x -= meteor.userData.speed;
        meteor.position.y -= meteor.userData.speed * 1.5;
        
        // Reset meteor when it goes off screen
        if (meteor.position.y < -50 || meteor.position.x < -50) {
          meteor.position.set(
            Math.random() * 100 - 50,
            Math.random() * 100 + 50,
            Math.random() * -50
          );
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    // Show title with delay
    setTimeout(() => {
      setTitleVisible(true);
      
      // Show button after title
      setTimeout(() => {
        setButtonVisible(true);
      }, 2000);
    }, 1500);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  const handleExplore = () => {
    navigate('/auth'); // Route to login/signup page
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      <div ref={containerRef} className="absolute inset-0"></div>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <h1 
          className={`text-5xl md:text-7xl font-bold text-white mb-8 transition-opacity duration-1000 ${
            titleVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          Astralis
        </h1>
        <button
          onClick={handleExplore}
          className={`px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg text-lg hover:bg-white hover:text-black transition-all duration-300 ${
            buttonVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          Explore The Universe
        </button>
      </div>
    </div>
  );
};

export default AstronomyLanding;