import { Component, input } from '@angular/core';
import { Brand } from '../../components/brand/brand';
import { ThemeToggle } from '../../components/theme-toggle/theme-toggle';

/**
 * Marco compartido por /login y /register: barra superior, tarjeta centrada y
 * pie. El formulario entra por `<ng-content>` y los enlaces del pie por el
 * slot `[data-footer]`.
 */
@Component({
  selector: 'app-auth-shell',
  imports: [Brand, ThemeToggle],
  templateUrl: './auth-shell.html',
  styleUrl: './auth-shell.css',
})
export class AuthShell {
  /** Texto chico en mayúsculas arriba del título. */
  readonly eyebrow = input.required<string>();
  readonly title = input.required<string>();
  readonly subtitle = input.required<string>();
}
