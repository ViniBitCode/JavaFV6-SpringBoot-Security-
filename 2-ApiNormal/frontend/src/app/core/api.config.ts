/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │  CONFIGURACIÓN DE ENDPOINTS                                              │
 * │                                                                          │
 * │  Este es el ÚNICO archivo que tenés que tocar para conectar el front     │
 * │  con tu backend de Spring Boot. Completá `baseUrl` y cada endpoint.      │
 * │                                                                          │
 * │  Ejemplo:                                                                │
 * │    baseUrl: 'http://localhost:8080'                                      │
 * │    endpoints: {                                                          │
 * │      listarPersonas: '/api/personas',      // GET  -> Persona[]          │
 * │      crearPersona:   '/api/personas',      // POST <- PersonaRequest     │
 * │    }                                                                     │
 * │                                                                          │
 * │  Mientras estén vacíos, la pestaña te avisa que falta configurarlos      │
 * │  en vez de tirar un error de red.                                        │
 * └──────────────────────────────────────────────────────────────────────────┘
 */
export interface ApiConfig {
  /** Host del backend. Sin barra final. Ej: 'http://localhost:8080' */
  baseUrl: string;
  endpoints: {
    /** GET — devuelve el listado de personas. */
    listarPersonas: string;
    /** POST — recibe una persona y la guarda. */
    crearPersona: string;
  };
}

export const API_CONFIG: ApiConfig = {
  baseUrl: '',
  endpoints: {
    listarPersonas: '',
    crearPersona: '',
  },
};

export type NombreEndpoint = keyof ApiConfig['endpoints'];

/** `true` si ya le pusiste una URL a ese endpoint. */
export function endpointConfigurado(endpoint: NombreEndpoint): boolean {
  return API_CONFIG.endpoints[endpoint].trim().length > 0;
}

/** Une `baseUrl` con el path del endpoint, sin barras duplicadas ni faltantes. */
export function urlDe(endpoint: NombreEndpoint): string {
  const base = API_CONFIG.baseUrl.trim().replace(/\/+$/, '');
  const path = API_CONFIG.endpoints[endpoint].trim();

  if (!path) {
    throw new Error(
      `Falta configurar el endpoint "${endpoint}" en src/app/core/api.config.ts`,
    );
  }
  if (/^https?:\/\//i.test(path)) {
    return path;
  }
  return `${base}${path.startsWith('/') ? '' : '/'}${path}`;
}
