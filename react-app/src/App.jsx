import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Generos from '../pages/Generos';
import Directores from '../pages/Directores';
import Productoras from '../pages/Productoras';
import Tipos from '../pages/Tipos';
import Media from '../pages/Media';

function Inicio() {
  return (
    <div className="container py-5">
     <h1 className="text-center mb-4 text-dark">
  🎬 API de Películas
</h1>

      <div className="row g-3">

        <div className="col-md-4">
          <Link
            to="/generos"
            className="btn btn-primary w-100 p-3"
          >
            🎭 Géneros
          </Link>
        </div>

        <div className="col-md-4">
          <Link
            to="/directores"
            className="btn btn-primary w-100 p-3"
          >
            🎥 Directores
          </Link>
        </div>

        <div className="col-md-4">
          <Link
            to="/productoras"
            className="btn btn-primary w-100 p-3"
          >
            🏢 Productoras
          </Link>
        </div>

        <div className="col-md-6">
          <Link
            to="/tipos"
            className="btn btn-primary w-100 p-3"
          >
            📺 Tipos
          </Link>
        </div>

        <div className="col-md-6">
          <Link
            to="/media"
            className="btn btn-success w-100 p-3"
          >
            🎬 Películas y Series
          </Link>
        </div>

      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>

      <nav className="navbar navbar-dark bg-dark">
        <div className="container">
          <Link to="/" className="navbar-brand">
            🎬 API Películas
          </Link>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Inicio />} />

        <Route path="/generos" element={<Generos />} />

        <Route path="/directores" element={<Directores />} />

        <Route path="/productoras" element={<Productoras />} />

        <Route path="/tipos" element={<Tipos />} />

        <Route path="/media" element={<Media />} />
      </Routes>

    </BrowserRouter>
  );
}

export default App;