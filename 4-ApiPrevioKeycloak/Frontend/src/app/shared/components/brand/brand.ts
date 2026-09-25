import { Component, input } from '@angular/core';

/**
 * Logo de la app: marca + nombre. Es el lugar donde el diseño se permite ser
 * más retro. Cambiar el nombre del producto se hace solo acá.
 */
@Component({
  selector: 'app-brand',
  template: `
    <svg class="brand__mark" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <rect class="brand__plate" width="32" height="32" rx="9" />
      <circle class="brand__sun" cx="16" cy="17" r="9" />
      <rect class="brand__slit" x="4" y="17.4" width="24" height="1.8" />
      <rect class="brand__slit" x="4" y="21.2" width="24" height="2.2" />
    </svg>
    <span class="brand__word">Retro<span class="brand__word-accent">auth</span></span>
  `,
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      gap: var(--space-3);
      color: var(--c-text);
      text-decoration: none;
    }

    .brand__mark {
      width: 2rem;
      height: 2rem;
      flex: 0 0 auto;
      filter: drop-shadow(0 2px 6px var(--c-glow-3));
    }

    .brand__plate {
      fill: var(--c-violet);
    }

    .brand__sun {
      fill: var(--c-amber);
    }

    .brand__slit {
      fill: var(--c-violet);
    }

    .brand__word {
      font-family: var(--font-display);
      font-weight: 800;
      font-size: var(--text-lg);
      letter-spacing: var(--tracking-wide);
      text-transform: uppercase;
      white-space: nowrap;
    }

    .brand__word-accent {
      color: var(--c-accent);
    }

    :host([data-size='lg']) .brand__mark {
      width: 2.75rem;
      height: 2.75rem;
    }

    :host([data-size='lg']) .brand__word {
      font-size: var(--text-2xl);
    }
  `,
  host: {
    '[attr.data-size]': 'size()',
  },
})
export class Brand {
  /** `sm` para barras de navegación, `lg` para la cabecera de las tarjetas. */
  readonly size = input<'sm' | 'lg'>('sm');
}
