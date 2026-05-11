import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import MatchDetail from './pages/MatchDetail';
import Accuracy from './pages/Accuracy';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/match/:id" element={<MatchDetail />} />
        <Route path="/accuracy" element={<Accuracy />} />
      </Routes>
    </Router>
  );
}

export default App;