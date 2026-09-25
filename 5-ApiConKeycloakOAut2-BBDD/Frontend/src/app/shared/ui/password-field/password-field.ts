import { Component, input, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

/**
 * Input de contraseña con botón para mostrar/ocultar.
 * Recibe el `FormControl` directamente para no duplicar la lógica de estado
 * entre login y registro. El label y el mensaje de error quedan afuera para
 * mantener la estructura `.field` estándar.
 */
@Component({
  selector: 'app-password-field',
  imports: [ReactiveFormsModule],
  template: `
    <div class="input-wrap">
      <input
        class="input input--with-action"
        [id]="id()"
        [type]="visible() ? 'text' : 'password'"
        [formControl]="control()"
        [autocomplete]="autocomplete()"
        [placeholder]="placeholder()"
        [attr.aria-invalid]="invalid() || null"
        [attr.aria-describedby]="describedBy() || null"
        spellcheck="false"
      />
      <button
        type="button"
        class="input-action"
        (click)="toggle()"
        [attr.aria-pressed]="visible()"
        [attr.aria-label]="visible() ? 'Ocultar contraseña' : 'Mostrar contraseña'"
        [attr.aria-controls]="id()"
      >
        @if (visible()) {
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 3l18 18" />
            <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
            <path d="M9.9 5.1A10.4 10.4 0 0 1 12 5c5 0 8.6 3.6 10 7-.5 1.2-1.3 2.4-2.3 3.4" />
            <path d="M6.6 6.6C4.5 8 3 9.9 2 12c1.4 3.4 5 7 10 7 1.7 0 3.2-.4 4.6-1.1" />
          </svg>
        } @else {
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M2 12c1.4-3.4 5-7 10-7s8.6 3.6 10 7c-1.4 3.4-5 7-10 7S3.4 15.4 2 12Z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        }
      </button>
    </div>
  `,
  styles: `
    :host { display: block; }
  `,
})
export class PasswordField {
  readonly control = input.required<FormControl<string>>();
  readonly id = input.required<string>();
  readonly autocomplete = input<'current-password' | 'new-password'>('current-password');
  readonly placeholder = input('');
  readonly invalid = input(false);
  readonly describedBy = input<string | null>(null);

  protected readonly visible = signal(false);

  protected toggle(): void {
    this.visible.update((value) => !value);
  }
}
