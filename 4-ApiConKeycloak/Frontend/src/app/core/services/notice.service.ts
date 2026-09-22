import { Injectable, signal } from '@angular/core';

export type NoticeTone = 'success' | 'danger' | 'warning';

export interface Notice {
  readonly tone: NoticeTone;
  readonly text: string;
}

/**
 * Avisos de un solo uso que sobreviven a una navegación.
 *
 * Caso concreto: el registro exitoso redirige a /login y el login muestra el
 * mensaje de confirmación. Se usa un signal en lugar de query params para no
 * ensuciar la URL con textos.
 */
@Injectable({ providedIn: 'root' })
export class NoticeService {
  private readonly pendiente = signal<Notice | null>(null);

  show(text: string, tone: NoticeTone = 'success'): void {
    this.pendiente.set({ text, tone });
  }

  /** Devuelve el aviso pendiente y lo borra: se muestra una sola vez. */
  consume(): Notice | null {
    const aviso = this.pendiente();
    if (aviso) {
      this.pendiente.set(null);
    }
    return aviso;
  }
}
