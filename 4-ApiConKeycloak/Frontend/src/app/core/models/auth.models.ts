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
 * Respuesta esperada de `POST /auth/login`.
 *
 * Todo es opcional menos el token porque el contrato todavía no está cerrado:
 * el backend puede devolver el token como `token`, `accessToken` o `jwt`, y los
 * datos del usuario planos o anidados en `user`. El mapper acepta todas esas
 * variantes; acá solo se documentan.
 */
export interface AuthApiResponse {
  token?: string;
  accessToken?: string;
  jwt?: string;
  tokenType?: string;
  expiresIn?: number;

  /** Datos del usuario anidados (forma habitual en Spring Security). */
  user?: AuthApiUser;

  /** Datos del usuario planos, al mismo nivel que el token. */
  id?: string | number;
  username?: string;
  email?: string;
  roles?: readonly string[];
}

/** Usuario tal como lo devuelve la API. */
export interface AuthApiUser {
  id?: string | number;
  username?: string;
  email?: string;
  roles?: readonly string[];
}

/**
 * Respuesta esperada de `POST /auth/register`.
 * Hoy alcanza con saber si salió bien (2xx); si el backend empieza a devolver
 * el usuario creado, agregar los campos acá.
 */
export interface RegisterApiResponse {
  id?: string | number;
  username?: string;
  email?: string;
  message?: string;
}

/* ============================================================================
   3. Modelo interno de la app
   ========================================================================== */

/** Usuario autenticado, ya normalizado. */
export interface AuthUser {
  readonly id: string | null;
  readonly username: string;
  readonly email: string | null;
  readonly roles: readonly string[];
}

/** Sesión activa: token + usuario. Es lo que se persiste y expone por signals. */
export interface Session {
  readonly token: string;
  readonly user: AuthUser;
}
