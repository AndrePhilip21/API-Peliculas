import { useEffect, useState } from 'react';
import axios from 'axios';

function Directores() {
  const [directores, setDirectores] = useState([]);
  const [nombres, setNombres] = useState('');
  const [editando, setEditando] = useState(null);

  const cargarDirectores = () => {
    axios
      .get('http://localhost:3000/api/directores')
      .then((respuesta) => {
        setDirectores(respuesta.data);
      })
      .catch((error) => {
        console.error('Error al cargar los directores:', error);
      });
  };

  useEffect(() => {
    cargarDirectores();
  }, []);

  const guardarDirector = (e) => {
    e.preventDefault();

    if (nombres.trim() === '') {
      return;
    }

    if (editando) {
      axios
        .put(`http://localhost:3000/api/directores/${editando.id}`, {
          nombres: nombres,
          estado: editando.estado
        })
        .then(() => {
          setNombres('');
          setEditando(null);
          cargarDirectores();
        })
        .catch((error) => {
          console.error('Error al actualizar el director:', error);
        });
    } else {
      axios
        .post('http://localhost:3000/api/directores', {
          nombres: nombres
        })
        .then(() => {
          setNombres('');
          cargarDirectores();
        })
        .catch((error) => {
          console.error('Error al agregar el director:', error);
        });
    }
  };

  const editarDirector = (director) => {
    setEditando(director);
    setNombres(director.nombres);
  };

  const cancelarEdicion = () => {
    setEditando(null);
    setNombres('');
  };

  const eliminarDirector = (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este director?')) {
      return;
    }

    axios
      .delete(`http://localhost:3000/api/directores/${id}`)
      .then(() => {
        cargarDirectores();
      })
      .catch((error) => {
        console.error('Error al eliminar el director:', error);
      });
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4 text-dark">🎥 Directores</h2>

      <form onSubmit={guardarDirector} className="mb-4">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Nombre del director"
            value={nombres}
            onChange={(e) => setNombres(e.target.value)}
          />

          <button type="submit" className="btn btn-primary">
            {editando ? 'Actualizar' : 'Agregar'}
          </button>

          {editando && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={cancelarEdicion}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="card">
        <div className="card-header">
          Lista de directores
        </div>

        <ul className="list-group list-group-flush">
          {directores.map((director) => (
            <li key={director.id} className="list-group-item">
              <strong>{director.nombres}</strong>

              <div className="mt-2">
                <button
                  type="button"
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => editarDirector(director)}
                >
                  ✏️ Editar
                </button>

                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() => eliminarDirector(director.id)}
                >
                  🗑️ Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Directores;