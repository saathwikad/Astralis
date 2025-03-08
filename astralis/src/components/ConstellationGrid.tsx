import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Constellation } from '../assets/types';
import { ConstellationCard } from './ConstellationCard';
import { getUserConstellations } from '../firebase/constellationService';
import { auth } from '../firebase/config';
import { Home } from 'lucide-react';

export const MAJOR_CONSTELLATIONS: Constellation[] = [
  {
    id: 0,
    name: 'Create Constellation',
    isCreateCard: true,
    starPositions: [],
    connections: [],
    latinName: "",
    season: "Spring", // Changed from string to specific union type
    description: ""
  },
  {
    id: 1,
    name: "Ursa Major",
    latinName: "Ursa Major",
    season: "Spring",
    description: "The Great Bear, containing the Big Dipper asterism",
    starPositions: [
      [-1, 1, 0],    // Dubhe
      [-0.5, 0.8, 0], // Merak
      [0, 0.6, 0],   // Phecda
      [0.5, 0.4, 0], // Megrez
      [1, 0.2, 0],   // Alioth
      [1.5, 0, 0],   // Mizar
      [2, -0.2, 0]   // Alkaid
    ],
    connections: [[0,1], [1,2], [2,3], [3,4], [4,5], [5,6]]
  },
  {
    id: 2,
    name: "Leo",
    latinName: "Leo",
    season: "Spring",
    description: "The Lion, featuring the distinctive sickle pattern",
    starPositions: [
      [0, 1, 0],     // Regulus
      [0.5, 1.5, 0], // Algieba
      [1, 1.8, 0],   // Zosma
      [1.5, 1.5, 0], // Denebola
      [0.2, 1.3, 0], // Rasalas
      [0.3, 0.7, 0]  // Subra
    ],
    connections: [[0,5], [5,4], [4,1], [1,2], [2,3]]
  },
  {
    id: 3,
    name: "Virgo",
    latinName: "Virgo",
    season: "Spring",
    description: "The Maiden, featuring the bright star Spica",
    starPositions: [
      [0, 1.5, 0],   // Spica
      [0.5, 2, 0],   // Gamma Virginis
      [1, 1.8, 0],   // Vindemiatrix
      [0.5, 1, 0],   // Zaniah
      [0, 0.5, 0]    // Heze
    ],
    connections: [[0,4], [4,3], [3,1], [1,2]]
  },
  {
    id: 4,
    name: "Scorpius",
    latinName: "Scorpius",
    season: "Summer",
    description: "The Scorpion, with its distinctive curved tail",
    starPositions: [
      [0, 1, 0],     // Antares
      [0.3, 1.5, 0], // Graffias
      [0.6, 1.8, 0], // Dschubba
      [0.9, 1.5, 0], // Pi Scorpii
      [1.2, 1, 0],   // Shaula
      [1.4, 0.5, 0]  // Lesath
    ],
    connections: [[0,1], [1,2], [2,3], [3,4], [4,5]]
  },
  {
    id: 5,
    name: "Sagittarius",
    latinName: "Sagittarius",
    season: "Summer",
    description: "The Archer, containing the 'Teapot' asterism",
    starPositions: [
      [0, 1, 0],     // Kaus Australis
      [0.5, 1.5, 0], // Kaus Media
      [1, 1, 0],     // Kaus Borealis
      [0.5, 0.5, 0], // Nunki
      [0, 0, 0]      // Ascella
    ],
    connections: [[0,1], [1,2], [1,3], [3,4]]
  },
  {
    id: 6,
    name: "Capricornus",
    latinName: "Capricornus",
    season: "Summer",
    description: "The Sea Goat, one of the oldest constellations",
    starPositions: [
      [0, 1, 0],     // Deneb Algedi
      [0.5, 1.2, 0], // Nashira
      [1, 1, 0],     // Dabih
      [0.5, 0.5, 0], // Algedi
      [0, 0, 0]      // Omega Cap
    ],
    connections: [[0,1], [1,2], [2,3], [3,4]]
  },
  {
    id: 7,
    name: "Aquarius",
    latinName: "Aquarius",
    season: "Fall",
    description: "The Water Bearer, pouring water from a jar",
    starPositions: [
      [0, 1.5, 0],   // Sadalsuud
      [0.5, 1.5, 0], // Sadalmelik
      [0.25, 1, 0],  // Sadachbia
      [0.75, 1, 0],  // Skat
      [0.5, 0.5, 0]  // Ancha
    ],
    connections: [[0,1], [1,2], [2,3], [3,4]]
  },
  {
    id: 8,
    name: "Pisces",
    latinName: "Pisces",
    season: "Fall",
    description: "The Fishes, connected by a cord",
    starPositions: [
      [0, 1.5, 0],   // Alrescha
      [0.5, 2, 0],   // Delta Piscium
      [1, 1.5, 0],   // Epsilon Piscium
      [0.5, 1, 0],   // Omega Piscium
      [0, 0.5, 0]    // Eta Piscium
    ],
    connections: [[0,1], [1,2], [2,3], [3,4]]
  },
  {
    id: 9,
    name: "Taurus",
    latinName: "Taurus",
    season: "Winter",
    description: "The Bull, containing the Pleiades star cluster",
    starPositions: [
      [0, 1, 0],     // Aldebaran
      [0.5, 1.5, 0], // Elnath
      [1, 1, 0],     // Zeta Tauri
      [0.25, 1.25, 0], // Ain
      [0.75, 1.25, 0]  // Lambda Tauri
    ],
    connections: [[0,1], [1,2], [0,3], [3,4], [4,2]]
  },
  {
    id: 10,
    name: "Gemini",
    latinName: "Gemini",
    season: "Winter",
    description: "The Twins, Castor and Pollux",
    starPositions: [
      [0, 2, 0],     // Castor
      [0.3, 1.8, 0], // Pollux
      [0, 1, 0],     // Alhena
      [0.3, 1, 0],   // Wasat
      [0, 0, 0],     // Mebsuta
      [0.3, 0, 0]    // Propus
    ],
    connections: [[0,1], [0,2], [1,3], [2,4], [3,5]]
  },
  {
    id: 11,
    name: "Cancer",
    latinName: "Cancer",
    season: "Winter",
    description: "The Crab, containing the Beehive Cluster",
    starPositions: [
      [0, 1, 0],     // Acubens
      [0.5, 1.5, 0], // Beta Cancri
      [1, 1, 0],     // Asellus Australis
      [0.5, 0.5, 0], // Asellus Borealis
      [0, 0, 0]      // Delta Cancri
    ],
    connections: [[0,1], [1,2], [2,3], [3,4], [4,0]]
  },
  {
    id: 12,
    name: "Orion",
    latinName: "Orion",
    season: "Winter",
    description: "The Hunter, with its distinctive three-star belt",
    starPositions: [
      [0, 2, 0],     // Betelgeuse
      [1, 2, 0],     // Bellatrix
      [0.3, 1, 0],   // Alnitak
      [0.5, 1, 0],   // Alnilam
      [0.7, 1, 0],   // Mintaka
      [0, 0, 0],     // Saiph
      [1, 0, 0]      // Rigel
    ],
    connections: [[0,1], [1,4], [4,6], [0,2], [2,3], [3,4], [2,5], [4,6]]
  }
];

const ConstellationGrid: React.FC = () => {
  const navigate = useNavigate();
  const [constellations, setConstellations] = useState<Constellation[]>(MAJOR_CONSTELLATIONS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserConstellations = async () => {
      try {
        setLoading(true);
        const userConstellations = await getUserConstellations();
        
        // Make sure we have valid data before updating state
        if (Array.isArray(userConstellations)) {
          setConstellations([
            MAJOR_CONSTELLATIONS[0], // Keep the "Create Constellation" card
            ...userConstellations,
            ...MAJOR_CONSTELLATIONS.slice(1) // Add the default constellations
          ]);
        } else {
          console.error('Invalid user constellations data:', userConstellations);
          // Just use the default constellations if we can't get user data
          setConstellations(MAJOR_CONSTELLATIONS);
        }
      } catch (err) {
        console.error('Error fetching constellations:', err);
        setError('Failed to load user constellations');
        // Fall back to default constellations on error
        setConstellations(MAJOR_CONSTELLATIONS);
      } finally {
        setLoading(false);
      }
    };

    fetchUserConstellations();
  }, []);

  const navigateToHome = () => {
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-4xl font-bold text-white">
          Explore Constellations
        </h1>
        <button
          onClick={navigateToHome}
          className="px-4 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-500 transition-colors duration-300 flex items-center gap-2"
        >
          <Home size={20} />
          Home
        </button>
      </div>
      
      {loading ? (
        <div className="text-white text-center py-8">Loading constellations...</div>
      ) : error ? (
        <div className="text-red-500 text-center py-8">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {constellations.map((constellation) => (
            <ConstellationCard
              key={constellation.id}
              constellation={constellation}
            />
          ))}
        </div>
      )}

      {auth.currentUser && (
        <div className="mt-8 text-center text-gray-400">
          <p>You are logged in as {auth.currentUser.email}</p>
          <p className="mt-2">Create your own constellations and they'll appear here!</p>
        </div>
      )}
    </div>
  );
};

export default ConstellationGrid;