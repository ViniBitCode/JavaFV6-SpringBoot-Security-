import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { KEYCLOAK_EVENT_SIGNAL, KeycloakEventType, typeEventArgs } from 'keycloak-angular';
import Keycloak, { KeycloakError } from 'keycloak-js';

import { environment } from '../../../environments/environment';
import { AuthStatus, AuthUser } from './auth.models';

/**
 * =============================================================================
 * SERVICIO DE AUTENTICACIÓN — KEYCLOAK (OAuth2 / OIDC con PKCE S256)
 * =============================================================================
 *
 * Reemplaza al servicio simulado de la etapa de diseño manteniendo el mismo
 * contrato público: `user`, `isAuthenticated`, `login()`, `register()` y
 * `logout()`. Las pantallas de login y registro ahora las muestra Keycloak:
 * `login()` y `register()` redirigen al servidor de identidad y el retorno
 * a la app lo resuelve keycloak-js al arrancar (`initialize()`).
 *
 * Responsabilidades:
 * - Inicializar keycloak-js con `check-sso` (recupera la sesión sin redirigir
 *   si ya existe una en Keycloak) y PKCE S256.
 * - Detectar que Keycloak está caído antes de inicializar, para mostrar un
 *   mensaje claro en lugar de una pantalla en blanco (`status`).
 * - Refrescar el token antes de que expire (`scheduleRefresh`).
 * - Forzar un nuevo login cuando la sesión deja de ser válida (`forceLogin`),
 *   por ejemplo ante un 401 de la API.
 */

/** Tiempo máximo de espera al sondear Keycloak en el arranque. */
const KEYCLOAK_PROBE_TIMEOUT_MS = 5000;

/** Cuánto antes de la expiración del access token se pide uno nuevo. */
const REFRESH_MARGIN_S = 30;

/**
 * Ventana para no encadenar logins forzados: si la API devuelve 401 apenas
 * volvimos de un login forzado, algo está mal configurado (issuer, audience…)
 * y redirigir de nuevo generaría un bucle infinito.
 */
const FORCED_LOGIN_LOOP_WINDOW_MS = 60_000;
const FORCED_LOGIN_STORAGE_KEY = 'auth.forcedLoginAt';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly keycloak = inject(Keycloak);
  private readonly events = inject(KEYCLOAK_EVENT_SIGNAL);
  private readonly router = inject(Router);

  private readonly currentUser = signal<AuthUser | null>(null);
  private readonly currentStatus = signal<AuthStatus>('ok');
  private readonly currentNotice = signal<string | null>(null);
  private refreshTimer: ReturnType<typeof setTimeout> | undefined;

  /** Usuario actual (datos del token), o `null` si no hay sesión. */
  readonly user = this.currentUser.asReadonly();
  readonly isAuthenticated = computed(() => this.currentUser() !== null);

  /** Estado del servidor de identidad. Con `unavailable` no se puede iniciar sesión. */
  readonly status = this.currentStatus.asReadonly();

  /** Aviso para el usuario sobre la sesión (Keycloak caído, sesión rechazada…). */
  readonly notice = this.currentNotice.asReadonly();

  constructor() {
    effect(() => {
      const event = this.events();
      this.onKeycloakEvent(event.type, event.args);
    });
  }

  /**
   * Inicializa keycloak-js. Se ejecuta una sola vez en el arranque de la app
   * (ver `provideAuth()` en `auth.providers.ts`), antes de que exista el router.
   */
  async initialize(): Promise<void> {
    if (!(await this.probeKeycloak())) {
      this.currentStatus.set('unavailable');
      this.currentNotice.set(
        'No se pudo conectar con el servidor de identidad. Verificá que Keycloak esté levantado e intentá de nuevo.',
      );
      return;
    }

    try {
      await this.keycloak.init({
        // Recupera una sesión existente sin redirigir; si no la hay, queda anónimo.
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`,
        pkceMethod: 'S256',
        // El iframe de estado de sesión depende de cookies de terceros, que los
        // navegadores modernos bloquean. La validez de la sesión se comprueba al
        // refrescar el token.
        checkLoginIframe: false,
      });
      this.currentStatus.set('ok');
      this.syncUser();
    } catch (error) {
      console.error('No se pudo inicializar Keycloak', error);
      this.currentStatus.set('error');
      this.currentNotice.set('No se pudo completar la autenticación. Intentá iniciar sesión de nuevo.');
    }
  }

  /** Redirige a la pantalla de login de Keycloak; al volver, la app entra a `/panel`. */
  async login(): Promise<void> {
    if (this.status() === 'unavailable') {
      return;
    }
    await this.keycloak.login({ redirectUri: this.appUrl('/panel') });
  }

  /** Redirige directamente a la pantalla de registro de Keycloak. */
  async register(): Promise<void> {
    if (this.status() === 'unavailable') {
      return;
    }
    await this.keycloak.register({ redirectUri: this.appUrl('/panel') });
  }

  /** Cierra la sesión en Keycloak (no solo el token local) y vuelve a la bienvenida. */
  async logout(): Promise<void> {
    this.clearRefreshTimer();
    if (!this.keycloak.authenticated) {
      this.currentUser.set(null);
      await this.router.navigate(['/']);
      return;
    }
    await this.keycloak.logout({ redirectUri: this.appUrl('/') });
  }

  /**
   * La sesión dejó de ser válida (401 de la API, refresco fallido): descarta el
   * token local y vuelve a pasar por Keycloak, regresando a la URL actual.
   * Si esto acaba de ocurrir, corta el bucle y avisa en la bienvenida.
   */
  async forceLogin(reason: string): Promise<void> {
    this.clearRefreshTimer();

    if (this.recentlyForcedLogin()) {
      this.keycloak.clearToken();
      this.currentUser.set(null);
      this.currentNotice.set(
        `${reason} La API volvió a rechazar la sesión recién iniciada; revisá la configuración del realm y del cliente.`,
      );
      await this.router.navigate(['/']);
      return;
    }

    sessionStorage.setItem(FORCED_LOGIN_STORAGE_KEY, String(Date.now()));
    await this.keycloak.login({ redirectUri: window.location.href });
  }

  /** Borra el aviso una vez mostrado. */
  clearNotice(): void {
    this.currentNotice.set(null);
  }

  // ---------------------------------------------------------------------------

  private onKeycloakEvent(type: KeycloakEventType, args: unknown): void {
    switch (type) {
      case KeycloakEventType.Ready:
      case KeycloakEventType.AuthSuccess:
      case KeycloakEventType.AuthRefreshSuccess:
        this.syncUser();
        break;
      case KeycloakEventType.AuthLogout:
        this.clearRefreshTimer();
        this.currentUser.set(null);
        break;
      case KeycloakEventType.TokenExpired:
        // Red de seguridad: el timer debería haber refrescado antes de llegar acá.
        void this.refreshToken();
        break;
      case KeycloakEventType.AuthRefreshError:
        void this.forceLogin('Tu sesión expiró.');
        break;
      case KeycloakEventType.AuthError: {
        const error = typeEventArgs<KeycloakError>(args);
        const detail = error?.error_description ? `: ${error.error_description}` : '.';
        this.currentNotice.set(`No se pudo completar la autenticación${detail}`);
        break;
      }
      default:
        break;
    }
  }

  /** Copia los datos básicos del token a la signal `user` y programa el refresco. */
  private syncUser(): void {
    const token = this.keycloak.tokenParsed;
    if (!this.keycloak.authenticated || !token) {
      this.currentUser.set(null);
      return;
    }

    this.currentUser.set({
      id: token.sub ?? '',
      username: token['preferred_username'] ?? '',
      email: token['email'] ?? '',
      displayName: token['name'] || undefined,
    });
    this.scheduleRefresh();
  }

  /** Programa un refresco `REFRESH_MARGIN_S` segundos antes de que expire el access token. */
  private scheduleRefresh(): void {
    this.clearRefreshTimer();

    const exp = this.keycloak.tokenParsed?.exp;
    if (!exp) {
      return;
    }

    const skew = this.keycloak.timeSkew ?? 0;
    const expiresInMs = (exp - Date.now() / 1000 + skew) * 1000;
    const delay = Math.max(expiresInMs - REFRESH_MARGIN_S * 1000, 0);
    this.refreshTimer = setTimeout(() => void this.refreshToken(), delay);
  }

  private async refreshToken(): Promise<void> {
    try {
      // Refresca solo si el token vence dentro del margen; el éxito dispara
      // `AuthRefreshSuccess`, que vuelve a llamar a `scheduleRefresh()`.
      const refreshed = await this.keycloak.updateToken(REFRESH_MARGIN_S + 5);
      if (!refreshed) {
        this.scheduleRefresh();
      }
    } catch {
      // `AuthRefreshError` ya fuerza el login.
    }
  }

  private clearRefreshTimer(): void {
    if (this.refreshTimer !== undefined) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = undefined;
    }
  }

  private recentlyForcedLogin(): boolean {
    const at = Number(sessionStorage.getItem(FORCED_LOGIN_STORAGE_KEY));
    return Number.isFinite(at) && at > 0 && Date.now() - at < FORCED_LOGIN_LOOP_WINDOW_MS;
  }

  /**
   * Comprueba que el realm responda antes de inicializar el adaptador. keycloak-js
   * no hace ninguna llamada al construirse, así que sin este sondeo un Keycloak
   * caído recién se notaría al intentar iniciar sesión.
   */
  private async probeKeycloak(): Promise<boolean> {
    const { url, realm } = environment.keycloak;
    const discoveryUrl = `${url}/realms/${realm}/.well-known/openid-configuration`;
    try {
      const response = await fetch(discoveryUrl, { signal: AbortSignal.timeout(KEYCLOAK_PROBE_TIMEOUT_MS) });
      if (!response.ok) {
        console.error(`Keycloak respondió ${response.status} en ${discoveryUrl}. ¿El realm existe?`);
      }
      return response.ok;
    } catch (error) {
      console.error(`Keycloak no responde en ${discoveryUrl}`, error);
      return false;
    }
  }

  private appUrl(path: string): string {
    return `${window.location.origin}${path}`;
  }
}
