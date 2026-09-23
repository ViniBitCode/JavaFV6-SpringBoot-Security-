import { Component, computed, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

interface DatoDeResumen {
  readonly etiqueta: string;
  readonly valor: string;
  readonly detalle: string;
}

/** Fecha y hora cortas, en formato local. */
const FORMATO_FECHA = new Intl.DateTimeFormat('es-AR', {
  dateStyle: 'short',
  timeStyle: 'short',
});

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
    const vence = this.auth.expiracion();

    return [
      {
        etiqueta: 'Sesión',
        valor: usuario ? 'Activa' : 'Sin sesión',
        detalle: 'El token viaja en el header Authorization de cada pedido.',
      },
      {
        etiqueta: 'Usuario',
        valor: usuario?.username ?? '—',
        detalle: 'Nombre con el que iniciaste sesión.',
      },
      {
        etiqueta: 'Rol',
        valor: usuario?.role ?? 'No informado',
        detalle: 'Servirá para mostrar u ocultar secciones.',
      },
      {
        etiqueta: 'El token vence',
        valor: vence ? FORMATO_FECHA.format(vence) : '—',
        detalle: 'Sale del claim exp. Después de esa hora hay que volver a entrar.',
      },
    ];
  });
}
