import type { AppEnvironment } from './environment.model';

/**
 * Configuración de DESARROLLO: es la que se usa con `npm start`.
 * Angular reemplaza environment.ts por este archivo en la configuración
 * `development` (ver `fileReplacements` en angular.json).
 */
export const environment: AppEnvironment = {
  production: false,
  apiBaseUrl: 'http://localhost:8080',
};
