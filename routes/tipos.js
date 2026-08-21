const express = require('express');

const controller = require('../controllers/tipocontroller');

const tiposRouter = express.Router();

// Obtener todos los tipos
tiposRouter.get('/', controller.obtenerTipos);

// Obtener un tipo por ID
tiposRouter.get('/:id', controller.obtenerTipoPorId);

// Crear un tipo
tiposRouter.post('/', controller.crearTipo);

// Actualizar un tipo
tiposRouter.put('/:id', controller.actualizarTipo);

// Eliminar un tipo
tiposRouter.delete('/:id', controller.eliminarTipo);

module.exports = tiposRouter;