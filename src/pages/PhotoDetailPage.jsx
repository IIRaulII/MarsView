import PhotoDetail from '../components/RoverDetail/PhotoDetail';
import './PhotoDetailPage.css';

/**
 * Página que muestra el detalle de una foto específica
 * @returns {JSX.Element} - Componente PhotoDetailPage
 */
const PhotoDetailPage = () => {
  return (
    <div className="detail-page">
      <PhotoDetail />
    </div>
  );
};

export default PhotoDetailPage; 