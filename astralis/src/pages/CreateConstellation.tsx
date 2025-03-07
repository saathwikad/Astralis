// src/components/CreateConstellation.tsx
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas, ThreeEvent } from '@react-three/fiber';
import { OrbitControls, Stars, Html } from '@react-three/drei';
import * as THREE from 'three';
import { X, Save } from 'lucide-react';
import ConstellationTutorial from './ConstellationTutorial';
import { saveConstellation } from '../firebase/constellationService';
import { auth } from '../firebase/config';

interface Star {
  position: [number, number, number];
  id: number;
}

interface Connection {
  start: number;
  end: number;
}

const StarPoint: React.FC<{
  position: [number, number, number];
  id: number;
  selected: boolean;
  onClick: (id: number) => void;
}> = ({ position, id, selected, onClick }) => {
  return (
    <group onClick={(e) => {
      e.stopPropagation();
      onClick(id);
    }}>
      <mesh position={new THREE.Vector3(...position)}>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshBasicMaterial color="#64B5F6" transparent opacity={0.2} />
      </mesh>
      <mesh position={new THREE.Vector3(...position)}>
        <sphereGeometry args={[0.08, 32, 32]} />
        <meshStandardMaterial
          color={selected ? "#FFD700" : "#ffffff"}
          emissive={selected ? "#FFD700" : "#64B5F6"}
          emissiveIntensity={2}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
      <Html position={[position[0] + 0.2, position[1] + 0.2, position[2]]}>
        <div className="text-white text-sm bg-space-dark/50 px-2 py-1 rounded">
          Star {id + 1}
        </div>
      </Html>
    </group>
  );
};

const ConnectionLines: React.FC<{
  stars: Star[];
  connections: Connection[];
}> = ({ stars, connections }) => {
  return (
    <group>
      {connections.map((connection, idx) => {
        const start = stars[connection.start].position;
        const end = stars[connection.end].position;
        
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

const Scene: React.FC<{
  stars: Star[];
  connections: Connection[];
  selectedStar: number | null;
  mode: 'add' | 'connect' | 'delete';
  onStarClick: (id: number) => void;
  onAddStar: (position: [number, number, number]) => void;
}> = ({ stars, connections, selectedStar, mode, onStarClick, onAddStar }) => {
  const handlePlaneClick = (e: ThreeEvent<MouseEvent>) => {
    if (mode === 'add') {
      e.stopPropagation();
      const position: [number, number, number] = [
        e.point.x,
        e.point.y,
        e.point.z
      ];
      onAddStar(position);
    }
  };

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
      
      {/* Add an invisible plane to catch clicks */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} onClick={handlePlaneClick}>
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial visible={false} />
      </mesh>
      
      {stars.map((star) => (
        <StarPoint
          key={star.id}
          position={star.position}
          id={star.id}
          selected={star.id === selectedStar}
          onClick={onStarClick}
        />
      ))}
      
      <ConnectionLines
        stars={stars}
        connections={connections}
      />
    </>
  );
};

const CreateConstellation: React.FC = () => {
  const navigate = useNavigate();
  const [stars, setStars] = useState<Star[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedStar, setSelectedStar] = useState<number | null>(null);
  const [mode, setMode] = useState<'add' | 'connect' | 'delete'>('add');
  const [constellationName, setConstellationName] = useState('');
  const [isTutorialOpen, setIsTutorialOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddStar = useCallback((position: [number, number, number]) => {
    setStars(prev => [...prev, { position, id: prev.length }]);
  }, []);

  const handleStarClick = useCallback((id: number) => {
    if (mode === 'delete') {
      setStars(prev => prev.filter(star => star.id !== id));
      setConnections(prev => prev.filter(conn => 
        conn.start !== id && conn.end !== id
      ));
    } else if (mode === 'connect') {
      if (selectedStar === null) {
        setSelectedStar(id);
      } else if (selectedStar !== id) {
        setConnections(prev => [...prev, {
          start: Math.min(selectedStar, id),
          end: Math.max(selectedStar, id)
        }]);
        setSelectedStar(null);
      }
    }
  }, [mode, selectedStar]);

  const handleSave = useCallback(async () => {
    if (!auth.currentUser) {
      alert('Please sign in to save your constellation');
      navigate('/login');
      return;
    }

    if (!constellationName) {
      alert('Please enter a name for your constellation');
      return;
    }

    if (stars.length < 2) {
      alert('Please add at least 2 stars to your constellation');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const constellation = {
        name: constellationName,
        latinName: constellationName,
        season: 'Spring' as const,
        description: `Custom constellation created by ${auth.currentUser.displayName || 'a user'}`,
        starPositions: stars.map(star => Array.from(star.position) as [number, number, number]),
        connections: connections.map(conn => [conn.start, conn.end] as [number, number]),
      };

      await saveConstellation(constellation);
      navigate('/starconstellation');
    } catch (err) {
      console.error('Error saving constellation:', err);
      setError('Failed to save constellation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [constellationName, stars, connections, navigate]);

  return (
    <div className="h-screen bg-space-dark">
      <ConstellationTutorial 
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
      />

      <div className="absolute top-4 left-4 z-10 space-x-4 flex items-center flex-wrap gap-2">
        <input 
          type="text"
          placeholder="Constellation Name"
          value={constellationName}
          onChange={(e) => setConstellationName(e.target.value)}
          className="px-4 py-2 rounded bg-space-light text-white placeholder-gray-300"
        />
        
        <button
          onClick={() => setIsTutorialOpen(true)}
          className="px-4 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-500 transition-colors duration-300"
        >
          Tutorial
        </button>

        <button
          onClick={() => setMode('add')}
          className={`px-4 py-2 rounded-lg ${
            mode === 'add' ? 'bg-star-glow' : 'bg-space-light'
          } text-white transition-colors duration-300`}
        >
          Add Stars
        </button>

        <button
          onClick={() => setMode('connect')}
          className={`px-4 py-2 rounded-lg ${
            mode === 'connect' ? 'bg-star-glow' : 'bg-space-light'
          } text-white transition-colors duration-300`}
        >
          Connect Stars
        </button>

        <button
          onClick={() => setMode('delete')}
          className={`px-4 py-2 rounded-lg ${
            mode === 'delete' ? 'bg-star-glow' : 'bg-space-light'
          } text-white transition-colors duration-300`}
        >
          Delete Stars
        </button>

        <button
          onClick={handleSave}
          disabled={isLoading}
          className={`px-4 py-2 ${
            isLoading ? 'bg-gray-600' : 'bg-green-600 hover:bg-green-500'
          } rounded-lg text-white transition-colors duration-300 flex items-center gap-2`}
        >
          <Save size={20} />
          {isLoading ? 'Saving...' : 'Save'}
        </button>

        <button
          onClick={() => navigate('/starconstellation')}
          className="px-4 py-2 bg-red-600 rounded-lg text-white hover:bg-red-500 transition-colors duration-300 flex items-center gap-2"
        >
          <X size={20} />
          Cancel
        </button>
      </div>

      {error && (
        <div className="absolute top-20 left-4 z-10 bg-red-500 text-white p-2 rounded">
          {error}
        </div>
      )}

      <Canvas className="h-full">
        <Scene
          stars={stars}
          connections={connections}
          selectedStar={selectedStar}
          mode={mode}
          onStarClick={handleStarClick}
          onAddStar={handleAddStar}
        />
        <OrbitControls
          enableZoom
          enablePan
          enableRotate
          maxDistance={10}
          minDistance={2}
        />
      </Canvas>
    </div>
  );
};

export default CreateConstellation;