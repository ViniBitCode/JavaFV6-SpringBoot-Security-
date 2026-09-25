/** Usuario autenticado tal como lo ve la aplicación (datos básicos del token de Keycloak). */
export interface AuthUser {
  /** `sub` del token: identificador estable del usuario en Keycloak. */
  id: string;
  username: string;
  email: string;
  /** Nombre para mostrar; si no existe se usa el username. */
  displayName?: string;
}

/**
 * Estado del servidor de identidad tras el arranque de la app.
 * - `ok`: Keycloak respondió y el adaptador se inicializó (haya sesión o no).
 * - `unavailable`: Keycloak no responde (apagado, URL o realm incorrectos).
 * - `error`: Keycloak responde pero la inicialización o el retorno del login fallaron.
 */
export type AuthStatus = 'ok' | 'unavailable' | 'error';
