// src/components/UserConstellations.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserConstellations, deleteConstellation } from '../firebase/constellationService';
import { Constellation } from '../assets/types';
import { ConstellationCard } from './ConstellationCard';
import { auth } from '../firebase/config';
import { Trash2, Home } from 'lucide-react';

const UserConstellations: React.FC = () => {
  const navigate = useNavigate();
  const [constellations, setConstellations] = useState<Constellation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is logged in
    if (!auth.currentUser) {
      navigate('/login');
      return;
    }

    const fetchConstellations = async () => {
      try {
        setLoading(true);
        const userConstellations = await getUserConstellations();
        setConstellations(userConstellations);
      } catch (err) {
        console.error('Error fetching constellations:', err);
        setError('Failed to load your constellations');
      } finally {
        setLoading(false);
      }
    };

    fetchConstellations();
  }, [navigate]);

  const handleDeleteConstellation = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this constellation?')) {
      try {
        // Convert back to the Firestore document ID
        const firestoreId = id.toString(36);
        await deleteConstellation(firestoreId);
        setConstellations(prev => prev.filter(c => c.id !== id));
      } catch (err) {
        console.error('Error deleting constellation:', err);
        setError('Failed to delete constellation');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-4xl font-bold text-white">
          Your Constellations
        </h1>
        <div className="flex space-x-4">
          <button
            onClick={() => navigate('/starconstellation')}
            className="px-4 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-500 transition-colors duration-300"
          >
            Explore All
          </button>
          <button
            onClick={() => navigate('/homepage')}
            className="px-4 py-2 bg-gray-700 rounded-lg text-white hover:bg-gray-600 transition-colors duration-300 flex items-center gap-2"
          >
            <Home size={20} />
            Home
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-white text-center py-8">Loading your constellations...</div>
      ) : error ? (
        <div className="text-red-500 text-center py-8">{error}</div>
      ) : constellations.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-white text-xl mb-4">You haven't created any constellations yet!</p>
          <button
            onClick={() => navigate('/create')}
            className="px-6 py-3 bg-blue-600 rounded-lg text-white hover:bg-blue-500 transition-colors duration-300"
          >
            Create Your First Constellation
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {constellations.map((constellation) => (
            <div key={constellation.id} className="relative group">
              <ConstellationCard constellation={constellation} />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteConstellation(constellation.id);
                }}
                className="absolute top-2 right-2 p-2 bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <Trash2 size={20} className="text-white" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserConstellations;