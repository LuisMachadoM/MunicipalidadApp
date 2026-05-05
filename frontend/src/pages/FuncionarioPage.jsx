import { useEffect, useState } from 'react';
import {
  aprobarSolicitud,
  getSolicitudesFuncionario,
  observarSolicitud,
  rechazarSolicitud
} from '../api/tramites';

export default function FuncionarioPage() {
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState('Cargando solicitudes...');
  const [loadingId, setLoadingId] = useState(null);

  async function load() {
    try {
      const data = await getSolicitudesFuncionario();
      setItems(data);
      setMessage(data.length ? '' : 'No hay solicitudes.');
    } catch (error) {
      setMessage(error.message);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleAction(type, id) {
    const comentario = window.prompt('Ingrese comentario para la acción:') || '';
    setLoadingId(id);

    try {
      if (type === 'aprobar') await aprobarSolicitud(id, comentario);
      if (type === 'rechazar') await rechazarSolicitud(id, comentario);
      if (type === 'observar') await observarSolicitud(id, comentario);
      await load();
    } catch (error) {
      alert(error.message);
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <section>
      <h2>Panel funcionario</h2>

      {message && <p className="message">{message}</p>}

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Ciudadano</th>
              <th>Correo</th>
              <th>Trámite</th>
              <th>Estado</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id_solicitud}>
                <td>{item.id_solicitud}</td>
                <td>{item.nombre} {item.apellido}</td>
                <td>{item.correo}</td>
                <td>{item.nombre_tramite}</td>
                <td>{item.estado_actual}</td>
                <td>{new Date(item.fecha_ingreso).toLocaleString('es-CL')}</td>
                <td>
                  <div className="actions">
                    <button className="btn btn--small" disabled={loadingId === item.id_solicitud} onClick={() => handleAction('aprobar', item.id_solicitud)}>
                      Aprobar
                    </button>
                    <button className="btn btn--small btn--warn" disabled={loadingId === item.id_solicitud} onClick={() => handleAction('observar', item.id_solicitud)}>
                      Observar
                    </button>
                    <button className="btn btn--small btn--danger" disabled={loadingId === item.id_solicitud} onClick={() => handleAction('rechazar', item.id_solicitud)}>
                      Rechazar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
