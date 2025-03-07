// src/components/Home.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/config';
import { signOut } from 'firebase/auth';
import { LogOut, Star } from 'lucide-react';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const user = auth.currentUser;

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold">Astronomy Explorer</h1>
          {user ? (
            <button
              onClick={handleSignOut}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <LogOut size={20} />
              Sign Out
            </button>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Sign In
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div
            onClick={() => navigate('/starconstellation')}
            className="bg-gradient-to-br from-blue-900 to-purple-800 p-8 rounded-xl shadow-lg cursor-pointer hover:shadow-xl transition-all transform hover:-translate-y-1"
          >
            <div className="flex items-center gap-4 mb-4">
              <Star className="text-yellow-300" size={32} />
              <h2 className="text-2xl font-bold">Explore Constellations</h2>
            </div>
            <p className="text-gray-300">
              Discover the night sky through interactive 3D models of constellations.
            </p>
          </div>

          {user && (
            <div
              onClick={() => navigate('/user-constellations')}
              className="bg-gradient-to-br from-indigo-900 to-teal-800 p-8 rounded-xl shadow-lg cursor-pointer hover:shadow-xl transition-all transform hover:-translate-y-1"
            >
              <div className="flex items-center gap-4 mb-4">
                <Star className="text-teal-300" size={32} />
                <h2 className="text-2xl font-bold">Your Constellations</h2>
              </div>
              <p className="text-gray-300">
                View and manage your custom-created constellations.
              </p>
            </div>
          )}

          <div
            onClick={() => navigate('/create')}
            className="bg-gradient-to-br from-purple-900 to-red-800 p-8 rounded-xl shadow-lg cursor-pointer hover:shadow-xl transition-all transform hover:-translate-y-1"
          >
            <div className="flex items-center gap-4 mb-4">
              <Star className="text-yellow-300" size={32} />
              <h2 className="text-2xl font-bold">Create Constellation</h2>
            </div>
            <p className="text-gray-300">
              Design your own constellation by placing and connecting stars in 3D space.
            </p>
          </div>

          <div
            className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-xl shadow-lg"
          >
            <h2 className="text-2xl font-bold mb-4">About</h2>
            <p className="text-gray-300">
              This interactive astronomy application allows you to explore the night sky through 3D models of well-known constellations. You can also create your own constellations and save them to your account.
            </p>
            <p className="text-gray-300 mt-4">
              {user ? `Logged in as: ${user.email}` : 'Sign in to create and save your own constellations!'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;