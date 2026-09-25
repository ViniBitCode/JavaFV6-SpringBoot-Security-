import { Routes } from '@angular/router';

import { authGuard } from './core/auth/auth.guard';
import { PRODUCT_NAME } from './core/config/product';

/**
 * Rutas raíz. Cada funcionalidad se carga de forma diferida (lazy loading).
 * `/` es la bienvenida pública; `/panel` exige sesión (sin ella, `authGuard`
 * redirige al login de Keycloak).
 */
export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: 'panel',
    canActivate: [authGuard],
    loadChildren: () => import('./features/panel/panel.routes').then((m) => m.PANEL_ROUTES),
  },
  {
    path: 'estilos',
    title: `Guía de estilos · ${PRODUCT_NAME}`,
    loadComponent: () => import('./features/styleguide/styleguide').then((m) => m.Styleguide),
  },
  {
    path: '**',
    title: `Página no encontrada · ${PRODUCT_NAME}`,
    loadComponent: () => import('./features/not-found/not-found').then((m) => m.NotFound),
  },
];
