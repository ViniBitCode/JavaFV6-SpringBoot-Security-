import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth-service';

/**
 * Interceptor: una función por la que pasa TODA petición de HttpClient antes
 * de salir. Acá le pegamos el header Authorization para no tener que
 * acordarnos de hacerlo en cada servicio.
 *
 * Se registra en app.config.ts con provideHttpClient(withInterceptors([...])).
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const header = auth.authHeader();

  // Si ya trae Authorization (el caso del login, que manda el suyo) no lo piso.
  // Si no hay sesión, la petición sale tal cual y el backend responderá 401.
  if (!header || req.headers.has('Authorization')) {
    return next(req);
  }

  // Los HttpRequest son inmutables: no se modifican, se clonan con el cambio.
  return next(req.clone({ setHeaders: { Authorization: header } }));
};
