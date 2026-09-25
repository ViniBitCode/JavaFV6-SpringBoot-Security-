import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import localeEs from '@angular/common/locales/es';
import { ApplicationConfig, LOCALE_ID, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG, includeBearerTokenInterceptor } from 'keycloak-angular';

import { routes } from './app.routes';
import { apiErrorInterceptor } from './core/api/api-error.interceptor';
import { API_URL_PATTERN } from './core/api/api-url';
import { provideAuth } from './core/auth/auth.providers';

registerLocaleData(localeEs);

/**
 * Configuración de la aplicación.
 *
 * - Keycloak: `provideAuth()` registra el adaptador y la inicialización de la
 *   sesión (ver `core/auth/auth.providers.ts`).
 * - API: `HttpClient` con dos interceptores, en este orden:
 *   1. `includeBearerTokenInterceptor` (keycloak-angular) agrega
 *      `Authorization: Bearer <token>` SOLO a las peticiones cuya URL coincide
 *      con `environment.apiUrl`, refrescando el token antes si hace falta.
 *   2. `apiErrorInterceptor` traduce 401 / 403 / red a `ApiError` y fuerza un
 *      nuevo login ante un 401.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    { provide: LOCALE_ID, useValue: 'es' },
    provideAuth(),
    provideHttpClient(withInterceptors([includeBearerTokenInterceptor, apiErrorInterceptor])),
    {
      provide: INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
      useValue: [{ urlPattern: API_URL_PATTERN }],
    },
  ],
};
