const pool = require('../config/db');

const createPromocion = async (promocionData) => {
  const { nombre_prom, descripcion, descuento, fecha_inicio, fecha_fin, id_negocio } = promocionData;
  const query = `
    INSERT INTO Promocion (nombre_prom, descripcion, descuento, fecha_inicio, fecha_fin, id_negocio)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *`;
  const values = [nombre_prom, descripcion, descuento, fecha_inicio, fecha_fin, id_negocio];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

const getPromocionesByNegocio = async (id_negocio) => {
  const query = 'SELECT * FROM Promocion WHERE id_negocio = $1 ORDER BY fecha_inicio DESC';
  const { rows } = await pool.query(query, [id_negocio]);
  return rows;
};

const updatePromocion = async (id_promocion, promocionData) => {
  const { nombre_prom, descripcion, descuento, fecha_inicio, fecha_fin } = promocionData;
  const query = `
    UPDATE Promocion 
    SET nombre_prom = $1, descripcion = $2, descuento = $3, fecha_inicio = $4, fecha_fin = $5
    WHERE id_promocion = $6
    RETURNING *`;
  const values = [nombre_prom, descripcion, descuento, fecha_inicio, fecha_fin, id_promocion];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

const deletePromocion = async (id_promocion) => {
  const { rows } = await pool.query(
    'DELETE FROM Promocion WHERE id_promocion = $1 RETURNING *',
    [id_promocion]
  );
  return rows[0] || null; // Retorna null si no existe
};

module.exports = {
  createPromocion,
  getPromocionesByNegocio,
  updatePromocion,
  deletePromocion
};