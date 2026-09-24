import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';

/**
 * Rutas de la app. Todo se carga en diferido (`loadComponent` / `loadChildren`)
 * para que el bundle inicial sea solo lo necesario para ver la bienvenida.
 *
 * Ya no hay /login ni /register: esas pantallas las sirve Keycloak.
 */
export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    title: 'Retroauth',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/welcome/welcome').then((m) => m.Welcome),
  },
  {
    path: 'panel',
    canActivate: [authGuard],
    loadChildren: () => import('./features/panel/panel.routes').then((m) => m.panelRoutes),
  },
  {
    path: '**',
    title: 'Página no encontrada · Retroauth',
    loadComponent: () => import('./features/not-found/not-found').then((m) => m.NotFound),
  },
];
