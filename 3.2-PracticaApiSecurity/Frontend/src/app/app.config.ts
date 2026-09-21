import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { authInterceptor } from './core/auth/auth-interceptor';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    // Habilita HttpClient en toda la app y le engancha el interceptor que
    // agrega el header Authorization. withFetch() usa la API fetch del
    // navegador en lugar del viejo XMLHttpRequest.
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
  ],
};
