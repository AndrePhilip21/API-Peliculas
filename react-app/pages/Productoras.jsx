import { useEffect, useState } from 'react';
import axios from 'axios';

function Productoras() {
  const [productoras, setProductoras] = useState([]);
  const [nombre, setNombre] = useState('');
  const [slogan, setSlogan] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [editando, setEditando] = useState(null);

  const cargarProductoras = () => {
    axios
      .get('http://localhost:3000/api/productoras')
      .then((respuesta) => {
        setProductoras(respuesta.data);
      })
      .catch((error) => {
        console.error('Error al cargar las productoras:', error);
      });
  };

  useEffect(() => {
    cargarProductoras();
  }, []);

  const guardarProductora = (e) => {
    e.preventDefault();

    if (nombre.trim() === '') {
      return;
    }

    if (editando) {
      axios
        .put(`http://localhost:3000/api/productoras/${editando.id}`, {
          nombre: nombre,
          slogan: slogan,
          descripcion: descripcion,
          estado: editando.estado
        })
        .then(() => {
          setNombre('');
          setSlogan('');
          setDescripcion('');
          setEditando(null);
          cargarProductoras();
        })
        .catch((error) => {
          console.error('Error al actualizar la productora:', error);
        });
    } else {
      axios
        .post('http://localhost:3000/api/productoras', {
          nombre: nombre,
          slogan: slogan,
          descripcion: descripcion
        })
        .then(() => {
          setNombre('');
          setSlogan('');
          setDescripcion('');
          cargarProductoras();
        })
        .catch((error) => {
          console.error('Error al agregar la productora:', error);
        });
    }
  };

  const editarProductora = (productora) => {
    setEditando(productora);
    setNombre(productora.nombre);
    setSlogan(productora.slogan || '');
    setDescripcion(productora.descripcion || '');
  };

  const cancelarEdicion = () => {
    setEditando(null);
    setNombre('');
    setSlogan('');
    setDescripcion('');
  };

  const eliminarProductora = (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar esta productora?')) {
      return;
    }

    axios
      .delete(`http://localhost:3000/api/productoras/${id}`)
      .then(() => {
        cargarProductoras();
      })
      .catch((error) => {
        console.error('Error al eliminar la productora:', error);
      });
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4 text-dark">🏢 Productoras</h2>

      <form onSubmit={guardarProductora} className="mb-4">
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Nombre de la productora"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Slogan"
            value={slogan}
            onChange={(e) => setSlogan(e.target.value)}
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
          {editando ? 'Actualizar' : 'Agregar productora'}
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
          Lista de productoras
        </div>

        <ul className="list-group list-group-flush">
          {productoras.map((productora) => (
            <li key={productora.id} className="list-group-item">
              <strong>{productora.nombre}</strong>

              <br />

              {productora.slogan}

              <br />

              {productora.descripcion}

              <div className="mt-2">
                <button
                  type="button"
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => editarProductora(productora)}
                >
                  ✏️ Editar
                </button>

                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() => eliminarProductora(productora.id)}
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

export default Productoras;