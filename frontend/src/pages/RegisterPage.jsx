import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerCitizen } from '../api/auth';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    rut: '',
    correo: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const result = await registerCitizen(form);
      login(result);
      navigate('/mis-tramites');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="card card--narrow">
      <h2>Registro ciudadano</h2>

      <form onSubmit={handleSubmit} className="form">
        <div className="grid-2">
          <div className="form-group">
            <label>Nombre</label>
            <input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required />
          </div>

          <div className="form-group">
            <label>Apellido</label>
            <input value={form.apellido} onChange={(e) => setForm({ ...form, apellido: e.target.value })} required />
          </div>
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label>RUT</label>
            <input value={form.rut} onChange={(e) => setForm({ ...form, rut: e.target.value })} required />
          </div>

          <div className="form-group">
            <label>Correo</label>
            <input type="email" value={form.correo} onChange={(e) => setForm({ ...form, correo: e.target.value })} required />
          </div>
        </div>

        <div className="form-group">
          <label>Contraseña</label>
          <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        </div>

        {message && <p className="message message--error">{message}</p>}

        <button className="btn" disabled={loading}>
          {loading ? 'Registrando...' : 'Crear cuenta'}
        </button>
      </form>
    </section>
  );
}
