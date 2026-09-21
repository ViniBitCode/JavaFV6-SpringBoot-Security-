/**
 * Configuración de DESARROLLO (la que usa `ng serve`).
 *
 * apiUrl = '/api' (ruta relativa, sin host) a propósito:
 * el dev server de Angular intercepta todo lo que empiece con /api y se lo
 * reenvía al backend (ver proxy.conf.js). Como para el navegador la petición
 * sale al mismo origen (localhost:4300), NO hay CORS ni preflight.
 */
export const environment = {
  production: false,
  apiUrl: '/api',
};
