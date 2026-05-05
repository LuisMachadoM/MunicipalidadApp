import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import FieldRenderer from '../components/FieldRenderer';
import { createSolicitud, getFormularioByTramite } from '../api/tramites';

export default function TramiteFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formulario, setFormulario] = useState(null);
  const [values, setValues] = useState({});
  const [message, setMessage] = useState('Cargando formulario...');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await getFormularioByTramite(id);
        setFormulario(data);
        setMessage('');
      } catch (error) {
        setMessage(error.message);
      }
    }
    load();
  }, [id]);

  function handleFieldChange(field, value) {
    setValues((prev) => ({ ...prev, [field.id_campo]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!formulario) return;

    setLoading(true);
    setMessage('');

    try {
      const payload = [];
      const formData = new FormData();
      formData.append('id_tramite', String(id));

      for (const field of formulario.campos) {
        const currentValue = values[field.id_campo];

        if (field.tipo_campo === 'archivo' && currentValue) {
          const archivoKey = field.nombre_campo;
          formData.append(archivoKey, currentValue);
          payload.push({
            id_campo: field.id_campo,
            archivoKey
          });
          continue;
        }

        if (field.tipo_campo === 'numero') {
          payload.push({
            id_campo: field.id_campo,
            valor_numero: currentValue === '' || currentValue == null ? null : Number(currentValue)
          });
          continue;
        }

        if (field.tipo_campo === 'fecha') {
          payload.push({
            id_campo: field.id_campo,
            valor_fecha: currentValue || null
          });
          continue;
        }

        payload.push({
          id_campo: field.id_campo,
          valor_texto: currentValue || null
        });
      }

      formData.append('data', JSON.stringify(payload));
      await createSolicitud(formData);
      navigate('/mis-tramites');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  if (message && !formulario) {
    return <p className="message">{message}</p>;
  }

  return (
    <section className="card">
      <h2>{formulario?.nombre_formulario}</h2>
      <p>{formulario?.descripcion_formulario}</p>

      <form onSubmit={handleSubmit} className="form">
        {formulario?.campos?.map((field) => (
          <FieldRenderer
            key={field.id_campo}
            field={field}
            value={values[field.id_campo]}
            onChange={handleFieldChange}
          />
        ))}

        {message && <p className="message message--error">{message}</p>}

        <button className="btn" disabled={loading}>
          {loading ? 'Enviando...' : 'Enviar solicitud'}
        </button>
      </form>
    </section>
  );
}
