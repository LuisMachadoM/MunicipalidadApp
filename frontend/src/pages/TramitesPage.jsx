import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getTramites } from '../api/tramites';
import { useAuth } from '../context/AuthContext';

export default function TramitesPage() {
  const [tramites, setTramites] = useState([]);
  const [message, setMessage] = useState('Cargando trámites...');
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    async function load() {
      try {
        const data = await getTramites();
        setTramites(data);
        setMessage(data.length ? '' : 'No hay trámites disponibles.');
      } catch (error) {
        setMessage(error.message);
      }
    }
    load();
  }, []);

  return (
    <section>
      <h2>Trámites disponibles</h2>

      {message && <p className="message">{message}</p>}

      <div className="cards-grid">
        {tramites.map((tramite) => (
          <article key={tramite.id_tramite} className="card">
            <h3>{tramite.nombre_tramite}</h3>
            <p>{tramite.descripcion || 'Sin descripción.'}</p>

            {isAuthenticated && user?.tipo_usuario === 'CIUDADANO' ? (
              <Link className="btn" to={`/tramites/${tramite.id_tramite}`}>
                Ingresar solicitud
              </Link>
            ) : (
              <p className="help-text">Debes ingresar como ciudadano para enviar una solicitud.</p>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
