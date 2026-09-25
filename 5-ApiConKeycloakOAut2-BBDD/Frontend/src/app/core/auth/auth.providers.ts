import { EnvironmentProviders, inject, makeEnvironmentProviders, provideAppInitializer } from '@angular/core';
import { provideKeycloak } from 'keycloak-angular';

import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

/**
 * Registra Keycloak y la inicialización de la sesión en el arranque de la app.
 *
 * `provideKeycloak` se usa SIN `initOptions` a propósito: si se le pasan, la
 * librería llama a `keycloak.init()` por su cuenta y, ante un error, solo lo
 * escribe en consola. Al hacer el `init` desde `AuthService.initialize()`
 * podemos sondear el servidor antes y exponer el estado (`status`) para
 * mostrar un mensaje claro cuando Keycloak no está disponible.
 */
export function provideAuth(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideKeycloak({
      config: {
        url: environment.keycloak.url,
        realm: environment.keycloak.realm,
        clientId: environment.keycloak.clientId,
      },
    }),
    provideAppInitializer(() => inject(AuthService).initialize()),
  ]);
}
