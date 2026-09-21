import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth-guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'auth' },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.authRoutes),
  },
  {
    // Zona protegida: el guard corre antes de cargar el componente, así que
    // sin sesión ni siquiera se descarga el chunk.
    path: 'panel',
    title: 'Panel · sec-admin',
    canActivate: [authGuard],
    loadComponent: () => import('./features/panel/panel').then((m) => m.Panel),
  },
  { path: '**', redirectTo: 'auth' },
];
