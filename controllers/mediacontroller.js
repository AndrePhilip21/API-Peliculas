const Database = require('better-sqlite3');

const db = new Database('peliculas.db');

// Obtener todas las películas y series
const obtenerMedia = (req, res) => {
    try {
        const media = db.prepare(`
            SELECT 
                media.*,
                generos.nombre AS genero,
                directores.nombres AS director,
                productoras.nombre AS productora,
                tipos.nombre AS tipo
            FROM media
            INNER JOIN generos ON media.genero_id = generos.id
            INNER JOIN directores ON media.director_id = directores.id
            INNER JOIN productoras ON media.productora_id = productoras.id
            INNER JOIN tipos ON media.tipo_id = tipos.id
        `).all();

        res.json(media);
    } catch (error) {
        res.status(500).json({
            error: 'Error al obtener las películas y series'
        });
    }
};

// Obtener una película o serie por ID
const obtenerMediaPorId = (req, res) => {
    try {
        const { id } = req.params;

        const media = db.prepare(`
            SELECT 
                media.*,
                generos.nombre AS genero,
                directores.nombres AS director,
                productoras.nombre AS productora,
                tipos.nombre AS tipo
            FROM media
            INNER JOIN generos ON media.genero_id = generos.id
            INNER JOIN directores ON media.director_id = directores.id
            INNER JOIN productoras ON media.productora_id = productoras.id
            INNER JOIN tipos ON media.tipo_id = tipos.id
            WHERE media.id = ?
        `).get(id);

        if (!media) {
            return res.status(404).json({
                error: 'Película o serie no encontrada'
            });
        }

        res.json(media);
    } catch (error) {
        res.status(500).json({
            error: 'Error al obtener la película o serie'
        });
    }
};

// Crear una película o serie
const crearMedia = (req, res) => {
    try {
        const {
            serial,
            titulo,
            sinopsis,
            url,
            imagen,
            anio_estreno,
            genero_id,
            director_id,
            productora_id,
            tipo_id
        } = req.body;

        if (
            !serial ||
            !titulo ||
            !url ||
            !genero_id ||
            !director_id ||
            !productora_id ||
            !tipo_id
        ) {
            return res.status(400).json({
                error: 'Serial, título, URL, género, director, productora y tipo son obligatorios'
            });
        }

        // Verificar que el género exista y esté activo
        const genero = db
            .prepare('SELECT * FROM generos WHERE id = ? AND estado = ?')
            .get(genero_id, 'Activo');

        if (!genero) {
            return res.status(400).json({
                error: 'El género no existe o está inactivo'
            });
        }

        // Verificar que el director exista y esté activo
        const director = db
            .prepare('SELECT * FROM directores WHERE id = ? AND estado = ?')
            .get(director_id, 'Activo');

        if (!director) {
            return res.status(400).json({
                error: 'El director no existe o está inactivo'
            });
        }

        // Verificar que la productora exista y esté activa
        const productora = db
            .prepare('SELECT * FROM productoras WHERE id = ? AND estado = ?')
            .get(productora_id, 'Activo');

        if (!productora) {
            return res.status(400).json({
                error: 'La productora no existe o está inactiva'
            });
        }

        // Verificar que el tipo exista
        const tipo = db
            .prepare('SELECT * FROM tipos WHERE id = ?')
            .get(tipo_id);

        if (!tipo) {
            return res.status(400).json({
                error: 'El tipo no existe'
            });
        }

        const resultado = db.prepare(`
            INSERT INTO media (
                serial,
                titulo,
                sinopsis,
                url,
                imagen,
                anio_estreno,
                genero_id,
                director_id,
                productora_id,
                tipo_id
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
            serial,
            titulo,
            sinopsis || '',
            url,
            imagen || '',
            anio_estreno || null,
            genero_id,
            director_id,
            productora_id,
            tipo_id
        );

        const nuevaMedia = db.prepare(`
            SELECT 
                media.*,
                generos.nombre AS genero,
                directores.nombres AS director,
                productoras.nombre AS productora,
                tipos.nombre AS tipo
            FROM media
            INNER JOIN generos ON media.genero_id = generos.id
            INNER JOIN directores ON media.director_id = directores.id
            INNER JOIN productoras ON media.productora_id = productoras.id
            INNER JOIN tipos ON media.tipo_id = tipos.id
            WHERE media.id = ?
        `).get(resultado.lastInsertRowid);

        res.status(201).json(nuevaMedia);

    } catch (error) {
        res.status(500).json({
            error: 'Error al crear la película o serie',
            detalle: error.message
        });
    }
};

// Actualizar una película o serie
const actualizarMedia = (req, res) => {
    try {
        const { id } = req.params;

        const {
            serial,
            titulo,
            sinopsis,
            url,
            imagen,
            anio_estreno,
            genero_id,
            director_id,
            productora_id,
            tipo_id
        } = req.body;

        const media = db
            .prepare('SELECT * FROM media WHERE id = ?')
            .get(id);

        if (!media) {
            return res.status(404).json({
                error: 'Película o serie no encontrada'
            });
        }

        db.prepare(`
            UPDATE media
            SET serial = ?,
                titulo = ?,
                sinopsis = ?,
                url = ?,
                imagen = ?,
                anio_estreno = ?,
                genero_id = ?,
                director_id = ?,
                productora_id = ?,
                tipo_id = ?,
                fecha_actualizacion = CURRENT_TIMESTAMP
            WHERE id = ?
        `).run(
            serial || media.serial,
            titulo || media.titulo,
            sinopsis !== undefined ? sinopsis : media.sinopsis,
            url || media.url,
            imagen !== undefined ? imagen : media.imagen,
            anio_estreno !== undefined ? anio_estreno : media.anio_estreno,
            genero_id || media.genero_id,
            director_id || media.director_id,
            productora_id || media.productora_id,
            tipo_id || media.tipo_id,
            id
        );

        const mediaActualizada = db.prepare(`
            SELECT 
                media.*,
                generos.nombre AS genero,
                directores.nombres AS director,
                productoras.nombre AS productora,
                tipos.nombre AS tipo
            FROM media
            INNER JOIN generos ON media.genero_id = generos.id
            INNER JOIN directores ON media.director_id = directores.id
            INNER JOIN productoras ON media.productora_id = productoras.id
            INNER JOIN tipos ON media.tipo_id = tipos.id
            WHERE media.id = ?
        `).get(id);

        res.json(mediaActualizada);

    } catch (error) {
        res.status(500).json({
            error: 'Error al actualizar la película o serie',
            detalle: error.message
        });
    }
};

// Eliminar una película o serie
const eliminarMedia = (req, res) => {
    try {
        const { id } = req.params;

        const media = db
            .prepare('SELECT * FROM media WHERE id = ?')
            .get(id);

        if (!media) {
            return res.status(404).json({
                error: 'Película o serie no encontrada'
            });
        }

        db.prepare('DELETE FROM media WHERE id = ?').run(id);

        res.json({
            mensaje: 'Película o serie eliminada correctamente'
        });

    } catch (error) {
        res.status(500).json({
            error: 'Error al eliminar la película o serie'
        });
    }
};

module.exports = {
    obtenerMedia,
    obtenerMediaPorId,
    crearMedia,
    actualizarMedia,
    eliminarMedia
};