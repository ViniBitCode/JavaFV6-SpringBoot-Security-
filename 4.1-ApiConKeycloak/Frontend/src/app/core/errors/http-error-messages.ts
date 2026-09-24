import { HttpErrorResponse } from '@angular/common/http';

/**
 * Traducción de errores HTTP a mensajes en español para el usuario final.
 *
 * Todos los mensajes de error de la app salen de acá: así no hay dos pantallas
 * diciendo cosas distintas para el mismo 403.
 */

const MENSAJE_GENERICO = 'Ocurrió un error inesperado. Probá de nuevo en unos segundos.';

const SIN_CONEXION =
  'No pudimos conectarnos con la API. Revisá que esté levantada en el puerto 8080 ' +
  'y volvé a intentar.';

export function toUserMessage(error: unknown): string {
  if (!(error instanceof HttpErrorResponse)) {
    return MENSAJE_GENERICO;
  }

  switch (error.status) {
    // status 0: el pedido nunca llegó (API apagada, CORS, DNS, red caída).
    case 0:
      return SIN_CONEXION;

    case 400:
      // En 400 manda el backend: mostramos su mensaje de validación.
      return mensajeDeLaApi(error) ?? 'Revisá los datos ingresados: el servidor los rechazó.';

    // El interceptor ya disparó un login nuevo; el texto es por si algo se ve mientras tanto.
    case 401:
      return 'Tu sesión no es válida o expiró. Te estamos redirigiendo para que entres de nuevo.';

    case 403:
      return 'No tenés permisos para acceder a esto. Si creés que es un error, pedí que revisen tu rol.';

    case 404:
      return 'No encontramos el recurso solicitado. Verificá la URL de la API.';

    case 422:
      return mensajeDeLaApi(error) ?? 'Algunos datos no son válidos.';

    case 429:
      return 'Demasiados intentos. Esperá un momento antes de volver a probar.';

    case 503:
    case 504:
      return 'El servidor no está disponible en este momento. Intentá de nuevo en unos minutos.';

    default:
      if (error.status >= 500) {
        return 'Error interno del servidor. No es tu culpa: intentá de nuevo más tarde.';
      }
      return mensajeDeLaApi(error) ?? MENSAJE_GENERICO;
  }
}

/**
 * Intenta sacar un mensaje legible del cuerpo del error.
 *
 * Cubre las formas típicas de Spring Boot:
 *   "texto plano"
 *   { message: '...' } | { error: '...' } | { detail: '...' }
 *   { errors: [{ field, defaultMessage }] }   (Bean Validation)
 *   { errors: { campo: 'mensaje' } }
 */
function mensajeDeLaApi(error: HttpErrorResponse): string | null {
  const cuerpo: unknown = error.error;

  if (typeof cuerpo === 'string') {
    return textoUtil(cuerpo);
  }

  if (!cuerpo || typeof cuerpo !== 'object') {
    return null;
  }

  const registro = cuerpo as Record<string, unknown>;

  const directo = primerTexto(registro['message'], registro['error'], registro['detail']);
  if (directo) {
    return directo;
  }

  const errores = registro['errors'];

  if (Array.isArray(errores)) {
    const lista = errores
      .map((item) => {
        if (typeof item === 'string') {
          return textoUtil(item);
        }
        if (item && typeof item === 'object') {
          const fila = item as Record<string, unknown>;
          return primerTexto(fila['defaultMessage'], fila['message'], fila['error']);
        }
        return null;
      })
      .filter((texto): texto is string => texto !== null);

    return lista.length > 0 ? lista.join(' ') : null;
  }

  if (errores && typeof errores === 'object') {
    const lista = Object.values(errores as Record<string, unknown>)
      .map((valor) => (typeof valor === 'string' ? textoUtil(valor) : null))
      .filter((texto): texto is string => texto !== null);

    return lista.length > 0 ? lista.join(' ') : null;
  }

  return null;
}

function primerTexto(...valores: readonly unknown[]): string | null {
  for (const valor of valores) {
    if (typeof valor === 'string') {
      const texto = textoUtil(valor);
      if (texto) {
        return texto;
      }
    }
  }
  return null;
}

/** Descarta strings vacíos y cuerpos HTML (páginas de error del servidor). */
function textoUtil(valor: string): string | null {
  const texto = valor.trim();
  if (texto.length === 0 || texto.startsWith('<')) {
    return null;
  }
  return texto;
}
