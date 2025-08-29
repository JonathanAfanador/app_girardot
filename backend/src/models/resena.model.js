const pool = require('../config/db');
const { formatColombiaTime } = require('../utils/dateUtils'); // Crearemos este helper

// Crear reseña
const createResena = async (resenaData) => {
  const { id_usuario, id_negocio, id_evento, calificacion, texto } = resenaData;
  const query = `
    INSERT INTO Resena (
      id_usuario, 
      id_negocio, 
      id_evento, 
      calificacion, 
      texto
    ) VALUES ($1, $2, $3, $4, $5)
    RETURNING *`;
  const values = [id_usuario, id_negocio || null, id_evento || null, calificacion, texto];
  const { rows } = await pool.query(query, values);
  return formatResenaDates(rows[0]);
};

// Obtener reseñas por negocio
const getResenasByNegocio = async (id_negocio) => {
  const query = `
    SELECT r.*, u.nombre as usuario_nombre 
    FROM Resena r
    JOIN Usuario u ON r.id_usuario = u.id_usuario
    WHERE r.id_negocio = $1
    ORDER BY r.fecha_publicacion DESC`;
  const { rows } = await pool.query(query, [id_negocio]);
  return rows.map(formatResenaDates);
};

const getResenasByEvento = async (id_evento) => {
  const query = `
    SELECT r.*, u.nombre as usuario_nombre 
    FROM Resena r
    JOIN Usuario u ON r.id_usuario = u.id_usuario
    WHERE r.id_evento = $1
    ORDER BY r.fecha_publicacion DESC`;
  const { rows } = await pool.query(query, [id_evento]);
  return rows.map(formatResenaDates);
};

// Actualizar reseña
const updateResena = async (id_resena, updates) => {
  const { calificacion, texto } = updates;
  const query = `
    UPDATE Resena 
    SET calificacion = $1, texto = $2, fecha_publicacion = NOW()
    WHERE id_resena = $3
    RETURNING *`;
  const { rows } = await pool.query(query, [calificacion, texto, id_resena]);
  return formatResenaDates(rows[0]);
};

// Eliminar reseña
const deleteResena = async (id_resena) => {
  const { rowCount } = await pool.query(
    'DELETE FROM Resena WHERE id_resena = $1', 
    [id_resena]
  );
  return rowCount > 0;
};

// Helper para formatear fechas
const formatResenaDates = (resena) => {
  if (!resena) return null;
  return {
    ...resena,
    fecha_publicacion: formatColombiaTime(resena.fecha_publicacion)
  };
};

module.exports = {
  createResena,
  getResenasByNegocio,
  getResenasByEvento,
  updateResena,
  deleteResena
};