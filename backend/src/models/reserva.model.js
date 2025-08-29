const pool = require('../config/db');
const { parseToUTC, formatColombiaTime } = require('../utils/dateUtils');

// Crear reserva y su relación con negocio
const createReserva = async (reservaData) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Crear reserva principal
    const reservaQuery = `
      INSERT INTO Reserva (id_usuario, estado)
      VALUES ($1, 'pendiente')
      RETURNING id_reserva`;
    const reservaRes = await client.query(reservaQuery, [reservaData.id_usuario]);
    const id_reserva = reservaRes.rows[0].id_reserva;

    // 2. Crear relación con negocio (guardar en UTC)
    const negocioReservaQuery = `
      INSERT INTO Negocio_Reserva (id_negocio, id_reserva, fecha_reserva)
      VALUES ($1, $2, $3::timestamp)`;
    await client.query(negocioReservaQuery, [
      reservaData.id_negocio,
      id_reserva,
      parseToUTC(reservaData.fecha_reserva) // Conversión explícita a UTC
    ]);

    await client.query('COMMIT');

    // Obtener la reserva recién creada para responder
    const reservaCreada = await getReservaById(id_reserva);
    return reservaCreada;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

// Nuevo método auxiliar
const getReservaById = async (id_reserva) => {
  const query = `
    SELECT r.id_reserva, r.id_usuario, r.estado, 
           nr.fecha_reserva, nr.id_negocio
    FROM Reserva r
    JOIN Negocio_Reserva nr ON r.id_reserva = nr.id_reserva
    WHERE r.id_reserva = $1`;
  const { rows } = await pool.query(query, [id_reserva]);
  
  return {
    ...rows[0],
    fecha_reserva: formatColombiaTime(rows[0].fecha_reserva) // Convertir a hora Colombia
  };
};

// Obtener reservas de usuario
const getReservasByUsuario = async (id_usuario) => {
  const query = `
    SELECT r.id_reserva, r.estado, 
           nr.fecha_reserva, n.nombre as negocio_nombre
    FROM Reserva r
    JOIN Negocio_Reserva nr ON r.id_reserva = nr.id_reserva
    JOIN Negocio n ON nr.id_negocio = n.id_negocio
    WHERE r.id_usuario = $1
    ORDER BY nr.fecha_reserva DESC`;
  
  const { rows } = await pool.query(query, [id_usuario]);
  
  return rows.map(row => ({
    ...row,
    fecha_reserva: formatColombiaTime(row.fecha_reserva) // Conversión a hora Colombia
  }));
};

// Actualizar estado (ej: cancelar)
const updateReservaStatus = async (id_reserva, nuevoEstado) => {
  const query = `
    UPDATE Reserva 
    SET estado = $1
    WHERE id_reserva = $2
    RETURNING *`;
  const { rows } = await pool.query(query, [nuevoEstado, id_reserva]);
  return rows[0] ? { 
    ...rows[0], 
    fecha_actualizacion: formatColombiaTime(new Date()) 
  } : null;
};

const checkReservaExistente = async (id_usuario, id_negocio) => {
  const query = `
    SELECT 1 FROM Reserva r
    JOIN Negocio_Reserva nr ON r.id_reserva = nr.id_reserva
    WHERE r.id_usuario = $1 
    AND nr.id_negocio = $2
    AND r.estado = 'pendiente'`;
  const { rows } = await pool.query(query, [id_usuario, id_negocio]);
  return rows.length > 0;
};

module.exports = {
  createReserva,
  getReservaById,
  getReservasByUsuario,
  updateReservaStatus,
  checkReservaExistente
};