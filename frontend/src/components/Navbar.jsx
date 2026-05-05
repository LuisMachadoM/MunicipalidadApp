import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <Link to="/" className="brand">Municipio en Línea</Link>

        <nav className="navlinks">
          <Link to="/tramites">Trámites</Link>

          {isAuthenticated && user?.tipo_usuario === 'CIUDADANO' && (
            <Link to="/mis-tramites">Mis trámites</Link>
          )}

          {isAuthenticated && user?.tipo_usuario === 'FUNCIONARIO' && (
            <Link to="/funcionario">Panel funcionario</Link>
          )}

          {!isAuthenticated ? (
            <>
              <Link to="/login">Ingresar</Link>
              <Link to="/registro" className="btn btn--small">Registro</Link>
            </>
          ) : (
            <>
              <span className="nav-user">{user?.nombre} ({user?.tipo_usuario})</span>
              <button className="btn btn--small btn--secondary" onClick={logout}>
                Salir
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
