import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { patronDeLaApi } from '../config/api.config';
import { NoticeService } from '../services/notice.service';

/**
 * Traduce los errores de la API en acciones de sesión.
 *
 * Solo mira los pedidos a NUESTRA API: un error de Keycloak o de un tercero no
 * tiene por qué cerrar la sesión del usuario.
 *
 * El error se vuelve a lanzar siempre: acá se decide qué pasa con la sesión,
 * pero cada pantalla sigue siendo la que muestra su propio estado de error.
 */
export const apiErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const avisos = inject(NoticeService);
  const esDeLaApi = patronDeLaApi().test(req.url);

  return next(req).pipe(
    catchError((error: unknown) => {
      if (!esDeLaApi || !(error instanceof HttpErrorResponse)) {
        return throwError(() => error);
      }

      switch (error.status) {
        case 401:
          // El token no sirve (venció, se revocó, cambió el realm). No alcanza
          // con avisar: hay que volver a autenticarse contra Keycloak.
          void auth.login();
          break;

        case 403:
          // Autenticado pero sin permisos. La sesión es válida, así que NO se
          // cierra: cerrarla haría pensar que el problema es la identidad.
          avisos.show('No tenés permisos para acceder a eso. Tu sesión sigue abierta.', 'warning');
          break;

        case 0:
          avisos.show(
            'No pudimos conectarnos con la API. Revisá que esté levantada en el puerto 8080.',
            'danger',
          );
          break;
      }

      return throwError(() => error);
    }),
  );
};
