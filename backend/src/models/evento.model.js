const pool = require('../config/db');

const createEvento = async (eventoData) => {
  const { nombre, descripcion, fecha_inicio, fecha_fin, id_negocio } = eventoData;
  const query = `
    INSERT INTO Evento (nombre, descripcion, fecha_inicio, fecha_fin, id_negocio)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *`;
  const values = [nombre, descripcion, fecha_inicio, fecha_fin, id_negocio];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

const getEventosByNegocio = async (id_negocio) => {
  const query = 'SELECT * FROM Evento WHERE id_negocio = $1';
  const { rows } = await pool.query(query, [id_negocio]);
  return rows;
};

const updateEvento = async (id_evento, eventoData) => {
  const { nombre, descripcion, fecha_inicio, fecha_fin } = eventoData;
  const query = `
    UPDATE Evento 
    SET nombre = $1, descripcion = $2, fecha_inicio = $3, fecha_fin = $4
    WHERE id_evento = $5
    RETURNING *`;
  const values = [nombre, descripcion, fecha_inicio, fecha_fin, id_evento];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

const deleteEvento = async (id_evento) => {
  const query = 'DELETE FROM Evento WHERE id_evento = $1 RETURNING *';
  const { rows } = await pool.query(query, [id_evento]);
  return rows[0];
};

module.exports = {
  createEvento,
  getEventosByNegocio,
  updateEvento,
  deleteEvento
};