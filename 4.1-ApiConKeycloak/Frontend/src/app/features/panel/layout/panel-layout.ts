import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { PerfilService } from '../../../core/auth/perfil.service';
import { NoticeService } from '../../../core/services/notice.service';
import { Alert } from '../../../shared/components/alert/alert';
import { Brand } from '../../../shared/components/brand/brand';
import { ThemeToggle } from '../../../shared/components/theme-toggle/theme-toggle';

/**
 * Marco del área privada: barra superior fija y un `<router-outlet>` para las
 * secciones.
 *
 * Es el punto donde se pide el perfil: al entrar a cualquier ruta de /panel
 * este componente se monta una sola vez, así que `GET /panel/me` se dispara
 * una vez por sesión y no en cada navegación interna.
 */
@Component({
  selector: 'app-panel-layout',
  imports: [RouterOutlet, Brand, ThemeToggle, Alert],
  templateUrl: './panel-layout.html',
  styleUrl: './panel-layout.css',
})
export class PanelLayout {
  private readonly auth = inject(AuthService);
  private readonly avisos = inject(NoticeService);

  protected readonly perfil = inject(PerfilService);
  protected readonly aviso = this.avisos.actual;

  /** Igual que en la bienvenida: al salir, el navegador deja la página. */
  protected readonly saliendo = signal(false);

  constructor() {
    this.perfil.cargar();
  }

  protected cerrarSesion(): void {
    this.saliendo.set(true);
    // Se limpia antes de irse para no dejar el perfil del usuario anterior si
    // el navegador restaura la página desde la caché al volver atrás.
    this.perfil.limpiar();
    this.avisos.clear();
    void this.auth.logout();
  }

  protected descartarAviso(): void {
    this.avisos.clear();
  }
}
