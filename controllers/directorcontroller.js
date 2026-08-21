const Database = require('better-sqlite3');

const db = new Database('peliculas.db');

// Obtener todos los directores
const obtenerDirectores = (req, res) => {
    try {
        const directores = db.prepare('SELECT * FROM directores').all();
        res.json(directores);
    } catch (error) {
        res.status(500).json({
            error: 'Error al obtener los directores'
        });
    }
};

// Obtener un director por ID
const obtenerDirectorPorId = (req, res) => {
    try {
        const { id } = req.params;

        const director = db
            .prepare('SELECT * FROM directores WHERE id = ?')
            .get(id);

        if (!director) {
            return res.status(404).json({
                error: 'Director no encontrado'
            });
        }

        res.json(director);
    } catch (error) {
        res.status(500).json({
            error: 'Error al obtener el director'
        });
    }
};

// Crear un director
const crearDirector = (req, res) => {
    try {
        const { nombres, estado } = req.body;

        if (!nombres) {
            return res.status(400).json({
                error: 'Los nombres son obligatorios'
            });
        }

        const resultado = db.prepare(`
            INSERT INTO directores (nombres, estado)
            VALUES (?, ?)
        `).run(
            nombres,
            estado || 'Activo'
        );

        const nuevoDirector = db
            .prepare('SELECT * FROM directores WHERE id = ?')
            .get(resultado.lastInsertRowid);

        res.status(201).json(nuevoDirector);
    } catch (error) {
        res.status(500).json({
            error: 'Error al crear el director'
        });
    }
};

// Actualizar un director
const actualizarDirector = (req, res) => {
    try {
        const { id } = req.params;
        const { nombres, estado } = req.body;

        const director = db
            .prepare('SELECT * FROM directores WHERE id = ?')
            .get(id);

        if (!director) {
            return res.status(404).json({
                error: 'Director no encontrado'
            });
        }

        db.prepare(`
            UPDATE directores
            SET nombres = ?,
                estado = ?,
                fecha_actualizacion = CURRENT_TIMESTAMP
            WHERE id = ?
        `).run(
            nombres || director.nombres,
            estado || director.estado,
            id
        );

        const directorActualizado = db
            .prepare('SELECT * FROM directores WHERE id = ?')
            .get(id);

        res.json(directorActualizado);
    } catch (error) {
        res.status(500).json({
            error: 'Error al actualizar el director'
        });
    }
};

// Eliminar un director
const eliminarDirector = (req, res) => {
    try {
        const { id } = req.params;

        const director = db
            .prepare('SELECT * FROM directores WHERE id = ?')
            .get(id);

        if (!director) {
            return res.status(404).json({
                error: 'Director no encontrado'
            });
        }

        db.prepare('DELETE FROM directores WHERE id = ?').run(id);

        res.json({
            mensaje: 'Director eliminado correctamente'
        });
    } catch (error) {
    console.error(error);

    res.status(500).json({
        error: 'Error al crear el director',
        detalle: error.message
    });
}
};

module.exports = {
    obtenerDirectores,
    obtenerDirectorPorId,
    crearDirector,
    actualizarDirector,
    eliminarDirector
};