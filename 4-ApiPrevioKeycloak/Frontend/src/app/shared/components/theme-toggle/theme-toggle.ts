import { Component, inject } from '@angular/core';
import { ThemePreference, ThemeService } from '../../../core/services/theme.service';

interface OpcionDeTema {
  readonly valor: ThemePreference;
  readonly titulo: string;
}

/**
 * Selector de tema de tres estados. Se usan botones reales con `aria-pressed`
 * para que funcione con teclado y lectores de pantalla sin trabajo extra.
 */
@Component({
  selector: 'app-theme-toggle',
  template: `
    <div class="switch" role="group" aria-label="Tema de la interfaz">
      @for (opcion of opciones; track opcion.valor) {
        <button
          type="button"
          class="switch__btn"
          [class.switch__btn--active]="tema.preference() === opcion.valor"
          [attr.aria-pressed]="tema.preference() === opcion.valor"
          [title]="opcion.titulo"
          (click)="tema.set(opcion.valor)"
        >
          <span aria-hidden="true" class="switch__icon">
            @switch (opcion.valor) {
              @case ('system') {
                <svg viewBox="0 0 16 16"><path d="M8 1a7 7 0 1 0 0 14V1Z" /></svg>
              }
              @case ('light') {
                <svg viewBox="0 0 16 16">
                  <circle cx="8" cy="8" r="3.4" />
                  <path
                    d="M8 .8v2M8 13.2v2M.8 8h2M13.2 8h2M2.9 2.9l1.4 1.4M11.7 11.7l1.4 1.4M13.1 2.9l-1.4 1.4M4.3 11.7l-1.4 1.4"
                    class="switch__rays"
                  />
                </svg>
              }
              @case ('dark') {
                <svg viewBox="0 0 16 16">
                  <path d="M10.4 1.6a6.4 6.4 0 1 0 4 12.1A7 7 0 0 1 10.4 1.6Z" />
                </svg>
              }
            }
          </span>
          <span class="sr-only">{{ opcion.titulo }}</span>
        </button>
      }
    </div>
  `,
  styles: `
    .switch {
      display: inline-flex;
      gap: 2px;
      padding: 3px;
      background: var(--c-surface-2);
      border: 1px solid var(--c-border);
      border-radius: var(--radius-pill);
    }

    .switch__btn {
      display: grid;
      place-items: center;
      width: 2rem;
      height: 2rem;
      padding: 0;
      background: transparent;
      border: 0;
      border-radius: 50%;
      color: var(--c-text-subtle);
      cursor: pointer;
      transition:
        background-color var(--transition-fast),
        color var(--transition-fast);
    }

    .switch__btn:hover {
      color: var(--c-text);
    }

    .switch__btn--active {
      background: var(--c-surface);
      color: var(--c-accent);
      box-shadow: var(--shadow-sm);
    }

    .switch__icon svg {
      width: 1rem;
      height: 1rem;
      fill: currentColor;
    }

    .switch__rays {
      fill: none;
      stroke: currentColor;
      stroke-width: 1.4;
      stroke-linecap: round;
    }
  `,
})
export class ThemeToggle {
  protected readonly tema = inject(ThemeService);

  protected readonly opciones: readonly OpcionDeTema[] = [
    { valor: 'system', titulo: 'Seguir al sistema' },
    { valor: 'light', titulo: 'Tema claro' },
    { valor: 'dark', titulo: 'Tema oscuro' },
  ];
}
