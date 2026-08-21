const express = require('express');
const cors = require('cors');

const generosRoutes = require('../routes/generos');
const directoresRoutes = require('../routes/directores');
const productorasRoutes = require('../routes/productoras');
const tiposRoutes = require('../routes/tipos');
const mediaRoutes = require('../routes/media');

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({
        mensaje: 'API de Películas funcionando correctamente'
    });
});

// Rutas de géneros
app.use('/api/generos', generosRoutes);

// Rutas de directores
app.use('/api/directores', directoresRoutes);

// Rutas de productoras
app.use('/api/productoras', productorasRoutes);

// Rutas de tipos
app.use('/api/tipos', tiposRoutes);

// Rutas de películas y series
app.use('/api/media', mediaRoutes);

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});