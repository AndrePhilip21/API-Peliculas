const Database = require('better-sqlite3');

// Crear o abrir la base de datos
const db = new Database('peliculas.db');

// Activar las relaciones entre tablas
db.pragma('foreign_keys = ON');

// Tabla de Géneros
db.exec(`
    CREATE TABLE IF NOT EXISTS generos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL UNIQUE,
        estado TEXT NOT NULL DEFAULT 'Activo',
        fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
        fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP,
        descripcion TEXT
    )
`);

// Tabla de Directores
db.exec(`
    CREATE TABLE IF NOT EXISTS directores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombres TEXT NOT NULL,
        estado TEXT NOT NULL DEFAULT 'Activo',
        fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
        fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`);

// Tabla de Productoras
db.exec(`
    CREATE TABLE IF NOT EXISTS productoras (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL UNIQUE,
        estado TEXT NOT NULL DEFAULT 'Activo',
        fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
        fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP,
        slogan TEXT,
        descripcion TEXT
    )
`);

// Tabla de Tipos
db.exec(`
    CREATE TABLE IF NOT EXISTS tipos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL UNIQUE,
        fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
        fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP,
        descripcion TEXT
    )
`);

// Tabla de Media (Películas y Series)
db.exec(`
    CREATE TABLE IF NOT EXISTS media (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        serial TEXT NOT NULL UNIQUE,
        titulo TEXT NOT NULL,
        sinopsis TEXT,
        url TEXT NOT NULL UNIQUE,
        imagen TEXT,
        fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
        fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP,
        anio_estreno INTEGER,
        genero_id INTEGER NOT NULL,
        director_id INTEGER NOT NULL,
        productora_id INTEGER NOT NULL,
        tipo_id INTEGER NOT NULL,

        FOREIGN KEY (genero_id) REFERENCES generos(id),
        FOREIGN KEY (director_id) REFERENCES directores(id),
        FOREIGN KEY (productora_id) REFERENCES productoras(id),
        FOREIGN KEY (tipo_id) REFERENCES tipos(id)
    )
`);

// Géneros iniciales solicitados en el caso de estudio
const insertarGenero = db.prepare(`
    INSERT OR IGNORE INTO generos (nombre, descripcion)
    VALUES (?, ?)
`);

insertarGenero.run('Acción', 'Películas y series de acción');
insertarGenero.run('Aventura', 'Películas y series de aventura');
insertarGenero.run('Ciencia ficción', 'Películas y series de ciencia ficción');
insertarGenero.run('Drama', 'Películas y series dramáticas');
insertarGenero.run('Terror', 'Películas y series de terror');

// Tipos iniciales
const insertarTipo = db.prepare(`
    INSERT OR IGNORE INTO tipos (nombre, descripcion)
    VALUES (?, ?)
`);

insertarTipo.run('Película', 'Producción cinematográfica');
insertarTipo.run('Serie', 'Producción dividida en episodios');

// Mensaje de confirmación
console.log('Base de datos creada correctamente.');
console.log('Tablas creadas: generos, directores, productoras, tipos y media.');

db.close();