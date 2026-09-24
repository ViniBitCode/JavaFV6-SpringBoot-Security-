import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { apiBaseUrl } from '../config/api.config';
import { toUserMessage } from '../errors/http-error-messages';
import { Perfil, PerfilApiResponse } from '../models/perfil.models';

/**
 * Perfil del usuario logueado, traído de `GET /panel/me`.
 *
 * Es el estado compartido de la app: el saludo del panel, la directiva de roles
 * y cualquier pantalla futura leen de acá, no del token.
 */
@Injectable({ providedIn: 'root' })
export class PerfilService {
  private readonly http = inject(HttpClient);
  private readonly url = `${apiBaseUrl()}/panel/me`;

  private readonly perfilState = signal<Perfil | null>(null);
  private readonly cargandoState = signal(false);
  private readonly errorState = signal<string | null>(null);

  readonly perfil = this.perfilState.asReadonly();
  readonly cargando = this.cargandoState.asReadonly();
  readonly error = this.errorState.asReadonly();

  /** Rol actual, o `null` mientras el perfil no esté cargado. */
  readonly role = computed(() => this.perfilState()?.role ?? null);

  /**
   * Pide el perfil. Se llama al entrar al panel.
   *
   * Si ya está cargado no vuelve a pedirlo, salvo que se fuerce: el perfil no
   * cambia durante la sesión.
   */
  cargar(forzar = false): void {
    if (this.cargandoState() || (this.perfilState() !== null && !forzar)) {
      return;
    }

    this.cargandoState.set(true);
    this.errorState.set(null);

    this.http.get<PerfilApiResponse>(this.url).subscribe({
      next: (respuesta) => {
        const perfil = this.normalizar(respuesta);

        if (perfil === null) {
          this.errorState.set('El servidor devolvió un perfil sin usuario o sin rol.');
        } else {
          this.perfilState.set(perfil);
        }
        this.cargandoState.set(false);
      },
      error: (error: unknown) => {
        this.perfilState.set(null);
        this.errorState.set(toUserMessage(error));
        this.cargandoState.set(false);
      },
    });
  }

  /** Limpia el perfil al cerrar sesión, para que no quede el del usuario anterior. */
  limpiar(): void {
    this.perfilState.set(null);
    this.errorState.set(null);
  }

  /** Sin username o sin rol el perfil no sirve: se trata como respuesta inválida. */
  private normalizar(crudo: PerfilApiResponse | null | undefined): Perfil | null {
    if (!crudo || typeof crudo !== 'object') {
      return null;
    }

    const username = texto(crudo.username);
    const role = texto(crudo.role);

    if (!username || !role) {
      return null;
    }

    return { username, email: texto(crudo.email), role };
  }
}

/** Devuelve el string si tiene contenido real, o `null`. */
function texto(valor: unknown): string | null {
  return typeof valor === 'string' && valor.trim().length > 0 ? valor.trim() : null;
}
