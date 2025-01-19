import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ConstellationGrid from './components/ConstellationGrid';
import ConstellationDetail from './pages/ConstellationDetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ConstellationGrid />} />
        <Route path="/constellation/:id" element={<ConstellationDetail />} />
      </Routes>
    </Router>
  );
}

export default App;