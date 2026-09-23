/**
 * Modelos de autenticación.
 *
 * Se separan a propósito dos mundos:
 *
 *  - Lo que viaja por HTTP (`*Request` / `AuthApiResponse`): es el contrato del
 *    backend y puede cambiar.
 *  - Lo que usa la app (`AuthUser`, `Session`): es estable y es lo único que
 *    tocan componentes, guards e interceptor.
 *
 * El puente entre ambos está en un solo archivo: `core/services/auth-response.mapper.ts`.
 */

/* ============================================================================
   1. Cuerpos que la app ENVÍA
   ========================================================================== */

/** Cuerpo de `POST /auth/login`. */
export interface LoginRequest {
  username: string;
  password: string;
}

/** Cuerpo de `POST /auth/register`. */
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

/* ============================================================================
   2. Respuesta que la app RECIBE al iniciar sesión
   ========================================================================== */

/**
 * Respuesta de `POST /auth/login`, espejo del `SessionInfoDTO` del backend.
 *
 * El `token` es un JWT firmado con HS256 que hay que mandar en cada pedido a
 * un endpoint privado, como `Authorization: Bearer <token>`.
 *
 * Los campos son opcionales porque esto es JSON de la red: lo que garantiza
 * que estén es la validación del mapper, no el tipo.
 */
export interface AuthApiResponse {
  username?: string;
  role?: string;
  token?: string;
}

/**
 * Respuesta de `POST /auth/register` (`RegisterResponseDTO` del backend).
 * Hoy alcanza con saber si salió bien (2xx).
 */
export interface RegisterApiResponse {
  username?: string;
}

/* ============================================================================
   3. Modelo interno de la app
   ========================================================================== */

/**
 * Roles que maneja el backend (tabla `role`, cargada por `data.sql`).
 * Están acá como constantes para que nadie escriba 'ADMIN' suelto por ahí.
 */
export const ROL_ADMIN = 'ADMIN';
export const ROL_USER = 'USER';

/** Usuario autenticado, ya normalizado. */
export interface AuthUser {
  readonly username: string;
  /**
   * Rol único, en singular y sin el prefijo `ROLE_`: 'ADMIN' | 'USER'.
   * Es singular porque el dominio lo es: `UserEntity` tiene un `@ManyToOne`
   * con `RoleEntity`. Los permisos cuelgan del rol, del lado del backend.
   */
  readonly role: string;
}

/** Sesión activa: el JWT + el usuario. Es lo que se persiste y se expone. */
export interface Session {
  readonly token: string;
  readonly user: AuthUser;
}
