import { useEffect, useState } from 'react';
import axios from 'axios';

function Tipos() {
  const [tipos, setTipos] = useState([]);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [editando, setEditando] = useState(null);

  const cargarTipos = () => {
    axios
      .get('https://api-peliculas-jpv1.onrender.com/api/tipos')
      .then((respuesta) => {
        setTipos(respuesta.data);
      })
      .catch((error) => {
        console.error('Error al cargar los tipos:', error);
      });
  };

  useEffect(() => {
    cargarTipos();
  }, []);

  const guardarTipo = (e) => {
    e.preventDefault();

    if (nombre.trim() === '') {
      return;
    }

    if (editando) {
      axios
        .put(`https://api-peliculas-jpv1.onrender.com/api/tipos/${editando.id}`, {
          nombre: nombre,
          descripcion: descripcion
        })
        .then(() => {
          setNombre('');
          setDescripcion('');
          setEditando(null);
          cargarTipos();
        })
        .catch((error) => {
          console.error('Error al actualizar el tipo:', error);
        });
    } else {
      axios
        .post('https://api-peliculas-jpv1.onrender.com/api/tipos', {
          nombre: nombre,
          descripcion: descripcion
        })
        .then(() => {
          setNombre('');
          setDescripcion('');
          cargarTipos();
        })
        .catch((error) => {
          console.error('Error al agregar el tipo:', error);
        });
    }
  };

  const editarTipo = (tipo) => {
    setEditando(tipo);
    setNombre(tipo.nombre);
    setDescripcion(tipo.descripcion || '');
  };

  const cancelarEdicion = () => {
    setEditando(null);
    setNombre('');
    setDescripcion('');
  };

  const eliminarTipo = (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este tipo?')) {
      return;
    }

    axios
      .delete(`https://api-peliculas-jpv1.onrender.com/api/tipos/${id}`)
      .then(() => {
        cargarTipos();
      })
      .catch((error) => {
        console.error('Error al eliminar el tipo:', error);
      });
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4 text-dark">📺 Tipos</h2>

      <form onSubmit={guardarTipo} className="mb-4">
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Nombre del tipo"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <textarea
            className="form-control"
            placeholder="Descripción"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          ></textarea>
        </div>

        <button type="submit" className="btn btn-primary me-2">
          {editando ? 'Actualizar' : 'Agregar tipo'}
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
      </form>

      <div className="card">
        <div className="card-header">
          Lista de tipos
        </div>

        <ul className="list-group list-group-flush">
          {tipos.map((tipo) => (
            <li key={tipo.id} className="list-group-item">
              <strong>{tipo.nombre}</strong>

              <br />

              {tipo.descripcion}

              <div className="mt-2">
                <button
                  type="button"
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => editarTipo(tipo)}
                >
                  ✏️ Editar
                </button>

                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() => eliminarTipo(tipo.id)}
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

export default Tipos;