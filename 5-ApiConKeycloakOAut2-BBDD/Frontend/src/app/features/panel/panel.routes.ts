import { Routes } from '@angular/router';

import { PRODUCT_NAME } from '../../core/config/product';
import { AppShell } from '../../shared/layout/app-shell/app-shell';

/**
 * Rutas privadas, todas dentro de `AppShell` (barra superior + navegación).
 * La protección (`authGuard`) se aplica en `app.routes.ts` sobre el segmento
 * `panel`, así cubre a todas las rutas hijas.
 */
export const PANEL_ROUTES: Routes = [
  {
    path: '',
    component: AppShell,
    children: [
      {
        path: '',
        title: `Inicio · ${PRODUCT_NAME}`,
        loadComponent: () => import('./panel').then((m) => m.Panel),
      },
      {
        path: 'torneos',
        title: `Torneos · ${PRODUCT_NAME}`,
        loadComponent: () => import('../torneos/torneos').then((m) => m.Torneos),
      },
    ],
  },
];
