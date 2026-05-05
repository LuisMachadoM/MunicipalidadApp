import { useEffect, useState } from 'react';
import { getMisTramites } from '../api/tramites';

export default function MisTramitesPage() {
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState('Cargando trámites...');

  useEffect(() => {
    async function load() {
      try {
        const data = await getMisTramites();
        setItems(data);
        setMessage(data.length ? '' : 'No tienes trámites registrados.');
      } catch (error) {
        setMessage(error.message);
      }
    }
    load();
  }, []);

  return (
    <section>
      <h2>Mis trámites</h2>

      {message && <p className="message">{message}</p>}

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Trámite</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th>Observación</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id_solicitud}>
                <td>{item.id_solicitud}</td>
                <td>{item.nombre_tramite}</td>
                <td>{new Date(item.fecha_ingreso).toLocaleString('es-CL')}</td>
                <td>{item.estado_actual}</td>
                <td>{item.observacion_general || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
