import { apiFetch } from './client';

export function getTramites() {
  return apiFetch('/tramites');
}

export function getFormularioByTramite(id) {
  return apiFetch(`/formularios/tramite/${id}`);
}

export function createSolicitud(formData) {
  return apiFetch('/solicitudes', {
    method: 'POST',
    body: formData
  });
}

export function getMisTramites() {
  return apiFetch('/solicitudes/mis-tramites');
}

export function getSolicitudesFuncionario() {
  return apiFetch('/funcionario/solicitudes');
}

export function aprobarSolicitud(id, comentario) {
  return apiFetch(`/funcionario/solicitudes/${id}/aprobar`, {
    method: 'PUT',
    body: JSON.stringify({ comentario })
  });
}

export function rechazarSolicitud(id, comentario) {
  return apiFetch(`/funcionario/solicitudes/${id}/rechazar`, {
    method: 'PUT',
    body: JSON.stringify({ comentario })
  });
}

export function observarSolicitud(id, comentario) {
  return apiFetch(`/funcionario/solicitudes/${id}/observar`, {
    method: 'PUT',
    body: JSON.stringify({ comentario })
  });
}
