// NASA API Key - Normalmente se guardaría en variables de entorno
const API_KEY = 'cj1jYmScIsDhGZ9vFzkmdZoFXH3waNVaFfOcdZ5u';
const BASE_URL = 'https://api.nasa.gov/mars-photos/api/v1/rovers';
const MANIFEST_URL = 'https://api.nasa.gov/mars-photos/api/v1/manifests';

/**
 * Obtiene las fotos de un rover específico por fecha terrestre o sol marciano con paginación
 * @param {string} roverName - Nombre del rover (curiosity, perseverance)
 * @param {Object} params - Parámetros de búsqueda
 * @param {string} [params.earthDate] - Fecha en formato YYYY-MM-DD (si se usa fecha terrestre)
 * @param {number} [params.sol] - Número de sol marciano (si se usa sol)
 * @param {number} params.page - Número de página para la paginación
 * @param {number} params.perPage - Cantidad de fotos por página
 * @returns {Promise} - Promesa con los datos de las fotos
 */
export const getRoverPhotos = async (
  roverName = 'curiosity',
  params = {}
) => {
  try {
    const { 
      earthDate, 
      sol, 
      page = 1, 
      perPage = 12 
    } = params;
    
    // Verificar que se proporcione o earthDate o sol
    if (!earthDate && sol === undefined) {
      throw new Error('Se debe proporcionar earthDate o sol para buscar fotos');
    }
    
    // Construir parámetros de búsqueda según si usamos earthDate o sol
    const searchParams = new URLSearchParams({
      api_key: API_KEY,
      page: page,
      per_page: perPage
    });
    
    // Añadir el parámetro adecuado: o earth_date o sol
    if (sol !== undefined) {
      searchParams.append('sol', sol);
    } else {
      searchParams.append('earth_date', earthDate);
    }
    
    const url = `${BASE_URL}/${roverName}/photos?${searchParams.toString()}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Error al obtener datos de la API de NASA');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error en la petición a la API:', error);
    throw error;
  }
};

/**
 * Obtiene el manifiesto de un rover específico con información de la misión
 * @param {string} roverName - Nombre del rover (curiosity, perseverance)
 * @returns {Promise} - Promesa con los datos del manifiesto del rover
 */
export const getRoverManifest = async (roverName = 'curiosity') => {
  try {
    const url = `${MANIFEST_URL}/${roverName}?api_key=${API_KEY}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Error al obtener el manifiesto del rover');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error en la petición a la API de manifiesto:', error);
    throw error;
  }
}; 