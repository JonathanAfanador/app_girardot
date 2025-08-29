const promocionModel = require('../models/promocion.model');
const pool = require('../config/db');

//NICE

const formatColombiaTime = (date) => {
  return new Date(date).toLocaleString('es-CO', {
    timeZone: 'America/Bogota',
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).replace(/(\d+)\/(\d+)\/(\d+), (\d+:\d+:\d+)/, '$3-$1-$2T$4');
};

const formatPromocionResponse = (promocion) => ({
  ...promocion,
  fecha_inicio: formatColombiaTime(promocion.fecha_inicio),
  fecha_fin: formatColombiaTime(promocion.fecha_fin)
});

const createPromocion = async (req, res) => {
  try {
    const nuevaPromocion = await promocionModel.createPromocion(req.body);
    res.status(201).json(formatPromocionResponse(nuevaPromocion));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPromociones = async (req, res) => {
  try {
    const promociones = await promocionModel.getPromocionesByNegocio(req.params.id_negocio);
    res.json(promociones.map(formatPromocionResponse));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updatePromocion = async (req, res) => {
  try {
    // Obtener datos actuales primero
    const promocionActual = await pool.query(
      'SELECT * FROM Promocion WHERE id_promocion = $1',
      [req.params.id_promocion]
    );
    
    if (!promocionActual.rows[0]) {
      return res.status(404).json({ error: 'Promoción no encontrada' });
    }

    // Combinar datos
    const datosActualizados = {
      ...promocionActual.rows[0],
      ...req.body
    };

    const promocionActualizada = await promocionModel.updatePromocion(
      req.params.id_promocion,
      datosActualizados
    );
    
    res.json(formatPromocionResponse(promocionActualizada));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deletePromocion = async (req, res) => {
  try {
    const promocionEliminada = await promocionModel.deletePromocion(req.params.id_promocion);
    if (!promocionEliminada) {
      return res.status(404).json({ error: 'Promoción no encontrada' });
    }
    res.json({ message: 'Promoción eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  formatColombiaTime,
  formatPromocionResponse,
  createPromocion,
  getPromociones,
  updatePromocion,
  deletePromocion,
};