const express = require('express');

const controller = require('../controllers/productoracontroller');

const productorasRouter = express.Router();

// Obtener todas las productoras
productorasRouter.get('/', controller.obtenerProductoras);

// Obtener una productora por ID
productorasRouter.get('/:id', controller.obtenerProductoraPorId);

// Crear una productora
productorasRouter.post('/', controller.crearProductora);

// Actualizar una productora
productorasRouter.put('/:id', controller.actualizarProductora);

// Eliminar una productora
productorasRouter.delete('/:id', controller.eliminarProductora);

module.exports = productorasRouter;