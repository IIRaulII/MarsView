import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import './PhotoDetail.css';

/**
 * Componente que muestra el detalle de una foto específica
 * @returns {JSX.Element} - Componente PhotoDetail
 */
const PhotoDetail = () => {
  const { id } = useParams();
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFullImage, setShowFullImage] = useState(false);

  useEffect(() => {
    const fetchPhotoDetail = async () => {
      try {
        setLoading(true);
        
        // Intentamos recuperar la foto del localStorage
        if (!localStorage.getItem(`photo_${id}`)) {
          setError('Foto no encontrada');
          setLoading(false);
          return;
        }
        
        try {
          const photoData = JSON.parse(localStorage.getItem(`photo_${id}`));
          setPhoto(photoData);
        } catch (e) {
          setError('Error al cargar la foto');
        } finally {
          setLoading(false);
        }
      } catch (err) {
        setError('Error al cargar los detalles de la foto');
        setLoading(false);
      }
    };

    fetchPhotoDetail();
  }, [id]);

  // Alternar visualización de imagen a tamaño completo
  const toggleFullImage = () => {
    setShowFullImage(!showFullImage);
  };

  // Cerrar la imagen a tamaño completo con la tecla Escape
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && showFullImage) {
        setShowFullImage(false);
      }
    };

    document.addEventListener('keydown', handleEscKey);
    
    // Si el modal está abierto, evitar scroll en el body
    if (showFullImage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'auto';
    };
  }, [showFullImage]);

  // Obtener información de navegación guardada o usar valores por defecto
  const getBackLink = () => {
    if (photo) {
      // Guardar el sol de la foto actual en localStorage para recuperarlo en la galería
      const currentNavState = {
        roverName: photo.rover.name.toLowerCase(),
        sol: photo.sol
      };
      localStorage.setItem('marsViewNavState', JSON.stringify(currentNavState));
      
      // Si tenemos la foto, volver a la galería del rover correspondiente
      return `/rover/${photo.rover.name.toLowerCase()}`;
    }
    
    // Si no tenemos la foto, intentar recuperar el estado de navegación
    try {
      const savedState = localStorage.getItem('marsViewNavState');
      if (savedState) {
        const { roverName } = JSON.parse(savedState);
        return `/rover/${roverName}`;
      }
    } catch (err) {
      console.error('Error al recuperar el estado de navegación:', err);
    }
    
    // Si todo falla, volver a la página principal
    return '/';
  };

  if (loading) {
    return (
      <div className="photo-detail-container loading">
        <div className="loading-spinner detail-spinner"></div>
      </div>
    );
  }

  if (error || !photo) {
    return (
      <div className="photo-detail-container error">
        <div className="error-message detail-error">
          {error || 'Foto no encontrada. Por favor, intenta con otra foto.'}
        </div>
        <Link to={getBackLink()} className="back-button">Volver a la Galería</Link>
      </div>
    );
  }

  return (
    <div className="photo-detail-container">
      {showFullImage && (
        <div className="fullscreen-modal" onClick={toggleFullImage}>
          <div className="fullscreen-image-container">
            <span className="close-modal" onClick={toggleFullImage}>×</span>
            <img 
              src={photo.img_src} 
              alt={`Mars Rover ${photo.rover.name} - ${photo.camera.full_name}`}
              className="fullscreen-image"
            />
          </div>
        </div>
      )}
      
      <Link to={getBackLink()} className="back-button">← Volver a la Galería</Link>
      
      <div className="photo-detail-content">
        <div className="photo-detail-image-container">
          <img 
            src={photo.img_src} 
            alt={`Mars Rover ${photo.rover.name} - ${photo.camera.full_name}`}
            className="photo-detail-image"
            onClick={toggleFullImage}
          />
          <button className="view-fullscreen-btn" onClick={toggleFullImage} title="Ver a tamaño completo">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 3 21 3 21 9"></polyline>
              <polyline points="9 21 3 21 3 15"></polyline>
              <line x1="21" y1="3" x2="14" y2="10"></line>
              <line x1="3" y1="21" x2="10" y2="14"></line>
            </svg>
          </button>
        </div>
        
        <div className="photo-detail-info">
          <h2 className="photo-detail-title">
            Foto de {photo.rover.name}
          </h2>
          
          <div className="info-section">
            <h3>Detalles de la Foto</h3>
            <p><strong>ID:</strong> {photo.id}</p>
            <p><strong>Fecha Terrestre:</strong> {photo.earth_date}</p>
            <p><strong>Sol (Día Marciano):</strong> {photo.sol}</p>
          </div>
          
          <div className="info-section">
            <h3>Detalles de la Cámara</h3>
            <p><strong>Nombre:</strong> {photo.camera.name}</p>
            <p><strong>Nombre Completo:</strong> {photo.camera.full_name}</p>
          </div>
          
          <div className="info-section">
            <h3>Detalles del Rover</h3>
            <p><strong>Nombre:</strong> {photo.rover.name}</p>
            <p>
              <strong>Estado:</strong> 
              <span className={`rover-status ${photo.rover.status.toLowerCase()}`}>
                {photo.rover.status.toLowerCase() === 'active' ? 'Activo' : photo.rover.status}
              </span>
            </p>
            <p><strong>Fecha de Lanzamiento:</strong> {photo.rover.launch_date}</p>
            <p><strong>Fecha de Aterrizaje:</strong> {photo.rover.landing_date}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoDetail; 