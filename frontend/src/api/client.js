const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('token');
  const headers = options.headers ? { ...options.headers } : {};

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = headers['Content-Type'] || 'application/json';
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || 'Ocurrió un error en la solicitud.');
  }

  return data;
}
