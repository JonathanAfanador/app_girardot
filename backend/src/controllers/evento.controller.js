const eventoModel = require('../models/evento.model');
const pool = require('../config/db');

const createEvento = async (req, res) => {
  try {
    const eventoData = {
      ...req.body,
      id_negocio: req.body.id_negocio || req.usuario.id // Asume relación usuario-negocio
    };
    const nuevoEvento = await eventoModel.createEvento(eventoData);
    res.status(201).json(nuevoEvento);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getEventos = async (req, res) => {
  try {
    const eventos = await eventoModel.getEventosByNegocio(req.params.id_negocio);
    res.json(eventos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateEvento = async (req, res) => {
    try {
      // Primero obtener el evento actual
      const eventoActual = await pool.query(
        'SELECT * FROM Evento WHERE id_evento = $1', 
        [req.params.id_evento]
      );
      
      if (!eventoActual.rows[0]) {
        return res.status(404).json({ error: 'Evento no encontrado' });
      }
  
      // Combinar datos actuales con los nuevos
      const datosActualizados = {
        ...eventoActual.rows[0],
        ...req.body
      };
  
      const query = `
        UPDATE Evento 
        SET nombre = $1, descripcion = $2, fecha_inicio = $3, fecha_fin = $4
        WHERE id_evento = $5
        RETURNING *`;
      
      const values = [
        datosActualizados.nombre,
        datosActualizados.descripcion,
        datosActualizados.fecha_inicio,
        datosActualizados.fecha_fin,
        req.params.id_evento
      ];
  
      const { rows } = await pool.query(query, values);
      
      // --- Modificación clave aquí ---
      const eventoActualizado = rows[0];
      
      // Convertir fechas a formato ISO sin cambiar la hora (para Colombia UTC-5)
      const respuesta = {
        ...eventoActualizado,
        fecha_inicio: new Date(eventoActualizado.fecha_inicio).toLocaleString('en-US', {
          timeZone: 'America/Bogota',
          hour12: false
        }).replace(', ', 'T').replace(/\/|, /g, '-'),
        fecha_fin: new Date(eventoActualizado.fecha_fin).toLocaleString('en-US', {
          timeZone: 'America/Bogota',
          hour12: false
        }).replace(', ', 'T').replace(/\/|, /g, '-')
      };
      
      res.json(respuesta);
      // --- Fin de la modificación ---

    } catch (error) {
      res.status(500).json({ 
        error: 'Error al actualizar evento',
        details: process.env.NODE_ENV === 'development' ? error.message : null
      });
    }
};

const deleteEvento = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Verificar existencia del evento Y propiedad (en una sola consulta)
    const eventoQuery = `
      SELECT E.* FROM Evento E
      JOIN Negocio N ON E.id_negocio = N.id_negocio
      WHERE E.id_evento = $1 
      AND (N.id_usuario = $2 OR $3 = 'administrador')
    `;
    
    const eventoRes = await client.query(eventoQuery, [
      req.params.id_evento,
      req.usuario.id,
      req.usuario.rol
    ]);

    if (eventoRes.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ 
        error: 'Evento no encontrado o no tienes permisos' 
      });
    }

    // 2. Eliminar relaciones (si existen)
    try {
      await client.query(
        'DELETE FROM Evento_Promocion WHERE id_evento = $1',
        [req.params.id_evento]
      );
    } catch (e) {
      if (!e.message.includes('relation "evento_promocion" does not exist')) {
        throw e;
      }
    }

    // 3. Eliminar el evento
    await client.query(
      'DELETE FROM Evento WHERE id_evento = $1',
      [req.params.id_evento]
    );

    await client.query('COMMIT');
    res.json({ message: 'Evento eliminado correctamente' });
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({
      error: 'Error al eliminar evento',
      details: process.env.NODE_ENV === 'development' ? error.message : null
    });
  } finally {
    client.release();
  }
};

module.exports = {
  createEvento,
  getEventos,
  updateEvento,
  deleteEvento
};