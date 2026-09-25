import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/** Nombre del query param con el que /login recuerda a dónde volver. */
export const RETURN_URL_PARAM = 'volverA';

/**
 * Protege las rutas privadas. Sin sesión, manda a /login y guarda la URL
 * pedida para poder volver después de autenticarse.
 */
export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/login'], {
    queryParams: { [RETURN_URL_PARAM]: state.url },
  });
};
