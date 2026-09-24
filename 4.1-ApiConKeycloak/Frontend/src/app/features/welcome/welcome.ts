import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
import { AuthShell } from '../../shared/layout/auth-shell/auth-shell';

/**
 * Pantalla pública de bienvenida.
 *
 * Reemplaza a las viejas pantallas de login y registro: ya no hay formularios
 * propios porque las credenciales las pide Keycloak. Los dos botones hacen lo
 * mismo (salir hacia Keycloak), cambiando en qué pestaña cae el usuario.
 */
@Component({
  selector: 'app-welcome',
  imports: [AuthShell],
  templateUrl: './welcome.html',
  styleUrl: './welcome.css',
})
export class Welcome {
  private readonly auth = inject(AuthService);

  /**
   * Se activa al apretar un botón y ya no se apaga: lo que sigue es que el
   * navegador abandone la página, así que no hay a dónde "volver".
   */
  protected readonly saliendo = signal(false);

  protected iniciarSesion(): void {
    this.saliendo.set(true);
    void this.auth.login(window.location.origin + '/panel');
  }

  protected registrarse(): void {
    this.saliendo.set(true);
    void this.auth.register(window.location.origin + '/panel');
  }
}
