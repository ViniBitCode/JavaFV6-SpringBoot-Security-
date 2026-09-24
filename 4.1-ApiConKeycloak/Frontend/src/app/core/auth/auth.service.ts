import { Injectable, computed, inject } from '@angular/core';
import Keycloak from 'keycloak-js';
import { KEYCLOAK_EVENT_SIGNAL, KeycloakEventType } from 'keycloak-angular';

/**
 * Sesión del usuario, delegada en Keycloak.
 *
 * La app ya no guarda credenciales ni tokens propios: el token lo administra
 * keycloak-js (lo renueva y lo expone), y el interceptor lo adjunta. Este
 * servicio es solo la cara amable de esas operaciones.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly keycloak = inject(Keycloak);

  /**
   * Signal de eventos de keycloak-js (login, logout, refresh, expiración).
   * Se lee para que `autenticado` se recalcule solo cuando algo cambia, en vez
   * de quedar congelado en el valor que había al arrancar.
   */
  private readonly eventos = inject(KEYCLOAK_EVENT_SIGNAL);

  readonly autenticado = computed(() => {
    // Leer el signal es lo que ata este computed al ciclo de vida de la sesión.
    const evento = this.eventos();
    const cerroSesion =
      evento.type === KeycloakEventType.AuthLogout ||
      evento.type === KeycloakEventType.AuthRefreshError;

    return !cerroSesion && this.keycloak.authenticated === true;
  });

  /** Manda a la pantalla de login de Keycloak. */
  async login(volverA: string = window.location.href): Promise<void> {
    await this.keycloak.login({ redirectUri: volverA });
  }

  /**
   * Manda directo a la pantalla de REGISTRO de Keycloak.
   * Es la misma pantalla de login pero en la pestaña de alta; de ahí salen
   * también la recuperación de contraseña y los logins con Google y GitHub.
   */
  async register(volverA: string = window.location.origin + '/panel'): Promise<void> {
    await this.keycloak.register({ redirectUri: volverA });
  }

  /**
   * Cierra la sesión EN KEYCLOAK, no solo en el navegador.
   *
   * Borrar el token local dejaría viva la sesión del servidor: al volver a
   * entrar, el `check-sso` la encontraría y entraría de nuevo sin pedir nada.
   */
  async logout(): Promise<void> {
    await this.keycloak.logout({ redirectUri: window.location.origin });
  }
}
