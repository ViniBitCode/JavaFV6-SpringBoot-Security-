import { Component, inject } from '@angular/core';
import { PerfilService } from '../../../core/auth/perfil.service';
import { ROL_ADMIN } from '../../../core/models/perfil.models';
import { Alert } from '../../../shared/components/alert/alert';
import { SiRolDirective } from '../../../shared/directives/si-rol.directive';

/**
 * Inicio del panel. Todo lo que muestra sale de `GET /panel/me`: no hay datos
 * de ejemplo ni nada leído del token.
 */
@Component({
  selector: 'app-panel-home',
  imports: [Alert, SiRolDirective],
  templateUrl: './panel-home.html',
  styleUrl: './panel-home.css',
})
export class PanelHome {
  protected readonly perfil = inject(PerfilService);

  /** Se expone para el template: los roles no se escriben a mano en el HTML. */
  protected readonly ROL_ADMIN = ROL_ADMIN;

  protected reintentar(): void {
    this.perfil.cargar(true);
  }
}
