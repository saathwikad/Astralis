import React, { Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { PlusCircle } from 'lucide-react';
import * as THREE from 'three';

interface Constellation {
  id: number;
  name: string;
  latinName?: string;
  season?: 'Spring' | 'Summer' | 'Fall' | 'Winter';
  description?: string;
  isCreateCard?: boolean;
  starPositions: number[][];
  connections: number[][];
}

interface ConstellationProps {
  constellation: Constellation;
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
              <bufferAttribute
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
  const navigate = useNavigate();

  const handleClick = () => {
    if (constellation.isCreateCard) {
      navigate('/create');
    } else {
      navigate(`/constellation/${constellation.id}`);
    }
  };

  return (
    <div 
      className="relative h-[300px] rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 group cursor-pointer"
      onClick={handleClick}
    >
      {constellation.isCreateCard ? (
        <div className="flex items-center justify-center h-full bg-gray-900 bg-opacity-50 rounded-lg p-6">
          <div className="text-center">
            <PlusCircle className="mx-auto mb-4 text-white" size={48} />
            <h2 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
              Create Constellation
            </h2>
          </div>
        </div>
      ) : (
        <>
          <Canvas>
            <Suspense fallback={null}>
              <Scene constellation={constellation} />
            </Suspense>
          </Canvas>
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
            <h2 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
              {constellation.name}
            </h2>
            {constellation.season && (
              <p className="text-sm text-gray-300">{constellation.season}</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};
