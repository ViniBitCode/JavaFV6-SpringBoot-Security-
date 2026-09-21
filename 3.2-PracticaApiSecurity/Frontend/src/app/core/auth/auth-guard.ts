import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth-service';

/**
 * Guard de ruta: se ejecuta antes de activar una ruta protegida.
 * Si devuelve true entra; si devuelve un UrlTree, el router redirige ahí.
 */
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.isLoggedIn() ? true : router.createUrlTree(['/auth/login']);
};
