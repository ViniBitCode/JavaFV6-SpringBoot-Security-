import { HttpErrorResponse } from '@angular/common/http';

/**
 * Clasificación de los errores de la API para que los componentes muestren
 * el mensaje adecuado sin mirar códigos HTTP:
 * - `unauthorized`: 401, la sesión no es válida (el interceptor ya fuerza un nuevo login).
 * - `forbidden`: 403, la sesión es válida pero no alcanza para esa operación.
 * - `network`: la API no responde (apagada, CORS, sin red).
 * - `server`: cualquier otra respuesta de error.
 */
export type ApiErrorKind = 'unauthorized' | 'forbidden' | 'network' | 'server';

export class ApiError extends Error {
  constructor(
    readonly kind: ApiErrorKind,
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }

  static from(response: HttpErrorResponse): ApiError {
    switch (response.status) {
      case 0:
        return new ApiError('network', 0, 'La API no está disponible en este momento. Intentá más tarde.');
      case 401:
        return new ApiError('unauthorized', 401, 'Tu sesión no es válida. Redirigiendo al inicio de sesión…');
      case 403:
        return new ApiError('forbidden', 403, 'No tenés permisos suficientes para realizar esta acción.');
      default:
        return new ApiError('server', response.status, `La API respondió con un error (${response.status}).`);
    }
  }

  static is(error: unknown): error is ApiError {
    return error instanceof ApiError;
  }
}
