import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useNavigate, Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';

const HomePage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [userName, setUserName] = useState('Explorer');

  useEffect(() => {
    // Get current user's display name if available
    if (auth.currentUser?.displayName) {
      setUserName(auth.currentUser.displayName);
    }

    // Set up auth state listener
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        // Redirect to login if not authenticated
        navigate('/auth');
      } else if (user.displayName) {
        setUserName(user.displayName);
      }
    });

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
    
    // Distant galaxies
    const galaxyCount = 3;
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
        transparent: true,
        opacity: 0.7,
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

      // Rotate stars slowly
      stars.rotation.y += 0.0001;
      
      // Rotate galaxies
      galaxies.forEach(galaxy => {
        galaxy.rotation.z += 0.0005;
      });

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      unsubscribe();
      window.removeEventListener('resize', handleResize);
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Function to handle external HTML file navigation
  const openHtmlFile = () => {
    window.open('/starmap/index.html', '_blank');
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      <div ref={containerRef} className="absolute inset-0"></div>
      
      {/* Header / Navigation */}
      <header className="absolute top-0 left-0 right-0 z-10 backdrop-blur-sm bg-black/20 border-b border-purple-500/20">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-white">Astralis</div>
          <div className="flex items-center space-x-4">
            <span className="text-purple-300">Welcome, {userName}</span>
            <button 
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg bg-purple-600/20 border border-purple-500/30 text-white hover:bg-purple-600/40 transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      
      {/* Main content area with navigation buttons */}
      <main className="absolute inset-0 pt-16 px-6 flex items-center justify-center">
        <div className="backdrop-blur-md bg-black/30 border border-purple-500/20 rounded-xl p-8 max-w-4xl w-full">
          <h1 className="text-3xl font-bold text-white mb-4 text-center">Dashboard</h1>
          <p className="text-purple-200 text-center mb-8">
            Your cosmic journey begins here. Choose your destination.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* Button 1: Navigate to Star Constellation React Component */}
            <Link 
              to="/starconstellation" 
              className="px-6 py-4 rounded-xl bg-indigo-600/30 border border-indigo-500/40 text-white hover:bg-indigo-600/50 transition-all text-center font-medium flex flex-col items-center"
            >
              <span className="text-xl mb-1">Star Constellation</span>
              <span className="text-xs text-indigo-200">View the 12 major star constellations and Creae your own one!</span>
            </Link>
            
            {/* Button 2: Navigate to Galaxy Map React Component */}
            <Link 
              to="/galaxy-map" 
              className="px-6 py-4 rounded-xl bg-purple-600/30 border border-purple-500/40 text-white hover:bg-purple-600/50 transition-all text-center font-medium flex flex-col items-center"
            >
              <span className="text-xl mb-1">Astro News</span>
              <span className="text-xs text-purple-200">React Component</span>
            </Link>
            
            {/* Button 3: External URL */}
            <a 
              href="http://localhost:5174/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="px-6 py-4 rounded-xl bg-blue-600/30 border border-blue-500/40 text-white hover:bg-blue-600/50 transition-all text-center font-medium flex flex-col items-center"
            >
              <span className="text-xl mb-1">Solar System</span>
              <span className="text-xs text-blue-200">Watch the planets and stars move in incredible orbits!</span>
            </a>
            
            {/* Button 4: Open Static HTML File */}
            <Link 
              to="/updates" 
              className="px-6 py-4 rounded-xl bg-purple-600/30 border border-purple-500/40 text-white hover:bg-purple-600/50 transition-all text-center font-medium flex flex-col items-center"
            >
              <span className="text-xl mb-1">Astro News</span>
              <span className="text-xs text-purple-200">React Component</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;