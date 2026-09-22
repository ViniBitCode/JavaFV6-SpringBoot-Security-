import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
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

  /** Con sesión el botón lleva al panel; sin sesión, al login. */
  protected readonly destino = this.auth.isAuthenticated() ? '/panel' : '/login';
  protected readonly textoDelDestino = this.auth.isAuthenticated()
    ? 'Volver al panel'
    : 'Ir al inicio de sesión';
}
