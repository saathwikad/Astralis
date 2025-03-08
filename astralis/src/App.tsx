import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ConstellationGrid from './components/ConstellationGrid';
import ConstellationDetail from './pages/ConstellationDetail';
import CreateConstellation from  './pages/CreateConstellation';
import AstronomyLanding from './pages/LandingPage';
import AuthPage from './pages/Authentication';
import HomePage from './pages/HomePage';
import Home from './pages/Home';
import UserConstellations from './components/UserConstellations';
import SpaceNews from './pages/AstroUpdates';
import Astralis from './pages/Landing';
import SpaceCardGame from './pages/SpaceCardGame';

const RedirectSite = () => {
  window.location.href = "./solarsystem/index.html";
  return <></>;
};


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Astralis />} />
        <Route path="/landing" element={<AstronomyLanding />} />
        <Route path="/starconstellation" element={<ConstellationGrid />} />
        <Route path="/constellation/:id" element={<ConstellationDetail />} />
        <Route path="/create" element={<CreateConstellation />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/solarsystem" element={<RedirectSite />} />
        <Route path="/user-constellations" element={<UserConstellations />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/homepage" element={<Home />} />
        <Route path="/updates" element={<SpaceNews />} />
        <Route path="/planets" element={<HomePage />} />
        <Route path="/game" element={<SpaceCardGame />} />
      </Routes>
    </Router>
  );
}

export default App;