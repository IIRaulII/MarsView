import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RoverSelectionPage from './pages/RoverSelectionPage';
import RoverGalleryPage from './pages/RoverGalleryPage';
import PhotoDetailPage from './pages/PhotoDetailPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<RoverSelectionPage />} />
          <Route path="/rover/:roverName" element={<RoverGalleryPage />} />
          <Route path="/photo/:id" element={<PhotoDetailPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
