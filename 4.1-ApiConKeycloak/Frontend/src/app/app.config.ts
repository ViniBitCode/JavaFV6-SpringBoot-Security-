import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import {
  AutoRefreshTokenService,
  INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
  IncludeBearerTokenCondition,
  UserActivityService,
  createInterceptorCondition,
  includeBearerTokenInterceptor,
  provideKeycloak,
} from 'keycloak-angular';
import { environment } from '../environments/environment';
import { routes } from './app.routes';
import { KeycloakBootstrapService } from './core/auth/keycloak-bootstrap.service';
import { patronDeLaApi } from './core/config/api.config';
import { apiErrorInterceptor } from './core/interceptors/api-error.interceptor';
import { ThemeService } from './core/services/theme.service';

/**
 * El token se adjunta SOLO a los pedidos que van a nuestra API.
 *
 * La condición es explícita a propósito: si el patrón fuera abierto, el front
 * le mandaría el token a Keycloak y a cualquier tercero al que le pida algo.
 */
const condicionDeLaApi = createInterceptorCondition<IncludeBearerTokenCondition>({
  urlPattern: patronDeLaApi(),
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),

    // Sin `initOptions`: el init lo hace KeycloakBootstrapService para poder
    // distinguir "no hay sesión" de "Keycloak no responde".
    provideKeycloak({
      config: {
        url: environment.keycloak.url,
        realm: environment.keycloak.realm,
        clientId: environment.keycloak.clientId,
      },
      providers: [AutoRefreshTokenService, UserActivityService],
    }),

    { provide: INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG, useValue: [condicionDeLaApi] },

    // Aplica el tema guardado antes de pintar la primera pantalla.
    provideAppInitializer(() => {
      inject(ThemeService);
    }),

    // Tiene que resolverse antes del primer render: los guards preguntan si hay
    // sesión, y sin el init de Keycloak la respuesta sería siempre que no.
    provideAppInitializer(() => inject(KeycloakBootstrapService).iniciar()),

    provideRouter(
      routes,
      // Al cambiar de pantalla se vuelve arriba, como espera el usuario.
      withInMemoryScrolling({ scrollPositionRestoration: 'top' }),
    ),

    provideHttpClient(withInterceptors([includeBearerTokenInterceptor, apiErrorInterceptor])),
  ],
};
