import { useState, useEffect, useCallback } from 'react';
import { getRoverPhotos } from '../services/nasaApi';

/**
 * Hook personalizado para gestionar las fotos de un rover
 * @param {string} roverName - Nombre del rover
 * @param {Object} searchParams - Parámetros de búsqueda
 * @param {string} [searchParams.earthDate] - Fecha terrestre (YYYY-MM-DD)
 * @param {number} [searchParams.sol] - Sol marciano
 * @returns {Object} - Estados y funciones para manejar las fotos del rover
 */
const useRoverPhotos = (roverName = 'curiosity', searchParams = {}) => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Usar sol o earthDate según lo que se proporcione
  const { sol, earthDate } = searchParams;

  // Función para obtener las fotos
  const fetchPhotos = useCallback(async (pageNum, newSearch = false) => {
    try {
      setLoading(true);
      
      // Crear parámetros para la búsqueda
      const params = { page: pageNum, perPage: 12 };
      
      // Añadir o sol o earthDate según cual esté definido
      if (sol !== undefined) {
        params.sol = sol;
      } else if (earthDate) {
        params.earthDate = earthDate;
      } else {
        // Si no hay ninguno, usar un sol por defecto para Curiosity
        params.sol = 1000;
      }
      
      const data = await getRoverPhotos(roverName, params);
      
      // Si no hay fotos o si hay menos de 12, no hay más páginas
      if (!data.photos || data.photos.length === 0) {
        setHasMore(false);
        if (newSearch) {
          setPhotos([]);
        }
      } else {
        // Si es una nueva búsqueda, reemplazamos las fotos, si no, las añadimos
        if (newSearch) {
          setPhotos(data.photos);
        } else {
          setPhotos(prevPhotos => [...prevPhotos, ...data.photos]);
        }
        
        // Si se recibieron menos de 12 fotos, no hay más para cargar
        if (data.photos.length < 12) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }
      }
    } catch (err) {
      setError('Error al cargar las fotos. Por favor, intenta de nuevo más tarde.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [roverName, sol, earthDate]);

  // Cargar fotos iniciales cuando cambia el rover o los parámetros de búsqueda
  useEffect(() => {
    setLoading(true);
    setError(null);
    setPhotos([]);
    setPage(1);
    setHasMore(true);
    
    fetchPhotos(1, true);
  }, [roverName, sol, earthDate, fetchPhotos]);

  // Función para cargar más fotos (siguiente página)
  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchPhotos(nextPage);
    }
  }, [loading, hasMore, page, fetchPhotos]);

  return {
    photos,
    loading,
    error,
    hasMore,
    loadMore
  };
};

export default useRoverPhotos; 