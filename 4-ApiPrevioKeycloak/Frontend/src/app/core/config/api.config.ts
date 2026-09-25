import { environment } from '../../../environments/environment';

/**
 * URL base de la API, sin barra final, para no armar rutas con `//`.
 * Es el único lugar de la app que lee `environment.apiBaseUrl`.
 */
export function apiBaseUrl(): string {
  return environment.apiBaseUrl.replace(/\/+$/, '');
}

/** `true` si la URL pertenece a nuestra API (lo usa el interceptor del token). */
export function esUrlDeLaApi(url: string): boolean {
  const base = apiBaseUrl();
  // Las rutas relativas siempre son propias; las absolutas deben empezar con la base.
  return !/^https?:\/\//i.test(url) || url.startsWith(base);
}
