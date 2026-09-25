import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

import { AuthService } from '../auth/auth.service';
import { ApiError } from './api-error';
import { isApiUrl } from './api-url';

/**
 * Manejo de errores de la API (solo para peticiones a `environment.apiUrl`):
 * - 401 → la sesión no es válida: se fuerza un nuevo login en Keycloak.
 * - 403 → se propaga como `forbidden` para avisar de permisos insuficientes, sin cerrar sesión.
 * - status 0 → la API no responde (`network`).
 * Todos los errores se relanzan como `ApiError` para que los componentes
 * elijan el mensaje según `kind` en lugar de inspeccionar códigos HTTP.
 */
export const apiErrorInterceptor: HttpInterceptorFn = (req, next) => {
  if (!isApiUrl(req.url)) {
    return next(req);
  }

  const auth = inject(AuthService);

  return next(req).pipe(
    catchError((error: unknown) => {
      if (!(error instanceof HttpErrorResponse)) {
        return throwError(() => error);
      }

      const apiError = ApiError.from(error);
      if (apiError.kind === 'unauthorized') {
        void auth.forceLogin('La API rechazó la sesión actual.');
      }
      return throwError(() => apiError);
    }),
  );
};
