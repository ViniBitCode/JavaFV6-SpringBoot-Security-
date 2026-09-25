import { Component } from '@angular/core';

/**
 * Fondo decorativo con líneas de cancha estilizadas (mitad de cancha, círculo
 * central y áreas). Se ubica detrás del contenido del contenedor padre, que
 * debe tener `position: relative`. Es puramente ornamental: `aria-hidden`
 * y sin interacción. Color y opacidad salen de los tokens `--pitch-line-*`.
 */
@Component({
  selector: 'app-pitch-backdrop',
  template: `
    <svg
      class="pitch"
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
    >
      <!-- perímetro -->
      <rect x="60" y="60" width="1080" height="680" rx="4" />
      <!-- mitad de cancha -->
      <line x1="600" y1="60" x2="600" y2="740" />
      <circle cx="600" cy="400" r="92" />
      <circle cx="600" cy="400" r="4" fill="currentColor" stroke="none" />
      <!-- área izquierda -->
      <rect x="60" y="200" width="170" height="400" />
      <rect x="60" y="310" width="60" height="180" />
      <circle cx="175" cy="400" r="4" fill="currentColor" stroke="none" />
      <path d="M230 330 A92 92 0 0 1 230 470" />
      <!-- área derecha -->
      <rect x="970" y="200" width="170" height="400" />
      <rect x="1080" y="310" width="60" height="180" />
      <circle cx="1025" cy="400" r="4" fill="currentColor" stroke="none" />
      <path d="M970 330 A92 92 0 0 0 970 470" />
      <!-- esquinas -->
      <path d="M60 80 A20 20 0 0 0 80 60M1120 60 A20 20 0 0 0 1140 80M1140 720 A20 20 0 0 0 1120 740M80 740 A20 20 0 0 0 60 720" />
    </svg>
  `,
  styles: `
    :host {
      position: absolute;
      inset: 0;
      z-index: -1;
      overflow: hidden;
      pointer-events: none;
      color: var(--pitch-line-color);
      opacity: var(--pitch-line-opacity);
      /* fundido hacia los bordes para no competir con el contenido */
      mask-image: radial-gradient(ellipse 80% 70% at 50% 45%, #000 40%, transparent 100%);
      -webkit-mask-image: radial-gradient(ellipse 80% 70% at 50% 45%, #000 40%, transparent 100%);
    }
    .pitch {
      width: 100%;
      height: 100%;
    }
  `,
})
export class PitchBackdrop {}
