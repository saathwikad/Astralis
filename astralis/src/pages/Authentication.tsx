import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useNavigate } from 'react-router-dom';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  updateProfile,
  signOut
} from 'firebase/auth';
import { auth } from '../firebase/config';

const AuthPage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState('');

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

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

    // Glowing nebula effect
    const nebulaGeometry = new THREE.BufferGeometry();
    const nebulaColors = [];
    const nebulaVertices = [];
    
    // Create nebula particles
    for (let i = 0; i < 1000; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI * 2;
      const radius = 20 + Math.random() * 10;
      
      const x = radius * Math.sin(theta) * Math.cos(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(theta) - 30;
      
      nebulaVertices.push(x, y, z);
      
      // Create colors for nebula - purple and blue hues
      const r = 0.5 + Math.random() * 0.3;
      const g = 0.2 + Math.random() * 0.2;
      const b = 0.8 + Math.random() * 0.2;
      
      nebulaColors.push(r, g, b);
    }
    
    nebulaGeometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(nebulaVertices, 3)
    );
    
    nebulaGeometry.setAttribute(
      'color',
      new THREE.Float32BufferAttribute(nebulaColors, 3)
    );
    
    const nebulaMaterial = new THREE.PointsMaterial({
      size: 0.2,
      transparent: true,
      opacity: 0.7,
      vertexColors: true,
      blending: THREE.AdditiveBlending
    });
    
    const nebula = new THREE.Points(nebulaGeometry, nebulaMaterial);
    scene.add(nebula);

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

      // Rotate stars for subtle movement
      stars.rotation.y += 0.0001;
      
      // Rotate nebula
      nebula.rotation.y += 0.0005;
      nebula.rotation.z += 0.0002;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setUsername('');
    setConfirmPassword('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);
    
    try {
      if (isLogin) {
        // Login with Firebase
        await signInWithEmailAndPassword(auth, email, password);
        navigate('/home');
      } else {
        // Validate passwords match
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match');
        }
        
        // Create new user with Firebase
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // Update profile with username
        if (userCredential.user) {
          await updateProfile(userCredential.user, {
            displayName: username
          });
          
          // Sign out the user after successful registration
          await signOut(auth);
          
          // Show success message and switch to login form
          setSuccessMessage('Account created successfully! Please log in to continue.');
          setIsLogin(true);
          resetForm();
        }
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      <div ref={containerRef} className="absolute inset-0"></div>
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md backdrop-blur-md bg-black/40 rounded-xl p-8 border border-purple-500/30 shadow-lg shadow-purple-500/20">
          <h2 className="text-3xl font-bold text-white text-center mb-6">
            {isLogin ? 'Welcome Back' : 'Join The Cosmos'}
          </h2>
          
          <div className="flex mb-6">
            <button
              className={`flex-1 py-2 transition-all ${isLogin ? 'text-white border-b-2 border-purple-500' : 'text-gray-400'}`}
              onClick={() => {
                setIsLogin(true);
                setError('');
                setSuccessMessage('');
              }}
            >
              Login
            </button>
            <button
              className={`flex-1 py-2 transition-all ${!isLogin ? 'text-white border-b-2 border-purple-500' : 'text-gray-400'}`}
              onClick={() => {
                setIsLogin(false);
                setError('');
                setSuccessMessage('');
              }}
            >
              Sign Up
            </button>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/40 rounded-lg text-red-200">
              {error}
            </div>
          )}
          
          {successMessage && (
            <div className="mb-4 p-3 bg-green-500/20 border border-green-500/40 rounded-lg text-green-200">
              {successMessage}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="mb-4">
                <label htmlFor="username" className="block text-purple-300 mb-2">Username</label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-black/50 border border-purple-500/50 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="StarGazer42"
                  required={!isLogin}
                />
              </div>
            )}
            
            <div className="mb-4">
              <label htmlFor="email" className="block text-purple-300 mb-2">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/50 border border-purple-500/50 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                placeholder="your@email.com"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="password" className="block text-purple-300 mb-2">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/50 border border-purple-500/50 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                placeholder="••••••••"
                required
              />
            </div>
            
            {!isLogin && (
              <div className="mb-4">
                <label htmlFor="confirmPassword" className="block text-purple-300 mb-2">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-black/50 border border-purple-500/50 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="••••••••"
                  required={!isLogin}
                />
              </div>
            )}
            
            {isLogin && (
              <div className="flex justify-end mb-6">
                <button type="button" className="text-purple-400 hover:text-purple-300 text-sm">
                  Forgot your password?
                </button>
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white py-3 rounded-lg font-medium transition-all hover:from-purple-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-purple-600 disabled:opacity-70"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isLogin ? 'Logging in...' : 'Creating account...'}
                </span>
              ) : (
                <span>{isLogin ? 'Login' : 'Create Account'}</span>
              )}
            </button>
          </form>
          
          <div className="mt-6 pt-6 border-t border-purple-500/30 text-center">
            <p className="text-gray-400">
              {isLogin ? 'New to Astralis?' : 'Already have an account?'}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                  setSuccessMessage('');
                }}
                className="ml-2 text-purple-400 hover:text-purple-300"
              >
                {isLogin ? 'Sign Up' : 'Login'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;