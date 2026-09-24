import {
  EnvironmentInjector,
  Injectable,
  inject,
  runInInjectionContext,
  signal,
} from '@angular/core';
import Keycloak from 'keycloak-js';
import { withAutoRefreshToken } from 'keycloak-angular';

/** En qué estado está el arranque de Keycloak. */
export type EstadoDeKeycloak = 'inicializando' | 'listo' | 'sin-keycloak';

/**
 * Cuánta inactividad tolera la sesión antes de cerrarse sola.
 *
 * El default de la librería son 5 minutos, que acá resulta agresivo: te echa
 * por dejar la pestaña abierta mientras mirás otra cosa. Mientras haya
 * actividad el token se renueva solo y esto nunca se dispara.
 */
const TIEMPO_DE_INACTIVIDAD_MS = 30 * 60 * 1000;

/**
 * Arranque de Keycloak.
 *
 * Por qué el `init()` se hace acá y no con el `initOptions` de `provideKeycloak`:
 * esa vía hace `keycloak.init(...).catch(console.error)`, así que si el servidor
 * está apagado el error solo va a la consola y la app queda mostrando una
 * pantalla vacía sin explicación. Haciéndolo a mano se puede distinguir
 * "no hay sesión" de "no hay Keycloak" y avisarle al usuario.
 *
 * La contra de no pasar `initOptions` es que la librería tampoco configura las
 * `features`, así que la del refresco automático se configura acá, igual que
 * hace `provideKeycloakInAppInitializer` por dentro: antes del init y dentro de
 * un contexto de inyección.
 */
@Injectable({ providedIn: 'root' })
export class KeycloakBootstrapService {
  private readonly keycloak = inject(Keycloak);
  private readonly injector = inject(EnvironmentInjector);

  private readonly estadoState = signal<EstadoDeKeycloak>('inicializando');
  readonly estado = this.estadoState.asReadonly();

  async iniciar(): Promise<void> {
    // Refresco automático del token mientras haya actividad del usuario.
    runInInjectionContext(this.injector, () => {
      withAutoRefreshToken({
        sessionTimeout: TIEMPO_DE_INACTIVIDAD_MS,
        onInactivityTimeout: 'logout',
      }).configure();
    });

    try {
      await this.keycloak.init({
        // `check-sso` no obliga a loguearse al entrar: pregunta en silencio si
        // ya hay sesión. Si no la hay, la pantalla de bienvenida se ve igual.
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`,
        // Obligatorio por requerimiento; además es el default desde keycloak-js 21.
        pkceMethod: 'S256',
      });
      this.estadoState.set('listo');
    } catch {
      // Servidor caído, realm inexistente o clientId mal escrito.
      this.estadoState.set('sin-keycloak');
    }
  }
}
