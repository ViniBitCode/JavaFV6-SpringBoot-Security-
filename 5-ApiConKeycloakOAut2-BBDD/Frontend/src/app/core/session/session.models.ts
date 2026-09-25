/**
 * Rol de la cuenta según la API (`GET /panel/me`). Es la única fuente de
 * roles del front: no se leen del token de Keycloak.
 */
export type Rol = 'ADMIN' | 'USER' | 'SIN_ROL';

export const ROLES: readonly Rol[] = ['ADMIN', 'USER', 'SIN_ROL'];

/** Respuesta de `GET /panel/me`. */
export interface SessionUser {
  username: string;
  rol: Rol;
}
