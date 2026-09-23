import { AuthApiResponse, Session } from '../models/auth.models';

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
 *                        si la API no lo devuelve.
 * @throws AuthContractError si falta el token, el usuario o el rol.
 */
export function mapAuthResponse(
  raw: AuthApiResponse | null | undefined,
  usernameEnviado: string,
): Session {
  if (!raw || typeof raw !== 'object') {
    throw new AuthContractError('el cuerpo está vacío o no es un objeto');
  }

  const token = primerTextoNoVacio(raw.token);
  if (!token) {
    throw new AuthContractError('no vino el token');
  }

  const username = primerTextoNoVacio(raw.username, usernameEnviado);
  if (!username) {
    throw new AuthContractError('no vino el nombre de usuario');
  }

  // El rol se exige en vez de completarse con un valor por defecto: de él
  // depende qué ve el usuario, y adivinarlo sería mostrar de menos o de más.
  const role = primerTextoNoVacio(raw.role);
  if (!role) {
    throw new AuthContractError('no vino el rol del usuario');
  }

  return { token, user: { username, role } };
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
