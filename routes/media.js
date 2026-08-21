const express = require('express');

const controller = require('../controllers/mediacontroller');

const mediaRouter = express.Router();

// Obtener todas las películas y series
mediaRouter.get('/', controller.obtenerMedia);

// Obtener una película o serie por ID
mediaRouter.get('/:id', controller.obtenerMediaPorId);

// Crear una película o serie
mediaRouter.post('/', controller.crearMedia);

// Actualizar una película o serie
mediaRouter.put('/:id', controller.actualizarMedia);

// Eliminar una película o serie
mediaRouter.delete('/:id', controller.eliminarMedia);

module.exports = mediaRouter;