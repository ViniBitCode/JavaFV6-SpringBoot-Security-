/**
 * Lectura del payload de un JWT.
 *
 * ⚠️  DECODIFICAR NO ES VALIDAR. Acá no se verifica ninguna firma: cualquiera
 * puede editar un token a mano y este archivo se lo va a creer. La validación
 * real la hace el backend (`JwtService.validateToken`) en cada pedido.
 *
 * Esto sirve para una sola cosa: saber si el token que tenemos guardado ya
 * venció, y no mostrar un panel que en realidad no puede pedir nada.
 */

/** Payload que nos interesa. El backend además manda iss, jti, nbf e iat. */
interface JwtPayload {
  /** Vencimiento, en SEGUNDOS desde epoch (así lo define el estándar). */
  exp?: number;
  sub?: string;
}

/** Momento en que vence el token, o `null` si no se pudo leer. */
export function expiracionDelToken(token: string): Date | null {
  const exp = leerPayload(token)?.exp;

  if (typeof exp !== 'number' || !Number.isFinite(exp)) {
    return null;
  }
  return new Date(exp * 1000);
}

/**
 * `true` si el token ya venció.
 *
 * @param margenSegundos Colchón para no mandar un token que va a vencer en el
 *                       viaje de ida, y para tolerar relojes desfasados.
 *
 * Si el token no se puede leer devuelve `true`: ante la duda, sesión caída.
 */
export function tokenExpirado(token: string, margenSegundos = 30): boolean {
  const vence = expiracionDelToken(token);

  if (vence === null) {
    return true;
  }
  return vence.getTime() - margenSegundos * 1000 <= Date.now();
}

/** Decodifica la parte del medio del JWT (header.PAYLOAD.firma). */
function leerPayload(token: string): JwtPayload | null {
  const partes = token.split('.');

  if (partes.length !== 3) {
    return null;
  }

  try {
    return JSON.parse(decodificarBase64Url(partes[1])) as JwtPayload;
  } catch {
    // Token cortado, mal copiado o que no es un JWT.
    return null;
  }
}

/**
 * base64url → texto. No alcanza con `atob()`: el JWT usa el alfabeto url-safe
 * (`-` y `_`), puede venir sin padding, y el payload es UTF-8.
 */
function decodificarBase64Url(valor: string): string {
  const base64 = valor.replace(/-/g, '+').replace(/_/g, '/');
  const conPadding = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');

  const binario = atob(conPadding);
  const bytes = Uint8Array.from(binario, (caracter) => caracter.charCodeAt(0));

  return new TextDecoder().decode(bytes);
}
