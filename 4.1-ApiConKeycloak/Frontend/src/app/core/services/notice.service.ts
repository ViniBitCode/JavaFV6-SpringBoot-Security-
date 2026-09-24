import { Injectable, signal } from '@angular/core';

export type NoticeTone = 'success' | 'danger' | 'warning';

export interface Notice {
  readonly tone: NoticeTone;
  readonly text: string;
}

/**
 * Avisos globales de la app.
 *
 * Lo usa sobre todo el interceptor de errores, que no tiene pantalla propia
 * donde mostrar un 403 o una API caída. El marco del panel lo dibuja.
 */
@Injectable({ providedIn: 'root' })
export class NoticeService {
  private readonly actualState = signal<Notice | null>(null);

  readonly actual = this.actualState.asReadonly();

  show(text: string, tone: NoticeTone = 'success'): void {
    this.actualState.set({ text, tone });
  }

  clear(): void {
    this.actualState.set(null);
  }
}
