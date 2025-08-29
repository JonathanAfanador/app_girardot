const negocioModel = require('../models/negocio.model');
const pool = require('../config/db');

const validarCategoria = async (id_categoria) => {
  const result = await pool.query(
    'SELECT 1 FROM Categoria_Negocio WHERE id_categoria = $1',
    [id_categoria]
  );
  return !!result.rows[0];
};

const getAllNegocios = async (req, res) => {
  try {
    const negocios = await negocioModel.getAllNegocios();
    res.json(negocios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getNegocioById = async (req, res) => {
  try {
    const negocio = await negocioModel.getNegocioById(req.params.id);
    if (!negocio) {
      return res.status(404).json({ error: 'Negocio no encontrado' });
    }
    res.json(negocio);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createNegocio = async (req, res) => {
  try {
    if (!(await validarCategoria(req.body.id_categoria))) {
      return res.status(400).json({ error: 'La categoría especificada no existe' });
    }

    const { nombre, direccion, telefono, id_categoria, descripcion } = req.body;
    const query = `
      INSERT INTO Negocio (nombre, direccion, telefono, id_categoria, descripcion, id_usuario)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`;
    const values = [nombre, direccion, telefono, id_categoria, descripcion, req.usuario.id];
    const { rows } = await pool.query(query, values);
    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateNegocio = async (req, res) => {
  const client = await pool.connect();
  try {

    if (req.body.id_categoria && !(await validarCategoria(req.body.id_categoria))) {
      return res.status(400).json({ error: 'Categoría no válida' });
    }

    await client.query('BEGIN');

    // 1. Obtener negocio actual
    const negocioActual = await client.query(
      'SELECT * FROM Negocio WHERE id_negocio = $1',
      [req.params.id]
    );

    if (!negocioActual.rows[0]) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Negocio no encontrado' });
    }

    // 2. Combinar datos actuales con los nuevos
    const datosActuales = negocioActual.rows[0];
    const datosActualizados = {
      nombre: req.body.nombre || datosActuales.nombre,
      direccion: req.body.direccion || datosActuales.direccion,
      telefono: req.body.telefono || datosActuales.telefono,
      id_categoria: req.body.id_categoria || datosActuales.id_categoria,
      descripcion: req.body.descripcion || datosActuales.descripcion
    };

    // 3. Actualizar
    const query = `
      UPDATE Negocio 
      SET nombre = $1, direccion = $2, telefono = $3, 
          id_categoria = $4, descripcion = $5
      WHERE id_negocio = $6
      RETURNING *`;
    
    const values = [
      datosActualizados.nombre,
      datosActualizados.direccion,
      datosActualizados.telefono,
      datosActualizados.id_categoria,
      datosActualizados.descripcion,
      req.params.id
    ];

    const { rows } = await client.query(query, values);
    await client.query('COMMIT');
    res.json(rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({ 
      error: 'Error al actualizar negocio',
      details: process.env.NODE_ENV === 'development' ? error.message : null
    });
  } finally {
    client.release();
  }
};

const deleteNegocio = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Verificar rol (clientes no pueden eliminar)
    if (req.usuario.rol === 'cliente') {
      await client.query('ROLLBACK');
      return res.status(403).json({ error: 'No tienes permisos para esta acción' });
    }

    // 2. Verificar existencia y propiedad
    const negocioQuery = `
      SELECT * FROM Negocio 
      WHERE id_negocio = $1 
      AND (id_usuario = $2 OR $3 = 'administrador')
    `;
    const negocioRes = await client.query(negocioQuery, [
      req.params.id,
      req.usuario.id,
      req.usuario.rol
    ]);

    if (negocioRes.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Negocio no encontrado o no tienes permisos' });
    }

    // 3. Eliminar relaciones primero (eventos, promociones, etc.)
    await client.query('DELETE FROM Evento WHERE id_negocio = $1', [req.params.id]);
    await client.query('DELETE FROM Promocion WHERE id_negocio = $1', [req.params.id]);

    // 4. Eliminar negocio
    await client.query('DELETE FROM Negocio WHERE id_negocio = $1', [req.params.id]);

    await client.query('COMMIT');
    res.json({ message: 'Negocio eliminado correctamente' });
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({
      error: 'Error al eliminar negocio',
      details: process.env.NODE_ENV === 'development' ? error.message : null
    });
  } finally {
    client.release();
  }
};

module.exports = {
  getAllNegocios,
  getNegocioById,
  createNegocio,
  updateNegocio,
  deleteNegocio,
  validarCategoria
};
