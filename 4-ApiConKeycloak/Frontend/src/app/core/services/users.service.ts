import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { apiBaseUrl } from '../config/api.config';
import { UserApiItem, UserSummary } from '../models/user.models';
import { RegisterApiResponse, RegisterRequest } from '../models/auth.models';

/**
 * Administración de usuarios. Solo la usa el panel de admin.
 *
 * El token lo agrega el interceptor, así que acá no se toca el header
 * `Authorization`.
 */
@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly http = inject(HttpClient);
  private readonly base = apiBaseUrl();

  /**
   * `GET /panel/users` (`PanelController.listaDeUsuarios`).
   *
   * El backend ya exige rol ADMIN con `@PreAuthorize`, así que esto falla del
   * lado del servidor aunque alguien se saltee el guard del front.
   */
  listar(): Observable<readonly UserSummary[]> {
    return this.http
      .get<readonly UserApiItem[]>(`${this.base}/panel/users`)
      .pipe(map((crudos) => this.normalizarLista(crudos)));
  }

  /**
   * Alta de usuario desde el panel.
   *
   * Reusa `POST /auth/register` a propósito: pide exactamente los mismos datos
   * y ya existe. La contra es que el backend fija el rol USER en duro
   * (`AuthController.authRegister`), así que un admin no puede crear otro
   * admin desde acá hasta que exista un endpoint que reciba el rol.
   *
   * Toma un `RegisterRequest` y no el valor del formulario: `core` no conoce
   * los componentes, y el cuerpo que viaja es el mismo del registro público.
   */
  crear(datos: RegisterRequest): Observable<RegisterApiResponse> {
    return this.http.post<RegisterApiResponse>(`${this.base}/auth/register`, datos);
  }

  /** Descarta lo que no tenga username: sin eso no hay fila que mostrar. */
  private normalizarLista(
    crudos: readonly UserApiItem[] | null | undefined,
  ): readonly UserSummary[] {
    if (!Array.isArray(crudos)) {
      return [];
    }

    return crudos
      .map((crudo) => this.normalizar(crudo))
      .filter((usuario): usuario is UserSummary => usuario !== null);
  }

  private normalizar(crudo: UserApiItem | null | undefined): UserSummary | null {
    if (!crudo || typeof crudo !== 'object') {
      return null;
    }

    const username = texto(crudo.username);
    if (!username) {
      return null;
    }

    return {
      username,
      email: texto(crudo.email),
      role: this.normalizarRol(crudo.role),
    };
  }

  /**
   * El DTO manda el rol pelado ('ADMIN'), pero se saca el prefijo por las
   * dudas: si alguna vez sale de las authorities del token, viene 'ROLE_ADMIN'.
   */
  private normalizarRol(role: string | undefined): string | null {
    const crudo = texto(role);

    if (!crudo) {
      return null;
    }
    return crudo.startsWith('ROLE_') ? crudo.slice(5) : crudo;
  }
}

/** Devuelve el string si tiene contenido real, o `null`. */
function texto(valor: unknown): string | null {
  return typeof valor === 'string' && valor.trim().length > 0 ? valor.trim() : null;
}
