const express = require('express');

const controller = require('../controllers/generocontroller');

const generosRoutes = express.Router();

// Obtener todos los géneros
generosRoutes.get('/', controller.obtenerGeneros);

// Obtener un género por ID
generosRoutes.get('/:id', controller.obtenerGeneroPorId);

// Crear un género
generosRoutes.post('/', controller.crearGenero);

// Actualizar un género
generosRoutes.put('/:id', controller.actualizarGenero);

// Eliminar un género
generosRoutes.delete('/:id', controller.eliminarGenero);

module.exports = generosRoutes;