import { AuthApiResponse, AuthUser, Session } from '../models/auth.models';

/**
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║  ÚNICO PUNTO DONDE SE LEE LA RESPUESTA DE LOGIN DEL BACKEND.             ║
 * ║                                                                          ║
 * ║  Si el contrato de `POST /auth/login` cambia, se cambia SOLO este         ║
 * ║  archivo (y, si hace falta, `AuthApiResponse` en core/models). Ni el      ║
 * ║  AuthService, ni los componentes, ni el interceptor conocen la forma      ║
 * ║  del JSON: todos trabajan con `Session`.                                 ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 */

/** Error de contrato: la API respondió 2xx pero el JSON no sirve. */
export class AuthContractError extends Error {
  constructor(motivo: string) {
    super(`Respuesta de autenticación inesperada: ${motivo}`);
    this.name = 'AuthContractError';
  }
}

/**
 * Convierte la respuesta cruda del login en la `Session` que usa la app.
 *
 * @param raw             Cuerpo JSON devuelto por la API.
 * @param usernameEnviado Usuario que se mandó en el login. Se usa como respaldo
 *                        si la API no devuelve datos del usuario (pasa cuando
 *                        solo responde el token).
 * @throws AuthContractError si no se puede extraer un token.
 */
export function mapAuthResponse(
  raw: AuthApiResponse | null | undefined,
  usernameEnviado: string,
): Session {
  if (!raw || typeof raw !== 'object') {
    throw new AuthContractError('el cuerpo está vacío o no es un objeto');
  }

  // --- Token: se aceptan los tres nombres más habituales ------------------
  const token = primerTextoNoVacio(raw.token, raw.accessToken, raw.jwt);
  if (!token) {
    throw new AuthContractError('no vino ningún token (token / accessToken / jwt)');
  }

  // --- Usuario: puede venir anidado en `user` o plano en la raíz ----------
  const datosUsuario = raw.user ?? raw;

  const user: AuthUser = {
    id: datosUsuario.id !== undefined && datosUsuario.id !== null ? String(datosUsuario.id) : null,
    username: primerTextoNoVacio(datosUsuario.username, usernameEnviado) ?? usernameEnviado,
    email: primerTextoNoVacio(datosUsuario.email) ?? null,
    roles: Array.isArray(datosUsuario.roles) ? [...datosUsuario.roles] : [],
  };

  return { token, user };
}

/** Devuelve el primer valor que sea un string con contenido real. */
function primerTextoNoVacio(...valores: readonly unknown[]): string | null {
  for (const valor of valores) {
    if (typeof valor === 'string' && valor.trim().length > 0) {
      return valor.trim();
    }
  }
  return null;
}
