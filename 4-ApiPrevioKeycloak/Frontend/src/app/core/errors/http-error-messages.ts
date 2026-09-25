import { HttpErrorResponse } from '@angular/common/http';
import { AuthContractError } from '../services/auth-response.mapper';

/**
 * Traducción de errores HTTP a mensajes en español para el usuario final.
 *
 * Todos los mensajes de error de la app salen de acá: así no hay dos pantallas
 * diciendo cosas distintas para el mismo 409.
 */

/** Pantalla desde la que se produjo el error: cambia el texto de 401 y 409. */
export type ErrorContext = 'login' | 'register' | 'generic';

const MENSAJE_GENERICO = 'Ocurrió un error inesperado. Probá de nuevo en unos segundos.';

const SIN_CONEXION =
  'No pudimos conectarnos con el servidor. Revisá tu conexión y tené en cuenta ' +
  'que la API puede estar iniciándose: esperá unos segundos y volvé a intentar.';

export function toUserMessage(error: unknown, context: ErrorContext = 'generic'): string {
  // La API respondió bien pero el JSON no era el esperado.
  if (error instanceof AuthContractError) {
    return 'El servidor respondió de una forma que no esperábamos. Avisale al equipo de backend.';
  }

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

    case 401:
      return context === 'login'
        ? 'Usuario o contraseña incorrectos.'
        : 'Tu sesión expiró. Volvé a iniciar sesión.';

    case 403:
      return 'No tenés permisos para realizar esta acción.';

    case 404:
      return 'No encontramos el recurso solicitado. Verificá la URL de la API.';

    case 409:
      return context === 'register'
        ? 'El usuario o el email ya están registrados. Probá con otros datos.'
        : 'El recurso ya existe.';

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
