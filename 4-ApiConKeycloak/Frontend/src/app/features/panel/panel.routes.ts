import { Routes } from '@angular/router';
import { adminGuard } from '../../core/guards/admin.guard';

/**
 * Rutas del panel. El layout queda como ruta padre para que las próximas
 * secciones se agreguen como hijas y hereden la barra superior.
 *
 * /panel ya está detrás de `authGuard` (ver app.routes.ts), así que acá solo
 * se agregan restricciones por rol.
 */
export const panelRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/panel-layout').then((m) => m.PanelLayout),
    children: [
      {
        path: '',
        title: 'Panel · Retroauth',
        loadComponent: () => import('./home/panel-home').then((m) => m.PanelHome),
      },
      {
        // El guard va en el padre: cubre el listado y el alta de una sola vez.
        path: 'usuarios',
        canActivate: [adminGuard],
        children: [
          {
            path: '',
            title: 'Usuarios · Retroauth',
            loadComponent: () => import('./users/user-list').then((m) => m.UserList),
          },
          {
            path: 'nuevo',
            title: 'Nuevo usuario · Retroauth',
            loadComponent: () => import('./users/user-create').then((m) => m.UserCreate),
          },
        ],
      },
      // Próximas secciones: { path: 'perfil', loadComponent: ... }
    ],
  },
];
