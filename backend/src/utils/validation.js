const Joi = require('joi');

// Esquemas de validación
const negocioSchema = Joi.object({
  nombre: Joi.string().min(3).max(100).required(),
  direccion: Joi.string().min(10).required(),
  telefono: Joi.string().pattern(/^[0-9]{10,15}$/).required(),
  id_categoria: Joi.number().integer().positive().required(),
  descripcion: Joi.string().max(500).allow('')
});

const eventoSchema = Joi.object({
  nombre: Joi.string().min(3).max(100).required(),
  descripcion: Joi.string().max(500).allow(''),
  fecha_inicio: Joi.date().iso().greater('now').required(),
  fecha_fin: Joi.date().iso().greater(Joi.ref('fecha_inicio')).required(),
  id_negocio: Joi.number().integer().positive().required()
});

const promocionSchema = Joi.object({
  nombre_prom: Joi.string().min(3).max(100).required(),
  descripcion: Joi.string().min(10).max(500).required(), // Cambiado de allow('') a required()
  descuento: Joi.number().min(1).max(100).required(),
  fecha_inicio: Joi.date().iso().greater('now').required(),
  fecha_fin: Joi.date().iso().greater(Joi.ref('fecha_inicio')).required(),
  id_negocio: Joi.number().integer().positive().required()
});

// Nuevo esquema para actualización (campos opcionales)
const promocionUpdateSchema = Joi.object({
  nombre_prom: Joi.string().min(3).max(100),
  descripcion: Joi.string().min(10).max(500),
  descuento: Joi.number().min(1).max(100),
  fecha_inicio: Joi.date().iso().greater('now'),
  fecha_fin: Joi.date().iso().greater(Joi.ref('fecha_inicio'))
}).min(1); // Al menos un campo requerido para actualización

const categoriaSchema = Joi.object({
  nombre_categoria: Joi.string().min(3).max(50).required(),
  descripcion: Joi.string().max(200).allow('')
});

const resenaSchema = Joi.object({
  id_negocio: Joi.number().integer().positive().when('id_evento', {
    is: Joi.exist(),
    then: Joi.forbidden(),
    otherwise: Joi.required()
  }),
  id_evento: Joi.number().integer().positive(),
  calificacion: Joi.number().integer().min(1).max(5).required(),
  texto: Joi.string().min(10).max(500).required()
}).xor('id_negocio', 'id_evento'); // Requiere uno de los dos, pero no ambos

const resenaUpdateSchema = Joi.object({
  calificacion: Joi.number().integer().min(1).max(5),
  texto: Joi.string().min(10).max(500)
}).or('calificacion', 'texto'); // Al menos uno requerido para actualizar

// Esquema de validación
const reservaSchema = Joi.object({
  id_negocio: Joi.number().integer().positive().required()
    .messages({
      'number.base': 'El ID del negocio debe ser un número',
      'any.required': 'El negocio es requerido'
    }),
  fecha_reserva: Joi.date().iso().greater('now').required()
    .messages({
      'date.base': 'Fecha inválida',
      'date.greater': 'La fecha debe ser futura'
    })
});

const authSchema = Joi.object({
  nombre: Joi.string().min(3).max(100).required(),
  correo: Joi.string().email().required(),
  contraseña: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/).required(),
  telefono: Joi.string().pattern(/^[0-9]{10,15}$/).required(),
  tipo_usuario: Joi.string().valid('cliente', 'administrador', 'dueño_negocio').required()
});

const loginSchema = Joi.object({
  correo: Joi.string().email().required(),
  contraseña: Joi.string().required()
});

const imagenSchema = Joi.object({
  url: Joi.string().uri().required(),
  descripcion: Joi.string().max(200).allow(''),
  es_principal: Joi.boolean().optional()
});

module.exports = {
  negocioSchema,
  eventoSchema,
  promocionSchema,
  promocionUpdateSchema,
  categoriaSchema,
  resenaSchema,
  resenaUpdateSchema,
  reservaSchema,
  authSchema,
  loginSchema,
  imagenSchema
};