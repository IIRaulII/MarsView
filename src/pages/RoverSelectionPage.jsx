import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRoverManifest } from '../services/nasaApi';
import { roversData } from '../assets/rovers/roversData';
import './RoverSelectionPage.css';

/**
 * Página inicial para seleccionar un rover
 * @returns {JSX.Element} - Componente RoverSelectionPage
 */
const RoverSelectionPage = () => {
  const [roverManifests, setRoverManifests] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Cargar los manifiestos de los rovers
  useEffect(() => {
    const fetchRoverManifests = async () => {
      try {
        setLoading(true);
        
        // Obtener manifiesto de Curiosity
        const curiosityResponse = await getRoverManifest('curiosity');
        const perseveranceResponse = await getRoverManifest('perseverance');
        
        const manifests = {
          curiosity: curiosityResponse.photo_manifest,
          perseverance: perseveranceResponse.photo_manifest
        };
        
        setRoverManifests(manifests);
      } catch (err) {
        console.error('Error al cargar los manifiestos de los rovers:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRoverManifests();
  }, []);

  // Navegar a la página de galería del rover seleccionado
  const handleSelectRover = (roverName) => {
    // Limpiar el estado de navegación anterior
    localStorage.removeItem('marsViewNavState');
    
    // Navegar a la página de galería con el rover seleccionado
    navigate(`/rover/${roverName}`);
  };

  return (
    <div className="rover-selection-page">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="app-title">Explora Marte</h1>
          <p className="app-description">
            Descubre Marte a través de los ojos de los rovers de la NASA.
            Selecciona un rover para explorar sus fotografías.
          </p>
        </div>
      </div>
      
      <div className="rovers-container">
        <h2 className="selection-title">Selecciona un Rover</h2>
        
        {loading ? (
          <div className="loading-message">Cargando información de los rovers...</div>
        ) : (
          <div className="rover-cards">
            {roversData.map(rover => (
              <div 
                key={rover.id}
                className="rover-card" 
                onClick={() => handleSelectRover(rover.id)}
              >
                <div 
                  className="rover-image" 
                  style={{ backgroundImage: `url(${rover.imageUrl})` }}
                ></div>
                <div className="rover-info">
                  <h3 className="rover-name">{rover.name}</h3>
                  {roverManifests[rover.id] && (
                    <div className="rover-stats">
                      <p>
                        <strong>Estado:</strong> 
                        <span className={`rover-status ${roverManifests[rover.id].status.toLowerCase()}`}>
                          {roverManifests[rover.id].status.toLowerCase() === 'active' ? 'Activo' : roverManifests[rover.id].status}
                        </span>
                      </p>
                      <p><strong>Soles:</strong> {roverManifests[rover.id].max_sol}</p>
                      <p><strong>Fotos:</strong> {roverManifests[rover.id].total_photos.toLocaleString()}</p>
                      <p><strong>Aterrizaje:</strong> {roverManifests[rover.id].landing_date}</p>
                    </div>
                  )}
                  <button className="rover-select-btn">Explorar {rover.name}</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoverSelectionPage; 