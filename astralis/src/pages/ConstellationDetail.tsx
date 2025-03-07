import React, { Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Html } from '@react-three/drei';
import * as THREE from 'three';
import { MAJOR_CONSTELLATIONS } from '../components/ConstellationGrid';

interface Constellation {
  id: number;
  name: string;
  latinName: string;
  season: 'Spring' | 'Summer' | 'Fall' | 'Winter';
  description: string;
  isCreateCard?: boolean;
  starPositions: number[][];
  connections: number[][];
}

interface DetailedStarProps {
  position: number[];
  index: number;
  starName?: string;
}

const DetailedStar: React.FC<DetailedStarProps> = ({ position, index, starName }) => {
  return (
    <group>
      {/* Outer glow */}
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
      {/* Label */}
      <Html position={[position[0] + 0.2, position[1] + 0.2, position[2]]}>
        <div className="text-white text-sm bg-gray-900/70 px-2 py-1 rounded">
          {starName || `Star ${index + 1}`}
        </div>
      </Html>
    </group>
  );
};

interface DetailedConnectionsProps {
  positions: number[][];
  connections: number[][];
}

const DetailedConnections: React.FC<DetailedConnectionsProps> = ({ 
  positions, 
  connections 
}) => {
  return (
    <group>
      {connections.map((connection, idx) => {
        const start = positions[connection[0]];
        const end = positions[connection[1]];
        
        return (
          <line key={idx}>
            <bufferGeometry>
              <bufferAttribute
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

interface DetailedSceneProps {
  constellation: Constellation;
}

const DetailedScene: React.FC<DetailedSceneProps> = ({ constellation }) => {
  return (
    <>
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
      
      {constellation.starPositions.map((position, idx) => (
        <DetailedStar 
          key={idx} 
          position={position} 
          index={idx} 
        />
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

const ConstellationDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const constellation = MAJOR_CONSTELLATIONS.find(c => c.id === Number(id));

  if (!constellation || constellation.isCreateCard) {
    return (
      <div className="h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Constellation not found</h2>
          <button
            onClick={() => navigate('/starconstellation')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Return to Gallery
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-900">
      <button
        onClick={() => navigate('/starconstellation')}
        className="absolute top-4 left-4 z-10 px-4 py-2 bg-gray-800 rounded-lg 
                   text-white hover:bg-blue-600 transition-colors duration-300"
      >
        ← Back
      </button>
      <div className="absolute top-4 right-4 z-10 p-4 bg-gray-800/80 rounded-lg max-w-md">
        <h1 className="text-2xl font-bold text-white mb-2">{constellation.name}</h1>
        <p className="text-gray-300 text-sm mb-2">{constellation.latinName}</p>
        <p className="text-white/80 mb-4">{constellation.description}</p>
        <p className="text-white/60 text-sm">Season: {constellation.season}</p>
        <p className="text-white/60 text-sm mt-2">Click and drag to rotate • Scroll to zoom</p>
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