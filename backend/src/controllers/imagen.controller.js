const pool = require('../config/db');

const agregarImagen = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    const { url, descripcion, es_principal } = req.body;
    const id_negocio = req.params.id;

    // Si es principal, quitar marca de otras imágenes
    if (es_principal) {
      await client.query(
        'UPDATE Negocio_Imagen SET es_principal = FALSE WHERE id_negocio = $1',
        [id_negocio]
      );
    }

    // Insertar nueva imagen
    const query = `
      INSERT INTO Negocio_Imagen 
        (id_negocio, url, descripcion, es_principal)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const values = [id_negocio, url, descripcion, es_principal || false];
    const { rows } = await client.query(query, values);

    await client.query('COMMIT');
    res.status(201).json(rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: 'Error al agregar imagen' });
  } finally {
    client.release();
  }
};

const eliminarImagen = async (req, res) => {
  try {
    const { rows } = await pool.query(
      'DELETE FROM Negocio_Imagen WHERE id_imagen = $1 RETURNING *',
      [req.params.id_imagen]
    );
    res.json({ message: 'Imagen eliminada', data: rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { agregarImagen, eliminarImagen };