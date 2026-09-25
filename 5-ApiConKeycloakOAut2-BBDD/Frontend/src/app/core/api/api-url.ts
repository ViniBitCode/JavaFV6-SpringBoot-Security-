import { environment } from '../../../environments/environment';

/** URL base de la API, sin barra final. */
export const API_URL = environment.apiUrl.replace(/\/+$/, '');

/**
 * Patrón que identifica las peticiones dirigidas a la API. Solo a esas se les
 * agrega el token y se les aplica el manejo de errores de sesión.
 */
export const API_URL_PATTERN = new RegExp(`^${escapeRegExp(API_URL)}(/.*)?$`, 'i');

export function isApiUrl(url: string): boolean {
  return API_URL_PATTERN.test(url);
}

/** Arma la URL de un endpoint de la API a partir de su ruta relativa. */
export function apiUrl(path: string): string {
  return `${API_URL}/${path.replace(/^\/+/, '')}`;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
