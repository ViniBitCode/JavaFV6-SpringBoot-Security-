import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, resource } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { ApiError } from '../../../core/api/api-error';
import { apiUrl } from '../../../core/api/api-url';
import { NuevoTorneo, Torneo } from '../torneo.models';

/**
 * Torneos contra la API (`/torneos`). La lista vive en un `resource` con
 * signals; crear un torneo la vuelve a pedir. El token lo agrega el interceptor.
 */
@Injectable({ providedIn: 'root' })
export class TorneosService {
  private readonly http = inject(HttpClient);

  private readonly lista = resource<Torneo[], void>({
    loader: () => firstValueFrom(this.http.get<Torneo[]>(apiUrl('/torneos'))),
  });

  /** Torneos cargados, o lista vacía mientras carga o si falló. */
  readonly torneos = computed(() => (this.lista.hasValue() ? this.lista.value() : []));
  readonly loading = computed(() => this.lista.isLoading());
  readonly loaded = computed(() => this.lista.hasValue());

  readonly error = computed<ApiError | null>(() => {
    const error = this.lista.error();
    if (!error) {
      return null;
    }
    return ApiError.is(error) ? error : new ApiError('server', 0, 'No se pudieron cargar los torneos.');
  });

  reload(): void {
    this.lista.reload();
  }

  /** `POST /torneos` (solo ADMIN). La API responde texto plano; ante un nombre repetido, 409. */
  async crear(torneo: NuevoTorneo): Promise<void> {
    await firstValueFrom(this.http.post(apiUrl('/torneos'), torneo, { responseType: 'text' }));
    this.lista.reload();
  }
}
