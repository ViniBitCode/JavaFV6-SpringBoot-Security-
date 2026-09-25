import { Component, input } from '@angular/core';

/**
 * Mensaje de error de un campo. Se renderiza solo cuando hay mensaje.
 * El `id` debe coincidir con el `aria-describedby` del input asociado.
 */
@Component({
  selector: 'app-field-error',
  template: `
    @if (message(); as text) {
      <p class="field__error" [id]="id()" role="alert">
        <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm0-12a1 1 0 0 1 1 1v3.5a1 1 0 1 1-2 0V7a1 1 0 0 1 1-1Zm0 8a1.25 1.25 0 1 0 0-2.5A1.25 1.25 0 0 0 10 14Z"
            clip-rule="evenodd"
          />
        </svg>
        <span>{{ text }}</span>
      </p>
    }
  `,
  styles: `
    :host { display: contents; }
    svg { flex-shrink: 0; margin-top: 0.15rem; }
  `,
})
export class FieldError {
  readonly id = input.required<string>();
  readonly message = input<string | null>(null);
}
