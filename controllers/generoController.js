const Database = require('better-sqlite3');

const db = new Database('peliculas.db');

// Obtener todos los géneros
const obtenerGeneros = (req, res) => {
    try {
        const generos = db.prepare('SELECT * FROM generos').all();
        res.json(generos);
    } catch (error) {
        res.status(500).json({
            error: 'Error al obtener los géneros'
        });
    }
};

// Obtener un género por ID
const obtenerGeneroPorId = (req, res) => {
    try {
        const { id } = req.params;

        const genero = db
            .prepare('SELECT * FROM generos WHERE id = ?')
            .get(id);

        if (!genero) {
            return res.status(404).json({
                error: 'Género no encontrado'
            });
        }

        res.json(genero);
    } catch (error) {
        res.status(500).json({
            error: 'Error al obtener el género'
        });
    }
};

// Crear un género
const crearGenero = (req, res) => {
    try {
        const { nombre, estado, descripcion } = req.body;

        if (!nombre) {
            return res.status(400).json({
                error: 'El nombre es obligatorio'
            });
        }

        const resultado = db.prepare(`
            INSERT INTO generos (nombre, estado, descripcion)
            VALUES (?, ?, ?)
        `).run(
            nombre,
            estado || 'Activo',
            descripcion || ''
        );

        const nuevoGenero = db
            .prepare('SELECT * FROM generos WHERE id = ?')
            .get(resultado.lastInsertRowid);

        res.status(201).json(nuevoGenero);
    } catch (error) {
        res.status(500).json({
            error: 'Error al crear el género'
        });
    }
};

// Actualizar un género
const actualizarGenero = (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, estado, descripcion } = req.body;

        const genero = db
            .prepare('SELECT * FROM generos WHERE id = ?')
            .get(id);

        if (!genero) {
            return res.status(404).json({
                error: 'Género no encontrado'
            });
        }

        db.prepare(`
            UPDATE generos
            SET nombre = ?,
                estado = ?,
                descripcion = ?,
                fecha_actualizacion = CURRENT_TIMESTAMP
            WHERE id = ?
        `).run(
            nombre || genero.nombre,
            estado || genero.estado,
            descripcion !== undefined ? descripcion : genero.descripcion,
            id
        );

        const generoActualizado = db
            .prepare('SELECT * FROM generos WHERE id = ?')
            .get(id);

        res.json(generoActualizado);
    } catch (error) {
        res.status(500).json({
            error: 'Error al actualizar el género'
        });
    }
};

// Eliminar un género
const eliminarGenero = (req, res) => {
    try {
        const { id } = req.params;

        const genero = db
            .prepare('SELECT * FROM generos WHERE id = ?')
            .get(id);

        if (!genero) {
            return res.status(404).json({
                error: 'Género no encontrado'
            });
        }

        db.prepare('DELETE FROM generos WHERE id = ?').run(id);

        res.json({
            mensaje: 'Género eliminado correctamente'
        });
    } catch (error) {
        res.status(500).json({
            error: 'Error al eliminar el género'
        });
    }
};

module.exports = {
    obtenerGeneros,
    obtenerGeneroPorId,
    crearGenero,
    actualizarGenero,
    eliminarGenero
};