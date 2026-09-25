import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import Keycloak from 'keycloak-js';

import { AuthService } from './auth.service';

/**
 * Protege las rutas privadas. Sin sesión, redirige al login de Keycloak y,
 * al volver, entra directamente a la URL que se quiso visitar.
 * Si Keycloak no está disponible o falló, manda a la bienvenida, donde se
 * muestra el aviso correspondiente en lugar de redirigir en bucle.
 */
export const authGuard: CanActivateFn = async (_route, state) => {
  const auth = inject(AuthService);
  const keycloak = inject(Keycloak);
  const router = inject(Router);

  if (auth.isAuthenticated()) {
    return true;
  }

  if (auth.status() !== 'ok') {
    return router.createUrlTree(['/']);
  }

  await keycloak.login({ redirectUri: `${window.location.origin}${state.url}` });
  return false;
};
