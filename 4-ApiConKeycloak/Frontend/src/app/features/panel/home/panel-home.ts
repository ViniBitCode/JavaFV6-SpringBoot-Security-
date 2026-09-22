import { Component, computed, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

interface DatoDeResumen {
  readonly etiqueta: string;
  readonly valor: string;
  readonly detalle: string;
}

/**
 * Inicio del panel. El resumen se arma con los datos reales de la sesión: no
 * hay valores de ejemplo, así que lo que se ve es lo que devolvió la API.
 */
@Component({
  selector: 'app-panel-home',
  templateUrl: './panel-home.html',
  styleUrl: './panel-home.css',
})
export class PanelHome {
  private readonly auth = inject(AuthService);

  protected readonly usuario = this.auth.user;

  protected readonly resumen = computed<readonly DatoDeResumen[]>(() => {
    const usuario = this.auth.user();

    return [
      {
        etiqueta: 'Sesión',
        valor: usuario ? 'Activa' : 'Sin sesión',
        detalle: 'El token se envía solo en los pedidos a la API.',
      },
      {
        etiqueta: 'Usuario',
        valor: usuario?.username ?? '—',
        detalle: 'Nombre con el que iniciaste sesión.',
      },
      {
        etiqueta: 'Email',
        valor: usuario?.email ?? 'No informado',
        detalle: 'Aparece si la API lo devuelve en el login.',
      },
      {
        etiqueta: 'Roles',
        valor: usuario && usuario.roles.length > 0 ? usuario.roles.join(', ') : 'No informados',
        detalle: 'Servirán para mostrar u ocultar secciones.',
      },
    ];
  });
}
