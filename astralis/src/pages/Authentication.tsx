import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

// Floating Astronaut Component
const Astronaut = () => {
  const [rotation, setRotation] = useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => prev + 0.01);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <group rotation-y={rotation} position={[0, 0, -5]}>
      <mesh>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      {/* Backpack */}
      <mesh position={[0.3, 0, 0]}>
        <boxGeometry args={[0.3, 0.4, 0.2]} />
        <meshStandardMaterial color="#cccccc" />
      </mesh>
      {/* Visor */}
      <mesh position={[0, 0.1, 0.3]}>
        <sphereGeometry args={[0.25, 32, 32]} />
        <meshStandardMaterial color="#4B9CDB" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
};

interface AuthFormProps {
  isLogin: boolean;
}

const AuthForm: React.FC<AuthFormProps> = ({ isLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add your authentication logic here
    console.log('Form submitted:', formData);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col md:flex-row">
      {/* 3D Scene */}
      <div className="w-full md:w-1/2 h-64 md:h-screen">
        <Canvas>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <Astronaut />
          <OrbitControls enableZoom={false} />
        </Canvas>
      </div>

      {/* Auth Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="text-4xl font-bold text-white text-center mb-2">
              {isLogin ? 'Welcome Back' : 'Join The Mission'}
            </h2>
            <p className="text-gray-400 text-center">
              {isLogin 
                ? 'Continue your cosmic journey' 
                : 'Start mapping the stars today'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-gray-300 block mb-2" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 
                         rounded-lg focus:ring-2 focus:ring-blue-500 
                         text-white transition-colors"
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="text-gray-300 block mb-2" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 
                         rounded-lg focus:ring-2 focus:ring-blue-500 
                         text-white transition-colors"
                onChange={handleChange}
              />
            </div>

            {!isLogin && (
              <div>
                <label className="text-gray-300 block mb-2" htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 
                           rounded-lg focus:ring-2 focus:ring-blue-500 
                           text-white transition-colors"
                  onChange={handleChange}
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white rounded-lg 
                       hover:bg-blue-700 transition-colors font-semibold"
            >
              {isLogin ? 'Sign In' : 'Sign Up'}
            </button>

            <p className="text-center text-gray-400">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                type="button"
                onClick={() => navigate(isLogin ? '/signup' : '/login')}
                className="text-blue-500 hover:text-blue-400"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export const LoginPage: React.FC = () => <AuthForm isLogin={true} />;
export const SignupPage: React.FC = () => <AuthForm isLogin={false} />;