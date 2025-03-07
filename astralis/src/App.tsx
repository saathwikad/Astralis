import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ConstellationGrid from './components/ConstellationGrid';
import ConstellationDetail from './pages/ConstellationDetail';
import CreateConstellation from  './pages/CreateConstellation';
import AstronomyLanding from './pages/LandingPage';
import AuthPage from './pages/Authentication';
import HomePage from './pages/HomePage';

const RedirectSite = () => {
  window.location.href = "./solarsystem/index.html";
  return <></>;
};


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AstronomyLanding />} />
        <Route path="/starconstellation" element={<ConstellationGrid />} />
        <Route path="/constellation/:id" element={<ConstellationDetail />} />
        <Route path="/create" element={<CreateConstellation />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/solarsystem" element={<RedirectSite />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App;