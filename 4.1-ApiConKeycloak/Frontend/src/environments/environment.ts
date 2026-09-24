import type { AppEnvironment } from './environment.model';

export const environment: AppEnvironment = {
  production: true,
  apiBaseUrl: 'https://javafv6-springboot-security-1.onrender.com',
  keycloak: {
    url: 'https://lemur-10.cloud-iam.com/auth/',
    realm: 'primer-api-keycloak-hosteada',
    clientId: 'angular-app',
  },
};
