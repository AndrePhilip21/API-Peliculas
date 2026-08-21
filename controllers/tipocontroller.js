const Database = require('better-sqlite3');

const db = new Database('peliculas.db');

// Obtener todos los tipos
const obtenerTipos = (req, res) => {
    try {
        const tipos = db.prepare('SELECT * FROM tipos').all();
        res.json(tipos);
    } catch (error) {
        res.status(500).json({
            error: 'Error al obtener los tipos'
        });
    }
};

// Obtener un tipo por ID
const obtenerTipoPorId = (req, res) => {
    try {
        const { id } = req.params;

        const tipo = db
            .prepare('SELECT * FROM tipos WHERE id = ?')
            .get(id);

        if (!tipo) {
            return res.status(404).json({
                error: 'Tipo no encontrado'
            });
        }

        res.json(tipo);
    } catch (error) {
        res.status(500).json({
            error: 'Error al obtener el tipo'
        });
    }
};

// Crear un tipo
const crearTipo = (req, res) => {
    try {
        const { nombre, descripcion } = req.body;

        if (!nombre) {
            return res.status(400).json({
                error: 'El nombre es obligatorio'
            });
        }

        const resultado = db.prepare(`
            INSERT INTO tipos (nombre, descripcion)
            VALUES (?, ?)
        `).run(
            nombre,
            descripcion || ''
        );

        const nuevoTipo = db
            .prepare('SELECT * FROM tipos WHERE id = ?')
            .get(resultado.lastInsertRowid);

        res.status(201).json(nuevoTipo);
    } catch (error) {
        res.status(500).json({
            error: 'Error al crear el tipo'
        });
    }
};

// Actualizar un tipo
const actualizarTipo = (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion } = req.body;

        const tipo = db
            .prepare('SELECT * FROM tipos WHERE id = ?')
            .get(id);

        if (!tipo) {
            return res.status(404).json({
                error: 'Tipo no encontrado'
            });
        }

        db.prepare(`
            UPDATE tipos
            SET nombre = ?,
                descripcion = ?,
                fecha_actualizacion = CURRENT_TIMESTAMP
            WHERE id = ?
        `).run(
            nombre || tipo.nombre,
            descripcion !== undefined ? descripcion : tipo.descripcion,
            id
        );

        const tipoActualizado = db
            .prepare('SELECT * FROM tipos WHERE id = ?')
            .get(id);

        res.json(tipoActualizado);
    } catch (error) {
        res.status(500).json({
            error: 'Error al actualizar el tipo'
        });
    }
};

// Eliminar un tipo
const eliminarTipo = (req, res) => {
    try {
        const { id } = req.params;

        const tipo = db
            .prepare('SELECT * FROM tipos WHERE id = ?')
            .get(id);

        if (!tipo) {
            return res.status(404).json({
                error: 'Tipo no encontrado'
            });
        }

        db.prepare('DELETE FROM tipos WHERE id = ?').run(id);

        res.json({
            mensaje: 'Tipo eliminado correctamente'
        });
    } catch (error) {
        res.status(500).json({
            error: 'Error al eliminar el tipo'
        });
    }
};

module.exports = {
    obtenerTipos,
    obtenerTipoPorId,
    crearTipo,
    actualizarTipo,
    eliminarTipo
};