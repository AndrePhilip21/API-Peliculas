const express = require('express');

const controller = require('../controllers/directorcontroller');

const directoresRoutes = express.Router();

// Obtener todos los directores
directoresRoutes.get('/', controller.obtenerDirectores);

// Obtener un director por ID
directoresRoutes.get('/:id', controller.obtenerDirectorPorId);

// Crear un director
directoresRoutes.post('/', controller.crearDirector);

// Actualizar un director
directoresRoutes.put('/:id', controller.actualizarDirector);

// Eliminar un director
directoresRoutes.delete('/:id', controller.eliminarDirector);

module.exports = directoresRoutes;