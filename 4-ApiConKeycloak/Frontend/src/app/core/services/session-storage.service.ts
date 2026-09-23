import { Injectable } from '@angular/core';
import { Session } from '../models/auth.models';

/**
 * Clave de localStorage. Versionada para poder invalidar sesiones viejas:
 * v3 es la sesión con JWT (v2 era la sesión sin token).
 */
const STORAGE_KEY = 'retroauth.session.v3';

/**
 * Persistencia de la sesión. Aislada en su propio servicio para que cambiar
 * localStorage por sessionStorage (o por cookies) no obligue a tocar el
 * AuthService.
 *
 * Solo valida la FORMA de lo guardado. Si el token ya venció es asunto del
 * AuthService: acá no se sabe nada de JWT.
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
    if (!user || typeof user.username !== 'string' || user.username.length === 0) {
      return null;
    }
    // Sin rol no se puede decidir qué mostrar: se trata como sesión inválida.
    if (typeof user.role !== 'string' || user.role.length === 0) {
      return null;
    }

    return { token, user: { username: user.username, role: user.role } };
  }
}
