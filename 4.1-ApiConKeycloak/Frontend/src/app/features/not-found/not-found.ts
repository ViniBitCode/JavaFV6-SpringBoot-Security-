import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { Brand } from '../../shared/components/brand/brand';
import { ThemeToggle } from '../../shared/components/theme-toggle/theme-toggle';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink, Brand, ThemeToggle],
  templateUrl: './not-found.html',
  styleUrl: './not-found.css',
})
export class NotFound {
  private readonly auth = inject(AuthService);

  /** Con sesión el botón lleva al panel; sin sesión, a la bienvenida. */
  protected readonly destino = computed(() => (this.auth.autenticado() ? '/panel' : '/'));

  protected readonly textoDelDestino = computed(() =>
    this.auth.autenticado() ? 'Volver al panel' : 'Ir al inicio',
  );
}
