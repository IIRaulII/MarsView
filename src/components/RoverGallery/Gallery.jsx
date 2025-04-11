import { useState } from 'react';
import PhotoCard from './PhotoCard';
import './Gallery.css';

/**
 * Componente de galería que muestra un grid de fotos de rover
 * @param {Object} props - Propiedades del componente
 * @param {Array} props.photos - Lista de fotos a mostrar
 * @param {boolean} props.loading - Estado de carga
 * @param {boolean} props.hasMore - Indica si hay más fotos para cargar
 * @param {Function} props.onLoadMore - Función para cargar más fotos
 * @returns {JSX.Element} - Componente Gallery
 */
const Gallery = ({ photos, loading, error, hasMore, onLoadMore }) => {
  return (
    <div className="gallery-container">
      <div className="gallery-header">
        <h2 className="gallery-heading">Fotos de Marte</h2>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      {loading && photos.length === 0 ? (
        <div className="gallery-loading">
          <div className="gallery-loading-spinner"></div>
          <p>Cargando fotos...</p>
        </div>
      ) : photos.length === 0 ? (
        <div className="gallery-empty">
          <p className="gallery-empty-message">No se encontraron fotos para esta fecha</p>
        </div>
      ) : (
        <div className="gallery-grid">
          {photos.map(photo => (
            <PhotoCard key={photo.id} photo={photo} />
          ))}
        </div>
      )}
      
      <div className="load-more-container">
        {loading && photos.length > 0 && <div className="gallery-loading-spinner"></div>}
        
        {!loading && hasMore && (
          <button className="load-more-button" onClick={onLoadMore}>
            Cargar más fotos
          </button>
        )}
        
        {!loading && !hasMore && photos.length > 0 && (
          <p className="gallery-empty-message">No hay más fotos para mostrar</p>
        )}
      </div>
    </div>
  );
};

export default Gallery; 