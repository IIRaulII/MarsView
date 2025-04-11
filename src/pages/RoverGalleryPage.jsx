import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Gallery from '../components/RoverGallery/Gallery';
import SolSelector from '../components/UI/SolSelector';
import useRoverPhotos from '../hooks/useRoverPhotos';
import { getRoverManifest } from '../services/nasaApi';
import './RoverGalleryPage.css';

/**
 * Página que muestra la galería de fotos de un rover específico
 * @returns {JSX.Element} - Componente RoverGalleryPage
 */
const RoverGalleryPage = () => {
  const { roverName } = useParams();
  const [maxSol, setMaxSol] = useState(0);
  const [sol, setSol] = useState(0);
  const [loading, setLoading] = useState(true);
  const [roverManifest, setRoverManifest] = useState(null);
  const [stateLoaded, setStateLoaded] = useState(false);

  // Cargar el manifiesto del rover seleccionado
  useEffect(() => {
    const fetchRoverManifest = async () => {
      try {
        setLoading(true);
        const response = await getRoverManifest(roverName);
        setRoverManifest(response.photo_manifest);
        setMaxSol(response.photo_manifest.max_sol);
        
        // Una vez que tenemos el manifesto, podemos cargar el estado guardado
        if (!stateLoaded) {
          loadSavedState(response.photo_manifest.max_sol);
        }
      } catch (err) {
        console.error('Error al cargar el manifiesto del rover:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoverManifest();
  }, [roverName, stateLoaded]);

  // Comprobar si hay un estado guardado para este rover
  const loadSavedState = (maxSolValue) => {
    try {
      const savedState = localStorage.getItem('marsViewNavState');
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        if (parsedState.roverName === roverName) {
          // Verificar que el sol esté dentro de los límites
          let savedSol = parsedState.sol;
          if (savedSol > maxSolValue) {
            savedSol = maxSolValue;
          }
          setSol(savedSol);
          setStateLoaded(true);
          return;
        }
      }
    } catch (err) {
      console.error('Error al recuperar el estado guardado:', err);
    }
    
    // Si no hay estado guardado o hay un error, establecer sol a 0
    setSol(0);
    setStateLoaded(true);
  };

  // Obtener las fotos del rover para el sol seleccionado
  const { 
    photos, 
    loading: photosLoading, 
    error, 
    hasMore, 
    loadMore 
  } = useRoverPhotos(roverName, { sol });

  // Guardar el estado de navegación actual
  useEffect(() => {
    // Solo guardar cuando el estado ya se ha cargado para evitar sobrescribir valores
    if (stateLoaded) {
      // Guardar las fotos para poder verlas en detalle
      if (photos && photos.length > 0) {
        photos.forEach(photo => {
          localStorage.setItem(`photo_${photo.id}`, JSON.stringify(photo));
        });
      }

      // Guardar el estado de navegación actual (rover y sol)
      localStorage.setItem('marsViewNavState', JSON.stringify({
        roverName,
        sol
      }));
    }
  }, [photos, roverName, sol, stateLoaded]);

  // Manejar el cambio de sol
  const handleSolChange = (newSol) => {
    setSol(newSol);
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <div className="rover-gallery-page">
      <div className="gallery-header">
        <Link to="/" className="back-link">← Volver a la selección</Link>
        {roverManifest && (
          <div className="rover-header-info">
            <h1 className="rover-title">
              Rover {capitalizeFirstLetter(roverName)}
            </h1>
            <div className="rover-quick-stats">
              <div className="rover-stat">
                <span className="stat-value">{roverManifest.max_sol}</span>
                <span className="stat-label">Soles en Marte</span>
              </div>
              <div className="rover-stat">
                <span className="stat-value">{roverManifest.total_photos.toLocaleString()}</span>
                <span className="stat-label">Fotos totales</span>
              </div>
              <div className="rover-stat">
                <span className="stat-value">{roverManifest.status}</span>
                <span className="stat-label">Estado</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="gallery-content">
        {/* Selector de Sol marciano */}
        <div className="sol-filter-container">
          <h3 className="sol-filter-title">Explorar por Sol Marciano</h3>
          {loading ? (
            <div className="loading-message">Cargando información del rover...</div>
          ) : (
            <SolSelector 
              initialSol={sol}
              maxSol={maxSol}
              onSolChange={handleSolChange}
            />
          )}
        </div>
        
        {/* Galería de fotos */}
        <Gallery 
          photos={photos}
          loading={photosLoading || loading}
          error={error}
          hasMore={hasMore}
          onLoadMore={loadMore}
        />
      </div>
    </div>
  );
};

export default RoverGalleryPage; 