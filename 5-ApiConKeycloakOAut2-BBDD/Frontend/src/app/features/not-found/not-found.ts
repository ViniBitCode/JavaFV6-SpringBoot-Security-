import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Brand } from '../../shared/ui/brand/brand';
import { PitchBackdrop } from '../../shared/ui/pitch/pitch-backdrop';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink, Brand, PitchBackdrop],
  template: `
    <div class="nf">
      <app-pitch-backdrop />
      <app-brand size="lg" />
      <div class="nf__body">
        <span class="nf__code tabular-nums" aria-hidden="true">404</span>
        <span class="kicker">Fuera de juego</span>
        <h1>Página no encontrada</h1>
        <p class="text-muted">La dirección que buscas no existe o fue movida.</p>
        <div class="nf__actions">
          <a class="btn btn--primary" routerLink="/panel">Ir al panel</a>
          <a class="btn btn--secondary" routerLink="/">Ir al inicio</a>
        </div>
      </div>
    </div>
  `,
  styles: `
    .nf {
      position: relative;
      isolation: isolate;
      min-height: 100dvh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: var(--space-10);
      padding: var(--space-8) var(--space-4);
      text-align: center;
      background:
        radial-gradient(60rem 30rem at 50% -10rem, color-mix(in srgb, var(--color-accent) 14%, transparent), transparent 70%),
        var(--color-bg);
    }
    .nf__body {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-3);
      max-width: 28rem;
    }
    .nf__code {
      font-size: var(--text-4xl);
      font-weight: var(--weight-extrabold);
      letter-spacing: var(--tracking-tighter);
      color: var(--color-accent);
      line-height: 1;
    }
    .nf__actions {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: var(--space-3);
      margin-top: var(--space-4);
    }
  `,
})
export class NotFound {}
