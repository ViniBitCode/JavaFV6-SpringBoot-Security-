import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ROL_ADMIN } from '../../../core/models/auth.models';
import { AuthService } from '../../../core/services/auth.service';
import { NoticeService } from '../../../core/services/notice.service';
import { Brand } from '../../../shared/components/brand/brand';
import { ThemeToggle } from '../../../shared/components/theme-toggle/theme-toggle';

/**
 * Marco del área privada: barra superior fija, navegación y un
 * `<router-outlet>` para las secciones.
 */
@Component({
  selector: 'app-panel-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, Brand, ThemeToggle],
  templateUrl: './panel-layout.html',
  styleUrl: './panel-layout.css',
})
export class PanelLayout {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly avisos = inject(NoticeService);

  protected readonly usuario = this.auth.user;

  /**
   * Muestra u oculta la sección de administración.
   *
   * Ojo: esconder el enlace no protege nada por sí solo. Lo que impide entrar
   * es `adminGuard` en la ruta, y lo que protege los datos tiene que ser el
   * backend. Esto es para no ofrecer una puerta que no se puede abrir.
   */
  protected readonly esAdmin = computed(() => this.auth.tieneRol(ROL_ADMIN));

  protected cerrarSesion(): void {
    this.auth.logout();
    this.avisos.show('Cerraste la sesión. ¡Hasta la próxima!', 'success');
    void this.router.navigate(['/login']);
  }
}
