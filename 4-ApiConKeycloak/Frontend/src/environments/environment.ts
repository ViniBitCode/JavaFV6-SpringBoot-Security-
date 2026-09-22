import type { AppEnvironment } from './environment.model';

/**
 * Configuración de PRODUCCIÓN.
 *
 * TODO: reemplazar `apiBaseUrl` por la URL pública de la API de Spring Boot
 *       antes de publicar (por ejemplo 'https://api.mi-dominio.com').
 *       El valor de abajo es un placeholder y debe cambiarse.
 */
export const environment: AppEnvironment = {
  production: true,
  apiBaseUrl: 'https://CAMBIAR-POR-LA-URL-DE-LA-API',
};
