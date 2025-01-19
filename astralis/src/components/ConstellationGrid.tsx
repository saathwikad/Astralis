import React from 'react';
import { ConstellationCard } from './ConstellationCard';

export const CONSTELLATIONS = [
  {
    id: 1,
    name: 'Ursa Major',
    starPositions: [
      [-1, 1, 0], [-0.5, 1, 0], [0.5, 1, 0],
      [-0.5, 0, 0], [0, 0, 0],
      [-1, -1, 0], [1, -1, 0]
    ],
    connections: [[0, 1], [1, 2], [1, 3], [3, 4], [4, 5], [4, 6]]
  },
  {
    id: 2,
    name: 'Orion',
    starPositions: [
      [0, 1, 0], [-1, 0.5, 0], [1, 0.5, 0],
      [-0.5, 0, 0], [0, 0, 0], [0.5, 0, 0],
      [0, -1, 0]
    ],
    connections: [[0, 1], [0, 2], [1, 3], [2, 5], [3, 4], [4, 5], [4, 6]]
  },
  {
    id: 3,
    name: 'Cassiopeia',
    starPositions: [
      [-1, 0, 0], [-0.5, 0.5, 0], [0, 0, 0],
      [0.5, -0.5, 0], [1, 0, 0]
    ],
    connections: [[0, 1], [1, 2], [2, 3], [3, 4]]
  }
];

const ConstellationGrid: React.FC = () => {
  return (
    <div className="min-h-screen bg-space-dark p-8">
      <h1 className="text-4xl font-bold text-center text-white mb-12">
        Explore Constellations
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {CONSTELLATIONS.map((constellation) => (
          <ConstellationCard
            key={constellation.id}
            constellation={constellation}
          />
        ))}
      </div>
    </div>
  );
};

export default ConstellationGrid;