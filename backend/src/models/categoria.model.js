const pool = require('../config/db');
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 3600 });

const getAllCategorias = async () => {
  const cacheKey = 'todas_categorias';
  
  // Verificar cache
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    console.log('Devolviendo categorías desde cache');
    return cachedData;
  }

  // Si no está en cache, consultar DB
  const { rows } = await pool.query(`
    SELECT id_categoria, nombre_categoria, descripcion 
    FROM Categoria_Negocio 
    ORDER BY nombre_categoria`
  );

  // Guardar en cache
  cache.set(cacheKey, rows);
  return rows;
};

// Añadir este método para invalidar cache cuando sea necesario
const invalidarCache = () => {
  cache.flushAll();
  console.log('Cache de categorías limpiado');
};

module.exports = {
  getAllCategorias,
  invalidarCache
};