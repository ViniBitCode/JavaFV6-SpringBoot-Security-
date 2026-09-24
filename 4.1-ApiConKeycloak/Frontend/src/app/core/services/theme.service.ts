import { DOCUMENT } from '@angular/common';
import { Injectable, inject, signal } from '@angular/core';

/** `system` = seguir al sistema operativo; el resto es elección explícita. */
export type ThemePreference = 'system' | 'light' | 'dark';

const STORAGE_KEY = 'retroauth.theme';
const PREFERENCIAS: readonly ThemePreference[] = ['system', 'light', 'dark'];

/**
 * Tema claro/oscuro.
 *
 * Con `system` no se escribe nada en el <html> y manda la media query
 * `prefers-color-scheme` de los tokens. Con `light` o `dark` se escribe
 * `data-theme`, que en el CSS pisa a la media query.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly preferencia = signal<ThemePreference>('system');

  readonly preference = this.preferencia.asReadonly();

  constructor() {
    this.set(this.leerPreferenciaGuardada());
  }

  set(preferencia: ThemePreference): void {
    this.preferencia.set(preferencia);
    this.aplicarAlDocumento(preferencia);
    this.guardar(preferencia);
  }

  private aplicarAlDocumento(preferencia: ThemePreference): void {
    const raiz = this.document.documentElement;
    if (preferencia === 'system') {
      raiz.removeAttribute('data-theme');
    } else {
      raiz.setAttribute('data-theme', preferencia);
    }
  }

  private leerPreferenciaGuardada(): ThemePreference {
    try {
      const guardada = localStorage.getItem(STORAGE_KEY);
      return esPreferencia(guardada) ? guardada : 'system';
    } catch {
      return 'system';
    }
  }

  private guardar(preferencia: ThemePreference): void {
    try {
      localStorage.setItem(STORAGE_KEY, preferencia);
    } catch {
      // Sin storage el tema no se recuerda, pero la app funciona igual.
    }
  }
}

function esPreferencia(valor: string | null): valor is ThemePreference {
  return valor !== null && (PREFERENCIAS as readonly string[]).includes(valor);
}
