import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ROL_ADMIN } from '../models/auth.models';
import { AuthService } from '../services/auth.service';

/**
 * Deja pasar solo al rol ADMIN.
 *
 * Va siempre DEBAJO de `authGuard` (que protege todo /panel), así que acá ya
 * hay sesión: el único caso que resuelve es "entró, pero no es admin", y a ese
 * se lo manda al inicio del panel en vez de a /login, que sería confuso porque
 * la sesión está perfecta.
 *
 * Esto es del lado del cliente: oculta y bloquea la pantalla, no los datos.
 * Quien proteja de verdad `GET /users` tiene que ser el backend.
 */
export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.tieneRol(ROL_ADMIN) ? true : router.createUrlTree(['/panel']);
};
