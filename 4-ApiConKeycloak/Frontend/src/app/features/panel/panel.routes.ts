import { Routes } from '@angular/router';

/**
 * Rutas del panel. El layout queda como ruta padre para que las próximas
 * secciones se agreguen como hijas y hereden la barra superior.
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
      // Próximas secciones: { path: 'perfil', loadComponent: ... }
    ],
  },
];
