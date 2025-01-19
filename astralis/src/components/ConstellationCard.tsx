import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';

interface ConstellationProps {
  constellation: {
    id: number;
    name: string;
    starPositions: number[][];
    connections: number[][];
  };
}

const Star: React.FC<{ position: number[] }> = ({ position }) => {
  return (
    <mesh position={new THREE.Vector3(...position)}>
      <sphereGeometry args={[0.05, 16, 16]} />
      <meshStandardMaterial 
        color="#ffffff"
        emissive="#64B5F6"
        emissiveIntensity={2}
      />
    </mesh>
  );
};

const StarConnections: React.FC<{ 
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
              color="#ffffff" 
              opacity={0.3} 
              transparent 
            />
          </line>
        );
      })}
    </group>
  );
};

const Scene: React.FC<ConstellationProps> = ({ constellation }) => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      
      {constellation.starPositions.map((position, idx) => (
        <Star key={idx} position={position} />
      ))}
      
      <StarConnections 
        positions={constellation.starPositions}
        connections={constellation.connections}
      />
      
      <Stars 
        radius={50} 
        depth={50} 
        count={1000} 
        factor={4} 
        fade 
        saturation={0}
      />
      <OrbitControls 
        autoRotate 
        autoRotateSpeed={1} 
        enableZoom={false}
      />
    </>
  );
};

export const ConstellationCard: React.FC<ConstellationProps> = ({ 
  constellation 
}) => {
  return (
    <div className="star-container group cursor-pointer">
      <Canvas>
        <Suspense fallback={null}>
          <Scene constellation={constellation} />
        </Suspense>
      </Canvas>
      <div className="constellation-title">
        <h2 className="text-xl font-bold text-white group-hover:text-star-glow transition-colors">
          {constellation.name}
        </h2>
      </div>
    </div>
  );
};