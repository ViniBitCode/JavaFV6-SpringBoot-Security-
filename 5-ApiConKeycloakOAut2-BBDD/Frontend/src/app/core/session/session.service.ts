import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, resource } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { ApiError } from '../api/api-error';
import { apiUrl } from '../api/api-url';
import { Rol, SessionUser } from './session.models';

/**
 * Sesión de la aplicación según la API: quién soy y qué rol tengo
 * (`GET /panel/me`). Se carga al entrar al panel y queda en signals para
 * que cualquier componente o directiva (por ejemplo `*appSiRol`) la consulte.
 *
 * El interceptor ya agregó el token a la petición; acá no se mira Keycloak.
 */
@Injectable({ providedIn: 'root' })
export class SessionService {
  private readonly http = inject(HttpClient);

  private readonly me = resource<SessionUser, void>({
    loader: () => firstValueFrom(this.http.get<SessionUser>(apiUrl('/panel/me'))),
  });

  /**
   * Datos de la sesión, o `null` mientras carga o si falló.
   * Ojo: `resource.value()` LANZA una excepción si el recurso está en error;
   * por eso se consulta `hasValue()` antes, si no el panel entero deja de renderizar.
   */
  readonly user = computed(() => (this.me.hasValue() ? this.me.value() : null));

  /** Rol informado por la API, o `null` hasta que responda. */
  readonly rol = computed<Rol | null>(() => this.user()?.rol ?? null);

  readonly loading = computed(() => this.me.isLoading());

  /** Error de la última carga, tipado por `ApiError` para elegir el mensaje. */
  readonly error = computed<ApiError | null>(() => {
    const error = this.me.error();
    if (!error) {
      return null;
    }
    return ApiError.is(error) ? error : new ApiError('server', 0, 'No se pudo cargar la sesión.');
  });

  /** Vuelve a pedir `/panel/me` (por ejemplo tras "Reintentar"). */
  reload(): void {
    this.me.reload();
  }
}
