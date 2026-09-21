/**
 * Configuración de PRODUCCIÓN (la que usa `ng build`).
 * En producción no hay proxy de Angular, así que acá va la URL completa
 * del backend y el servidor de Spring tiene que habilitar CORS.
 */
export const environment = {
  production: true,
  apiUrl: 'http://localhost:8080',
};
