import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../../core/auth/auth.service';
import { PRODUCT_NAME, PRODUCT_TAGLINE } from '../../../core/config/product';

/**
 * Pantalla pública. El login y el registro los muestra Keycloak: acá solo
 * hay una bienvenida con los botones que redirigen al servidor de identidad.
 * Si Keycloak no está disponible se muestra el aviso y se deshabilitan los botones.
 */
@Component({
  selector: 'app-welcome',
  imports: [RouterLink],
  templateUrl: './welcome.html',
  styleUrl: './welcome.css',
})
export class Welcome {
  private readonly auth = inject(AuthService);

  protected readonly productName = PRODUCT_NAME;
  protected readonly tagline = PRODUCT_TAGLINE;
  protected readonly isAuthenticated = this.auth.isAuthenticated;
  protected readonly notice = this.auth.notice;
  protected readonly unavailable = computed(() => this.auth.status() === 'unavailable');

  /** Qué botón está esperando la redirección, para mostrar el estado de carga. */
  protected readonly pending = signal<'login' | 'register' | null>(null);

  protected async login(): Promise<void> {
    await this.redirect('login', () => this.auth.login());
  }

  protected async register(): Promise<void> {
    await this.redirect('register', () => this.auth.register());
  }

  private async redirect(action: 'login' | 'register', run: () => Promise<void>): Promise<void> {
    if (this.pending() || this.unavailable()) {
      return;
    }
    this.pending.set(action);
    try {
      await run();
    } finally {
      // Si la redirección ocurrió esta línea no llega a ejecutarse; si falló,
      // se vuelve a habilitar el botón.
      this.pending.set(null);
    }
  }
}
