import { Routes } from '@angular/router';
import { AuthShell } from './auth-shell/auth-shell';

export const authRoutes: Routes = [
  {
    path: '',
    component: AuthShell,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'login' },
      {
        path: 'login',
        title: 'Iniciar sesión · sec-admin',
        loadComponent: () => import('./pages/login/login').then((m) => m.Login),
      },
      {
        path: 'register',
        title: 'Crear cuenta · sec-admin',
        loadComponent: () => import('./pages/register/register').then((m) => m.Register),
      },
    ],
  },
];
