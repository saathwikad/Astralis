import React, { Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, PerspectiveCamera, Html } from '@react-three/drei';
import * as THREE from 'three';
import { CONSTELLATIONS } from '../components/ConstellationGrid';

const DetailedStar: React.FC<{ position: number[], index: number }> = ({ position, index }) => {
  return (
    <group>
      {/* Glow effect */}
      <mesh position={new THREE.Vector3(...position)}>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshBasicMaterial color="#64B5F6" transparent opacity={0.2} />
      </mesh>
      {/* Core star */}
      <mesh position={new THREE.Vector3(...position)}>
        <sphereGeometry args={[0.08, 32, 32]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#64B5F6"
          emissiveIntensity={2}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
      {/* Star label */}
      <Html position={[position[0] + 0.2, position[1] + 0.2, position[2]]}>
  <div className="text-white text-sm bg-space-dark/50 px-2 py-1 rounded">
    Star {index + 1}
  </div>
</Html>
    </group>
  );
};

const DetailedConnections: React.FC<{ 
  positions: number[][];
  connections: number[][];
}> = ({ positions, connections }) => {
  return (
    <group>
      {connections.map((connection, idx) => {
        const start = positions[connection[0]];
        const end = positions[connection[1]];
        
        return (
          <line key={idx}>
            <bufferGeometry>
              <float32BufferAttribute
                attach="attributes-position"
                array={new Float32Array([...start, ...end])}
                count={2}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial
              attach="material"
              color="#4B9CDB"
              linewidth={2}
              opacity={0.6}
              transparent
            />
          </line>
        );
      })}
    </group>
  );
};

const DetailedScene: React.FC<{ constellation: any }> = ({ constellation }) => {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 5]} />
      <ambientLight intensity={0.5} />
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
      
      {constellation.starPositions.map((position: number[], idx: number) => (
        <DetailedStar key={idx} position={position} index={idx} />
      ))}
      
      <DetailedConnections
        positions={constellation.starPositions}
        connections={constellation.connections}
      />
      
      <OrbitControls
        enableZoom
        enablePan
        enableRotate
        maxDistance={10}
        minDistance={2}
      />
    </>
  );
};

const ConstellationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const constellation = CONSTELLATIONS.find(c => c.id === Number(id));

  if (!constellation) {
    return <div>Constellation not found</div>;
  }

  return (
    <div className="h-screen bg-space-dark">
      <button
        onClick={() => navigate('/')}
        className="absolute top-4 left-4 z-10 px-4 py-2 bg-space-light rounded-lg 
                   text-white hover:bg-star-glow transition-colors duration-300"
      >
        ← Back
      </button>
      <div className="absolute top-4 right-4 z-10 p-4 bg-space-light/80 rounded-lg">
        <h1 className="text-2xl font-bold text-white mb-2">{constellation.name}</h1>
        <p className="text-white/80">Click and drag to rotate • Scroll to zoom</p>
      </div>
      <Canvas className="h-full">
        <Suspense fallback={null}>
          <DetailedScene constellation={constellation} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default ConstellationDetail;