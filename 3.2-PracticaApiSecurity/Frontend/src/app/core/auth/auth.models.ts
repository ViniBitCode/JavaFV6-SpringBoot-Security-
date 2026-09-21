/** Lo que el usuario escribe en el formulario de login. */
export interface Credentials {
  username: string;
  password: string;
  remember: boolean;
}

/**
 * Lo que el formulario de registro le manda al backend.
 * Coincide con el record RegisterRequestDTO: { username, password }.
 * El rol no se manda: lo decide el backend (siempre USER).
 */
export interface NewUser {
  username: string;
  password: string;
}

/**
 * Lo que devuelve POST /auth/login.
 * Coincide con el record SessionInfoDTO: { username, role }.
 */
export interface SessionInfo {
  username: string;
  role: string;
}

/**
 * Sesión abierta. Es lo único que guardamos en el navegador.
 *
 * `basic` es el header Authorization ya armado ("Basic dXNlcjpwYXNz").
 * Cuando el backend emita JWT, este campo pasa a ser el token y el resto
 * del código no cambia: el interceptor lo sigue mandando igual.
 */
export interface Session {
  username: string;
  role: string;
  basic: string;
}

/** Error ya traducido a un mensaje que se puede mostrar en pantalla. */
export class AuthError extends Error {
  constructor(
    override readonly message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

/**
 * Saca el texto que mandó el backend en una respuesta de error.
 * Tus endpoints contestan texto plano ("No podés borrar tu propio usuario"),
 * pero Angular espera JSON, así que a veces lo deja guardado en .text.
 */
export function detalleDelError(error: { error?: unknown; message: string }): string {
  if (typeof error.error === 'string') {
    return error.error;
  }
  const envuelto = error.error as { text?: string } | null;
  return envuelto?.text ?? error.message;
}
