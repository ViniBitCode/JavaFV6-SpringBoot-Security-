/** Datos del cliente de Keycloak. Los tres salen de la consola de administración. */
export interface KeycloakEnvironment {
  /** Raíz del servidor, sin barra final. Ej: 'http://localhost:8180'. */
  readonly url: string;
  /** Nombre del realm. Ej: 'primer-api-keycloak'. */
  readonly realm: string;
  /** Client ID del cliente PÚBLICO, sin secret. Ej: 'angular-app'. */
  readonly clientId: string;
}

/** Forma que deben respetar todos los archivos de environment. */
export interface AppEnvironment {
  readonly production: boolean;
  /** URL base de la API REST, sin barra final. */
  readonly apiBaseUrl: string;
  readonly keycloak: KeycloakEnvironment;
}
