import { useEffect, useState } from 'react';
import axios from 'axios';

function Media() {
  const [media, setMedia] = useState([]);
  const [generos, setGeneros] = useState([]);
  const [directores, setDirectores] = useState([]);
  const [productoras, setProductoras] = useState([]);
  const [tipos, setTipos] = useState([]);

  const [serial, setSerial] = useState('');
  const [titulo, setTitulo] = useState('');
  const [sinopsis, setSinopsis] = useState('');
  const [url, setUrl] = useState('');
  const [imagen, setImagen] = useState('');
  const [anioEstreno, setAnioEstreno] = useState('');
  const [generoId, setGeneroId] = useState('');
  const [directorId, setDirectorId] = useState('');
  const [productoraId, setProductoraId] = useState('');
  const [tipoId, setTipoId] = useState('');

  const [editando, setEditando] = useState(null);

  const cargarDatos = async () => {
    try {
      const respuestaMedia = await axios.get(
        'http://localhost:3000/api/media'
      );

      const respuestaGeneros = await axios.get(
        'http://localhost:3000/api/generos'
      );

      const respuestaDirectores = await axios.get(
        'http://localhost:3000/api/directores'
      );

      const respuestaProductoras = await axios.get(
        'http://localhost:3000/api/productoras'
      );

      const respuestaTipos = await axios.get(
        'http://localhost:3000/api/tipos'
      );

      setMedia(respuestaMedia.data);
      setGeneros(respuestaGeneros.data);
      setDirectores(respuestaDirectores.data);
      setProductoras(respuestaProductoras.data);
      setTipos(respuestaTipos.data);
    } catch (error) {
      console.error('Error al cargar los datos:', error);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const limpiarFormulario = () => {
    setSerial('');
    setTitulo('');
    setSinopsis('');
    setUrl('');
    setImagen('');
    setAnioEstreno('');
    setGeneroId('');
    setDirectorId('');
    setProductoraId('');
    setTipoId('');
    setEditando(null);
  };

  const guardarMedia = async (e) => {
    e.preventDefault();

    if (
      !serial.trim() ||
      !titulo.trim() ||
      !url.trim() ||
      !generoId ||
      !directorId ||
      !productoraId ||
      !tipoId
    ) {
      alert('Completa todos los campos obligatorios.');
      return;
    }

    try {
      const datos = {
        serial: serial,
        titulo: titulo,
        sinopsis: sinopsis,
        url: url,
        imagen: imagen,
        anio_estreno: anioEstreno || null,
        genero_id: Number(generoId),
        director_id: Number(directorId),
        productora_id: Number(productoraId),
        tipo_id: Number(tipoId)
      };

      if (editando) {
        await axios.put(
          `http://localhost:3000/api/media/${editando.id}`,
          datos
        );

        alert('Película o serie actualizada correctamente.');
      } else {
        await axios.post(
          'http://localhost:3000/api/media',
          datos
        );

        alert('Película o serie agregada correctamente.');
      }

      limpiarFormulario();
      cargarDatos();

    } catch (error) {
      console.error('Error al guardar la película o serie:', error);

      if (error.response) {
        alert(
          error.response.data.error ||
          'Error al guardar la película o serie.'
        );
      } else {
        alert('No se pudo conectar con el servidor.');
      }
    }
  };

  const editarMedia = (item) => {
    setEditando(item);

    setSerial(item.serial || '');
    setTitulo(item.titulo || '');
    setSinopsis(item.sinopsis || '');
    setUrl(item.url || '');
    setImagen(item.imagen || '');
    setAnioEstreno(item.anio_estreno || '');

    setGeneroId(item.genero_id || '');
    setDirectorId(item.director_id || '');
    setProductoraId(item.productora_id || '');
    setTipoId(item.tipo_id || '');

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const eliminarMedia = async (id) => {
    const confirmar = window.confirm(
      '¿Seguro que deseas eliminar esta película o serie?'
    );

    if (!confirmar) {
      return;
    }

    try {
      await axios.delete(
        `http://localhost:3000/api/media/${id}`
      );

      alert('Película o serie eliminada correctamente.');

      cargarDatos();

    } catch (error) {
      console.error(
        'Error al eliminar la película o serie:',
        error
      );

      if (error.response) {
        alert(
          error.response.data.error ||
          'No se pudo eliminar la película o serie.'
        );
      } else {
        alert('No se pudo conectar con el servidor.');
      }
    }
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4 text-dark">
        🎬 Películas y Series
      </h2>

      <form onSubmit={guardarMedia} className="mb-5">

        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Serial *"
            value={serial}
            onChange={(e) => setSerial(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Título *"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <textarea
            className="form-control"
            placeholder="Sinopsis"
            value={sinopsis}
            onChange={(e) => setSinopsis(e.target.value)}
          ></textarea>
        </div>

        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="URL *"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="URL de imagen"
            value={imagen}
            onChange={(e) => setImagen(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <input
            type="number"
            className="form-control"
            placeholder="Año de estreno"
            value={anioEstreno}
            onChange={(e) => setAnioEstreno(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <select
            className="form-select"
            value={generoId}
            onChange={(e) => setGeneroId(e.target.value)}
          >
            <option value="">
              Selecciona un género *
            </option>

            {generos.map((genero) => (
              <option key={genero.id} value={genero.id}>
                {genero.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <select
            className="form-select"
            value={directorId}
            onChange={(e) => setDirectorId(e.target.value)}
          >
            <option value="">
              Selecciona un director *
            </option>

            {directores.map((director) => (
              <option key={director.id} value={director.id}>
                {director.nombres}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <select
            className="form-select"
            value={productoraId}
            onChange={(e) => setProductoraId(e.target.value)}
          >
            <option value="">
              Selecciona una productora *
            </option>

            {productoras.map((productora) => (
              <option key={productora.id} value={productora.id}>
                {productora.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <select
            className="form-select"
            value={tipoId}
            onChange={(e) => setTipoId(e.target.value)}
          >
            <option value="">
              Selecciona un tipo *
            </option>

            {tipos.map((tipo) => (
              <option key={tipo.id} value={tipo.id}>
                {tipo.nombre}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="btn btn-success me-2"
        >
          {editando
            ? 'Actualizar película o serie'
            : 'Agregar película o serie'}
        </button>

        {editando && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={limpiarFormulario}
          >
            Cancelar
          </button>
        )}

      </form>

      <div className="card">
        <div className="card-header">
          Lista de películas y series
        </div>

        <div className="card-body">

          {media.length === 0 ? (
            <p className="text-dark">
              No hay películas o series registradas.
            </p>
          ) : (
            media.map((item) => (
              <div
                key={item.id}
                className="card mb-3"
              >
                <div className="card-body">

                  <h4 className="text-dark">
                    {item.titulo}
                  </h4>

                  <p className="text-dark">
                    <strong>Serial:</strong>{' '}
                    {item.serial}
                  </p>

                  <p className="text-dark">
                    <strong>Tipo:</strong>{' '}
                    {item.tipo}
                  </p>

                  <p className="text-dark">
                    <strong>Género:</strong>{' '}
                    {item.genero}
                  </p>

                  <p className="text-dark">
                    <strong>Director:</strong>{' '}
                    {item.director}
                  </p>

                  <p className="text-dark">
                    <strong>Productora:</strong>{' '}
                    {item.productora}
                  </p>

                  <p className="text-dark">
                    <strong>Año:</strong>{' '}
                    {item.anio_estreno ||
                      'No especificado'}
                  </p>

                  <p className="text-dark">
                    <strong>Sinopsis:</strong>{' '}
                    {item.sinopsis}
                  </p>

                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-primary me-2"
                  >
                    Ver contenido
                  </a>

                  <button
                    type="button"
                    className="btn btn-warning me-2"
                    onClick={() => editarMedia(item)}
                  >
                    ✏️ Editar
                  </button>

                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => eliminarMedia(item.id)}
                  >
                    🗑️ Eliminar
                  </button>

                </div>
              </div>
            ))
          )}

        </div>
      </div>
    </div>
  );
}

export default Media;