import { Component, input } from '@angular/core';

import { PRODUCT_NAME } from '../../../core/config/product';

/**
 * Isotipo + nombre del producto.
 * El logo es una pelota estilizada (pentágono central y gajos) dibujada en SVG
 * con `currentColor`: para cambiarlo, reemplazar el <svg> de abajo. El nombre
 * sale de `PRODUCT_NAME` (core/config/product.ts).
 */
@Component({
  selector: 'app-brand',
  template: `
    <span class="brand" [class.brand--lg]="size() === 'lg'">
      <span class="brand__mark" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"
             stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="9.25" />
          <path d="m12 7.4 4.1 3-1.6 4.8H9.5L7.9 10.4z" fill="currentColor" stroke="none" />
          <path d="M12 7.4V2.8M16.1 10.4l4.4-1.4M14.5 15.2l2.7 3.6M9.5 15.2l-2.7 3.6M7.9 10.4 3.5 9" />
        </svg>
      </span>
      <span class="brand__name">{{ name }}</span>
    </span>
  `,
  styles: `
    .brand {
      display: inline-flex;
      align-items: center;
      gap: var(--space-2);
      font-weight: var(--weight-bold);
      letter-spacing: var(--tracking-tight);
      color: var(--color-text);
    }
    .brand__mark {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 1.75rem;
      height: 1.75rem;
      border-radius: var(--radius-full);
      background: var(--color-accent);
      color: var(--color-accent-fg);
      box-shadow: var(--shadow-sm);
    }
    .brand__mark svg { width: 1.15rem; height: 1.15rem; }
    .brand__name { font-size: var(--text-md); }

    .brand--lg { gap: var(--space-3); }
    .brand--lg .brand__mark { width: 2.75rem; height: 2.75rem; }
    .brand--lg .brand__mark svg { width: 1.75rem; height: 1.75rem; }
    .brand--lg .brand__name { font-size: var(--text-xl); }
  `,
})
export class Brand {
  readonly size = input<'md' | 'lg'>('md');
  protected readonly name = PRODUCT_NAME;
}
