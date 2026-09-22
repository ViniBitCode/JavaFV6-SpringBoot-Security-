import { Injectable } from '@angular/core';
import { Session } from '../models/auth.models';

/** Clave de localStorage. Versionada para poder invalidar sesiones viejas. */
const STORAGE_KEY = 'retroauth.session.v1';

/**
 * Persistencia de la sesión. Aislada en su propio servicio para que cambiar
 * localStorage por sessionStorage (o por cookies) no obligue a tocar el
 * AuthService.
 */
@Injectable({ providedIn: 'root' })
export class SessionStorageService {
  read(): Session | null {
    const bruto = this.leerCrudo();
    if (!bruto) {
      return null;
    }

    try {
      return this.validar(JSON.parse(bruto));
    } catch {
      // JSON corrupto: se descarta para no dejar la app en un estado raro.
      this.clear();
      return null;
    }
  }

  save(session: Session): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } catch {
      // Navegación privada o cuota llena: la sesión vive solo en memoria.
    }
  }

  clear(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* sin storage disponible, nada que limpiar */
    }
  }

  private leerCrudo(): string | null {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  }

  /** Acepta el valor guardado solo si sigue teniendo la forma de `Session`. */
  private validar(valor: unknown): Session | null {
    if (!valor || typeof valor !== 'object') {
      return null;
    }

    const candidato = valor as Partial<Session>;
    const token = candidato.token;
    const user = candidato.user;

    if (typeof token !== 'string' || token.length === 0) {
      return null;
    }
    if (!user || typeof user.username !== 'string') {
      return null;
    }

    return {
      token,
      user: {
        id: typeof user.id === 'string' ? user.id : null,
        username: user.username,
        email: typeof user.email === 'string' ? user.email : null,
        roles: Array.isArray(user.roles) ? [...user.roles] : [],
      },
    };
  }
}
