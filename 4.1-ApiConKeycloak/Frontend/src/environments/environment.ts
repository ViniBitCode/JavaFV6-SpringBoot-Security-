import type { AppEnvironment } from './environment.model';

/**
 * Configuración de PRODUCCIÓN.
 *
 * TODO: reemplazar los valores por los reales antes de publicar. El cliente de
 *       Keycloak de producción tiene que tener registradas las Valid redirect
 *       URIs y Web origins del dominio final, no las de localhost.
 */
export const environment: AppEnvironment = {
  production: true,
  apiBaseUrl: 'https://CAMBIAR-POR-LA-URL-DE-LA-API',
  keycloak: {
    url: 'https://CAMBIAR-POR-LA-URL-DE-KEYCLOAK',
    realm: 'primer-api-keycloak',
    clientId: 'angular-app',
  },
};
