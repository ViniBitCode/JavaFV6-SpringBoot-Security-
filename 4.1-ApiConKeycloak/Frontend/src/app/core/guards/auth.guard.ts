import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../auth/auth.service';

/**
 * Protege las rutas privadas.
 *
 * Sin sesión no manda a una pantalla propia: redirige a la de Keycloak,
 * pidiéndole que al terminar devuelva al usuario a la URL que quiso abrir.
 *
 * Devuelve `false` porque la navegación se cancela: la que sigue es una
 * redirección del navegador entero, no del router de Angular.
 */
export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);

  if (auth.autenticado()) {
    return true;
  }

  void auth.login(window.location.origin + state.url);
  return false;
};
