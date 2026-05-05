import { apiFetch } from './client';

export function registerCitizen(payload) {
  return apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function loginRequest(payload) {
  return apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}
