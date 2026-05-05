import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <section className="hero">
      <div className="card">
        <h1>Municipio en Línea</h1>
        <p>
          Plataforma base para digitalizar trámites municipales de la Municipalidad de Puerto Montt.
        </p>
        <div className="hero-actions">
          <Link to="/tramites" className="btn">Ver trámites</Link>
          <Link to="/registro" className="btn btn--secondary">Crear cuenta</Link>
        </div>
      </div>
    </section>
  );
}
