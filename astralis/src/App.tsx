import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ConstellationGrid from './components/ConstellationGrid';
import ConstellationDetail from './pages/ConstellationDetail';
import CreateConstellation from  './pages/CreateConstellation';
import LandingPage from './pages/LandingPage';
import { SignupPage, LoginPage } from './pages/Authentication';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ConstellationGrid />} />
        <Route path="/constellation/:id" element={<ConstellationDetail />} />
        <Route path="/create" element={<CreateConstellation />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </Router>
  );
}

export default App;