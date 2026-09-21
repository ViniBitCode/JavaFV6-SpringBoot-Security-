import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth-service';
import { AuthError } from '../../core/auth/auth.models';
import { UserInfo, UsersService } from '../../core/users/users-service';
import { ThemeStore } from '../../core/theme/theme-store';

/**
 * Pantalla protegida: la lista de usuarios que devuelve GET /panel.
 * Si el que entró es ADMIN, cada fila muestra además la X para borrar.
 */
@Component({
  selector: 'app-panel',
  imports: [],
  templateUrl: './panel.html',
  styleUrl: './panel.scss',
})
export class Panel {
  private readonly users = inject(UsersService);
  private readonly router = inject(Router);
  protected readonly auth = inject(AuthService);
  protected readonly themeStore = inject(ThemeStore);

  protected readonly lista = signal<UserInfo[]>([]);
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);
  /** true cuando el error fue un 401: ahí conviene ofrecer volver al login. */
  protected readonly sesionCaida = signal(false);

  /** Usuario cuya X se tocó y está esperando confirmación. */
  protected readonly porConfirmar = signal<string | null>(null);
  /** Usuario que se está borrando en este momento. */
  protected readonly borrando = signal<string | null>(null);
  /** Mensaje verde después de un borrado exitoso. */
  protected readonly aviso = signal<string | null>(null);

  constructor() {
    this.cargar();
  }

  protected cargar(): void {
    this.loading.set(true);
    this.error.set(null);
    this.sesionCaida.set(false);
    this.porConfirmar.set(null);

    this.users.list().subscribe({
      next: (usuarios) => {
        this.loading.set(false);
        this.lista.set(usuarios);
      },
      error: (error: AuthError) => {
        this.loading.set(false);
        this.error.set(error.message);
        this.sesionCaida.set(error.status === 401);
      },
    });
  }

  /** Primer click en la X: no borra, solo pide confirmación en esa fila. */
  protected pedirConfirmacion(username: string): void {
    this.aviso.set(null);
    this.error.set(null);
    this.porConfirmar.set(username);
  }

  protected cancelar(): void {
    this.porConfirmar.set(null);
  }

  protected borrar(username: string): void {
    this.borrando.set(username);
    this.error.set(null);

    this.users.remove(username).subscribe({
      next: () => {
        this.borrando.set(null);
        this.porConfirmar.set(null);
        this.aviso.set(`Se eliminó el usuario "${username}".`);
        // Vuelvo a pedir la lista para que quede igual a lo que hay en la base.
        this.cargar();
      },
      error: (error: AuthError) => {
        this.borrando.set(null);
        this.porConfirmar.set(null);
        this.error.set(error.message);
      },
    });
  }

  protected logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/auth/login');
  }
}
