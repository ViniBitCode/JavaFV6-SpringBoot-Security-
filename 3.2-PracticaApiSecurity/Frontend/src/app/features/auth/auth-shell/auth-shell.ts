import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ThemeStore } from '../../../core/theme/theme-store';

/**
 * Marco de la pantalla de acceso: ventana retro con panel de marca a la
 * izquierda y las pestañas Login / Registro a la derecha.
 */
@Component({
  selector: 'auth-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './auth-shell.html',
  styleUrl: './auth-shell.scss',
})
export class AuthShell {
  protected readonly themeStore = inject(ThemeStore);
}
