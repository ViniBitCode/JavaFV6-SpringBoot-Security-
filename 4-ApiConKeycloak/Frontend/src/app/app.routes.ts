import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';

/**
 * Rutas de la app. Todo se carga en diferido (`loadComponent` / `loadChildren`)
 * para que el bundle inicial sea solo lo necesario para ver el login.
 */
export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },
  {
    path: 'login',
    title: 'Iniciar sesión · Retroauth',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
  },
  {
    path: 'register',
    title: 'Crear cuenta · Retroauth',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/register/register').then((m) => m.Register),
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
