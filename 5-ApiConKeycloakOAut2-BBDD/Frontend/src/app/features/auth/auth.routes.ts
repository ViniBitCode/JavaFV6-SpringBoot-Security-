import { Routes } from '@angular/router';

import { PRODUCT_NAME } from '../../core/config/product';
import { AuthLayout } from './layout/auth-layout';

/**
 * Ruta pública: la bienvenida con los botones que redirigen a Keycloak.
 * Las pantallas de login y registro ya no se rutean: las muestra Keycloak.
 * Su maquetado quedó en `src/app/prototypes/keycloak-theme` como referencia
 * visual para el futuro tema.
 */
export const AUTH_ROUTES: Routes = [
  {
    path: '',
    component: AuthLayout,
    children: [
      {
        path: '',
        title: `Bienvenida · ${PRODUCT_NAME}`,
        loadComponent: () => import('./welcome/welcome').then((m) => m.Welcome),
      },
    ],
  },
];
