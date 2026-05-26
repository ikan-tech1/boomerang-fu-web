import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import PlayPage from './pages/PlayPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/play" element={<PlayPage />} />
    </Routes>
  );
}
