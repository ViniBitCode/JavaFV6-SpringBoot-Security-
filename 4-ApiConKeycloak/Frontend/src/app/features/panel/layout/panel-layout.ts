import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NoticeService } from '../../../core/services/notice.service';
import { Brand } from '../../../shared/components/brand/brand';
import { ThemeToggle } from '../../../shared/components/theme-toggle/theme-toggle';

/**
 * Marco del área privada: barra superior fija y un `<router-outlet>` para las
 * secciones. Hoy hay una sola sección, pero la estructura ya soporta más.
 */
@Component({
  selector: 'app-panel-layout',
  imports: [RouterOutlet, Brand, ThemeToggle],
  templateUrl: './panel-layout.html',
  styleUrl: './panel-layout.css',
})
export class PanelLayout {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly avisos = inject(NoticeService);

  protected readonly usuario = this.auth.user;

  protected cerrarSesion(): void {
    this.auth.logout();
    this.avisos.show('Cerraste la sesión. ¡Hasta la próxima!', 'success');
    void this.router.navigate(['/login']);
  }
}
