import { Link } from 'react-router-dom';
import './PhotoCard.css';

/**
 * Componente que muestra una tarjeta con la información de una foto de rover
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.photo - Datos de la foto
 * @returns {JSX.Element} - Componente PhotoCard
 */
const PhotoCard = ({ photo }) => {
  if (!photo) return null;

  return (
    <div className="photo-card">
      <div className="photo-card-image-container">
        <img 
          src={photo.img_src} 
          alt={`Mars Rover ${photo.rover.name} - ${photo.camera.full_name}`} 
          className="photo-card-image"
          loading="lazy" // Para mejorar rendimiento
        />
      </div>
      <div className="photo-card-content">
        <h3 className="photo-card-title">{photo.rover.name}</h3>
        <div className="photo-card-details">
          <p>Cámara: {photo.camera.full_name}</p>
          <p>Fecha Tierra: {photo.earth_date}</p>
          <p>Sol: {photo.sol}</p>
        </div>
        <Link to={`/photo/${photo.id}`} className="photo-card-link">
          Ver detalle
        </Link>
      </div>
    </div>
  );
};

export default PhotoCard; 