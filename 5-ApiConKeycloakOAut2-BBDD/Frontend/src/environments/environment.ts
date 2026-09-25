/**
 * Configuración de entorno (producción).
 *
 * TODO: antes de publicar, reemplazar `keycloak.url` y `apiUrl` por las URLs
 *       públicas de Keycloak y de la API. Los valores de abajo son los de
 *       desarrollo local para que `ng build` funcione sin cambios.
 */
export const environment = {
  production: true,

  /**
   * Servidor de identidad (Keycloak, OAuth2 / OIDC con PKCE).
   * `url` va SIN `/realms/...`: keycloak-js arma esa parte a partir de `realm`.
   * `clientId` es un cliente público (sin secret) con Authorization Code + PKCE S256.
   */
  keycloak: {
    url: 'http://localhost:8180',
    realm: 'segunda-api-keycloak-fuchibol',
    clientId: 'angular-app',
  },

  /** API REST en Spring Boot, sin barra final. Solo a estas URLs se les agrega el token. */
  apiUrl: 'http://localhost:8080',
} as const;
