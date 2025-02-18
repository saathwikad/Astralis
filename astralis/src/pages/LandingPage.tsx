import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Html } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { StarIcon } from 'lucide-react';

// Shooting Star Component
const ShootingStar = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [position] = useState([
    Math.random() * 20 - 10,
    Math.random() * 10 + 5,
    Math.random() * 10 - 5
  ]);
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.x -= 0.1;
      meshRef.current.position.y -= 0.05;
      
      if (meshRef.current.position.x < -10) {
        meshRef.current.position.x = 10;
        meshRef.current.position.y = Math.random() * 10 + 5;
      }
    }
  });

  return (
    <mesh ref={meshRef} position={position as [number, number, number]}>
      <sphereGeometry args={[0.05, 16, 16]} />
      <meshBasicMaterial color="#ffffff" />
    </mesh>
  );
};

// Planet Component
const Planet = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001;
    }
  });

  return (
    <mesh ref={meshRef} position={[3, 0, -5]}>
      <sphereGeometry args={[1.5, 32, 32]} />
      <meshStandardMaterial
        color="#4B9CDB"
        metalness={0.2}
        roughness={0.8}
      />
      <Html position={[2, 0, 0]}>
        <div className="text-white text-opacity-80 text-sm">
          Create your own constellations
        </div>
      </Html>
    </mesh>
  );
};

// Space Scene Component
const SpaceScene = () => {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1.5} />
      <Stars 
        radius={100} 
        depth={50} 
        count={5000} 
        factor={4} 
        saturation={0}
        fade
        speed={1}
      />
      <Planet />
      {[...Array(10)].map((_, i) => (
        <ShootingStar key={i} />
      ))}
    </>
  );
};

// Feature Card Component
interface FeatureCardProps {
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description }) => (
  <div className="bg-gray-900 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 
                  border border-gray-700 hover:border-blue-500 transition-colors duration-300">
    <StarIcon className="w-8 h-8 text-blue-500 mb-4" />
    <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
    <p className="text-gray-300">{description}</p>
  </div>
);

// Main Landing Page Component
const LandingPage = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* 3D Space Background */}
      <Canvas className="fixed inset-0">
        <SpaceScene />
      </Canvas>

      {/* Content Overlay */}
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="fixed w-full p-6 bg-black bg-opacity-20 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <h1 className="text-white text-2xl font-bold tracking-wider">
              StarMapper
            </h1>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
              <button className="text-gray-300 hover:text-white transition-colors">
                Features
              </button>
              <button className="text-gray-300 hover:text-white transition-colors">
                About
              </button>
              <button 
                onClick={() => navigate('/login')}
                className="text-gray-300 hover:text-white transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg 
                          hover:bg-blue-700 transition-colors"
              >
                Sign Up
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden absolute top-full left-0 right-0 
                          bg-black bg-opacity-90 backdrop-blur-md p-4">
              <div className="flex flex-col space-y-4">
                <button className="text-gray-300 hover:text-white transition-colors">
                  Features
                </button>
                <button className="text-gray-300 hover:text-white transition-colors">
                  About
                </button>
                <button 
                  onClick={() => navigate('/login')}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg 
                            hover:bg-blue-700 transition-colors"
                >
                  Sign Up
                </button>
              </div>
            </div>
          )}
        </nav>

        {/* Hero Section */}
        <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-wider">
            Map Your Universe
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mb-12 leading-relaxed">
            Explore the cosmos, create your own constellations, and join a community
            of stargazers in an immersive 3D experience.
          </p>

          <div className="space-x-6">
            <button
              onClick={() => navigate('/signup')}
              className="px-8 py-4 bg-blue-600 text-white rounded-lg 
                        hover:bg-blue-700 transition-colors duration-300 
                        text-lg font-semibold"
            >
              Start Your Journey
            </button>
            <button
              onClick={() => navigate('/explore')}
              className="px-8 py-4 border-2 border-white text-white rounded-lg 
                        hover:bg-white hover:text-black transition-colors 
                        duration-300 text-lg font-semibold"
            >
              Explore Constellations
            </button>
          </div>
        </div>

        {/* Features Section */}
        <div className="relative bg-black bg-opacity-50 py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
              Discover the Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                title="Create Constellations"
                description="Design and share your own constellations in an interactive 3D environment."
              />
              <FeatureCard
                title="Explore the Sky"
                description="Browse through a vast collection of celestial patterns and learn their stories."
              />
              <FeatureCard
                title="Join the Community"
                description="Connect with fellow stargazers and share your astronomical discoveries."
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="relative bg-black bg-opacity-90 py-8 px-4 text-center">
          <p className="text-gray-400">
            © 2025 StarMapper. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;