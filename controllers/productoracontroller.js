const Database = require('better-sqlite3');

const db = new Database('peliculas.db');

// Obtener todas las productoras
const obtenerProductoras = (req, res) => {
    try {
        const productoras = db.prepare('SELECT * FROM productoras').all();
        res.json(productoras);
    } catch (error) {
        res.status(500).json({
            error: 'Error al obtener las productoras'
        });
    }
};

// Obtener una productora por ID
const obtenerProductoraPorId = (req, res) => {
    try {
        const { id } = req.params;

        const productora = db
            .prepare('SELECT * FROM productoras WHERE id = ?')
            .get(id);

        if (!productora) {
            return res.status(404).json({
                error: 'Productora no encontrada'
            });
        }

        res.json(productora);
    } catch (error) {
        res.status(500).json({
            error: 'Error al obtener la productora'
        });
    }
};

// Crear una productora
const crearProductora = (req, res) => {
    try {
        const { nombre, estado, slogan, descripcion } = req.body;

        if (!nombre) {
            return res.status(400).json({
                error: 'El nombre es obligatorio'
            });
        }

        const resultado = db.prepare(`
            INSERT INTO productoras (nombre, estado, slogan, descripcion)
            VALUES (?, ?, ?, ?)
        `).run(
            nombre,
            estado || 'Activo',
            slogan || '',
            descripcion || ''
        );

        const nuevaProductora = db
            .prepare('SELECT * FROM productoras WHERE id = ?')
            .get(resultado.lastInsertRowid);

        res.status(201).json(nuevaProductora);
    } catch (error) {
        res.status(500).json({
            error: 'Error al crear la productora'
        });
    }
};

// Actualizar una productora
const actualizarProductora = (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, estado, slogan, descripcion } = req.body;

        const productora = db
            .prepare('SELECT * FROM productoras WHERE id = ?')
            .get(id);

        if (!productora) {
            return res.status(404).json({
                error: 'Productora no encontrada'
            });
        }

        db.prepare(`
            UPDATE productoras
            SET nombre = ?,
                estado = ?,
                slogan = ?,
                descripcion = ?,
                fecha_actualizacion = CURRENT_TIMESTAMP
            WHERE id = ?
        `).run(
            nombre || productora.nombre,
            estado || productora.estado,
            slogan !== undefined ? slogan : productora.slogan,
            descripcion !== undefined ? descripcion : productora.descripcion,
            id
        );

        const productoraActualizada = db
            .prepare('SELECT * FROM productoras WHERE id = ?')
            .get(id);

        res.json(productoraActualizada);
    } catch (error) {
        res.status(500).json({
            error: 'Error al actualizar la productora'
        });
    }
};

// Eliminar una productora
const eliminarProductora = (req, res) => {
    try {
        const { id } = req.params;

        const productora = db
            .prepare('SELECT * FROM productoras WHERE id = ?')
            .get(id);

        if (!productora) {
            return res.status(404).json({
                error: 'Productora no encontrada'
            });
        }

        db.prepare('DELETE FROM productoras WHERE id = ?').run(id);

        res.json({
            mensaje: 'Productora eliminada correctamente'
        });
    } catch (error) {
        res.status(500).json({
            error: 'Error al eliminar la productora'
        });
    }
};

module.exports = {
    obtenerProductoras,
    obtenerProductoraPorId,
    crearProductora,
    actualizarProductora,
    eliminarProductora
};