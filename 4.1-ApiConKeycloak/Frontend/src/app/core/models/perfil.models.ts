/**
 * Perfil del usuario, tal como lo devuelve `GET /panel/me` (`PerfilDTO`).
 *
 * Este es el ÚNICO origen del rol en el front. A propósito no se leen los
 * roles del token: el backend resuelve la jerarquía (`JERARQUIA_ROLES` en
 * `PanelController`) y devuelve el rol principal ya masticado, así que el
 * cliente no necesita conocer los roles técnicos del realm de Keycloak.
 */
export interface PerfilApiResponse {
  username?: string;
  email?: string;
  role?: string;
}

/** Perfil ya normalizado, que es lo que consume la app. */
export interface Perfil {
  readonly username: string;
  readonly email: string | null;
  /** 'ADMIN' | 'USER'. */
  readonly role: string;
}

/**
 * Roles que devuelve el backend. Están como constantes para que nadie escriba
 * 'ADMIN' suelto en un template.
 */
export const ROL_ADMIN = 'ADMIN';
export const ROL_USER = 'USER';
