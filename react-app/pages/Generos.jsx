import { useEffect, useState } from 'react';
import axios from 'axios';

function Generos() {
  const [generos, setGeneros] = useState([]);

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [estado, setEstado] = useState('Activo');

  const [editando, setEditando] = useState(false);
  const [idEditando, setIdEditando] = useState(null);

  const cargarGeneros = async () => {
    try {
      const respuesta = await axios.get(
        'http://localhost:3000/api/generos'
      );

      setGeneros(respuesta.data);
    } catch (error) {
      console.error('Error al cargar los géneros:', error);
    }
  };

  useEffect(() => {
    cargarGeneros();
  }, []);

  const limpiarFormulario = () => {
    setNombre('');
    setDescripcion('');
    setEstado('Activo');
    setEditando(false);
    setIdEditando(null);
  };

  const guardarGenero = async (e) => {
    e.preventDefault();

    if (nombre.trim() === '') {
      alert('El nombre del género es obligatorio.');
      return;
    }

    try {
      if (editando) {
        await axios.put(
          `http://localhost:3000/api/generos/${idEditando}`,
          {
            nombre: nombre,
            estado: estado,
            descripcion: descripcion
          }
        );

        alert('Género actualizado correctamente.');
      } else {
        await axios.post(
          'http://localhost:3000/api/generos',
          {
            nombre: nombre,
            estado: estado,
            descripcion: descripcion
          }
        );

        alert('Género agregado correctamente.');
      }

      limpiarFormulario();
      cargarGeneros();

    } catch (error) {
      console.error('Error al guardar el género:', error);

      if (error.response) {
        alert(
          error.response.data.error ||
          'Ocurrió un error al guardar el género.'
        );
      } else {
        alert('No se pudo conectar con el servidor.');
      }
    }
  };

  const editarGenero = (genero) => {
    setIdEditando(genero.id);
    setNombre(genero.nombre);
    setDescripcion(genero.descripcion || '');
    setEstado(genero.estado || 'Activo');
    setEditando(true);

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const eliminarGenero = async (id) => {
    const confirmar = window.confirm(
      '¿Seguro que deseas eliminar este género?'
    );

    if (!confirmar) {
      return;
    }

    try {
      await axios.delete(
        `http://localhost:3000/api/generos/${id}`
      );

      alert('Género eliminado correctamente.');

      cargarGeneros();

    } catch (error) {
      console.error('Error al eliminar el género:', error);

      if (error.response) {
        alert(
          error.response.data.error ||
          'No se pudo eliminar el género.'
        );
      } else {
        alert('No se pudo conectar con el servidor.');
      }
    }
  };

  return (
    <div className="container py-4">

      <h2 className="mb-4 text-dark">
        🎭 Géneros
      </h2>

      <form
        onSubmit={guardarGenero}
        className="mb-4"
      >

        <div className="mb-3">
          <label className="form-label text-dark">
            Nombre
          </label>

          <input
            type="text"
            className="form-control"
            placeholder="Nombre del género"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label text-dark">
            Estado
          </label>

          <select
            className="form-select"
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
          >
            <option value="Activo">
              Activo
            </option>

            <option value="Inactivo">
              Inactivo
            </option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label text-dark">
            Descripción
          </label>

          <textarea
            className="form-control"
            placeholder="Descripción del género"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          ></textarea>
        </div>

        <button
          type="submit"
          className="btn btn-primary me-2"
        >
          {editando
            ? 'Actualizar género'
            : 'Agregar género'}
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
          Lista de géneros
        </div>

        <div className="list-group list-group-flush">

          {generos.length === 0 ? (
            <div className="list-group-item">
              No hay géneros registrados.
            </div>
          ) : (
            generos.map((genero) => (

              <div
                key={genero.id}
                className="list-group-item"
              >

                <h5 className="text-dark mb-1">
                  {genero.nombre}
                </h5>

                <p className="text-dark mb-1">
                  <strong>Estado:</strong>{' '}
                  {genero.estado}
                </p>

                <p className="text-dark mb-2">
                  <strong>Descripción:</strong>{' '}
                  {genero.descripcion || 'Sin descripción'}
                </p>

                <p className="text-muted mb-2">
                  <strong>Creado:</strong>{' '}
                  {genero.fecha_creacion}
                  <br />

                  <strong>Actualizado:</strong>{' '}
                  {genero.fecha_actualizacion}
                </p>

                <button
                  type="button"
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => editarGenero(genero)}
                >
                  ✏️ Editar
                </button>

                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() => eliminarGenero(genero.id)}
                >
                  🗑️ Eliminar
                </button>

              </div>

            ))
          )}

        </div>

      </div>

    </div>
  );
}

export default Generos;;