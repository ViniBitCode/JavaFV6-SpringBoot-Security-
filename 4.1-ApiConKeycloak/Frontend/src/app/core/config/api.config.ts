import { environment } from '../../../environments/environment';

/**
 * URL base de la API, sin barra final, para no armar rutas con `//`.
 * Es el único lugar de la app que lee `environment.apiBaseUrl`.
 */
export function apiBaseUrl(): string {
  return environment.apiBaseUrl.replace(/\/+$/, '');
}

/**
 * Expresión que matchea SOLO las URLs de nuestra API.
 *
 * La usa el interceptor de keycloak-angular para decidir a qué pedidos les
 * pone el token. Se arma desde el environment y se escapan los caracteres
 * especiales: si no, los puntos del host matchearían cualquier carácter y
 * `http://localhost:8080` también daría por bueno a `http://localhostX8080`.
 */
export function patronDeLaApi(): RegExp {
  const base = apiBaseUrl().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // El `(/|$)` del final evita que entre un dominio que empiece igual
  // (por ejemplo `http://localhost:8080.malicioso.com`).
  return new RegExp(`^${base}(/|$)`, 'i');
}
