import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { toUserMessage } from '../../../core/errors/http-error-messages';
import { UserSummary } from '../../../core/models/user.models';
import { NoticeService } from '../../../core/services/notice.service';
import { UsersService } from '../../../core/services/users.service';
import { Alert } from '../../../shared/components/alert/alert';

/**
 * Listado de todos los usuarios de la base. Solo para ADMIN.
 *
 * La pantalla tiene cuatro estados y cada uno se ve distinto: cargando, error,
 * vacío y con datos. El de error importa hoy más que nunca, porque `GET /users`
 * todavía no existe en el backend.
 */
@Component({
  selector: 'app-user-list',
  imports: [RouterLink, Alert],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css',
})
export class UserList {
  private readonly users = inject(UsersService);
  private readonly destroyRef = inject(DestroyRef);

  /** Aviso que dejó el alta ("usuario creado"), si viene de ahí. */
  protected readonly aviso = signal(inject(NoticeService).consume());

  /** Filas del esqueleto de carga. Fija, para no crear un array nuevo por render. */
  protected readonly filasDeCarga = [1, 2, 3];

  protected readonly usuarios = signal<readonly UserSummary[]>([]);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);

  /** Hay datos que mostrar: ni cargando, ni error, ni lista vacía. */
  protected readonly hayDatos = computed(
    () => !this.cargando() && this.error() === null && this.usuarios().length > 0,
  );

  protected readonly estaVacio = computed(
    () => !this.cargando() && this.error() === null && this.usuarios().length === 0,
  );

  constructor() {
    this.cargar();
  }

  protected cargar(): void {
    this.cargando.set(true);
    this.error.set(null);

    this.users
      .listar()
      // Se pasa el DestroyRef explícito porque esto también corre desde el
      // botón "Actualizar", fuera del contexto de inyección.
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (lista) => {
          this.usuarios.set(lista);
          this.cargando.set(false);
        },
        error: (error: unknown) => {
          this.usuarios.set([]);
          this.error.set(toUserMessage(error));
          this.cargando.set(false);
        },
      });
  }

  /** "1 usuario" / "N usuarios", para no mostrar un plural roto. */
  protected readonly conteo = computed(() => {
    const total = this.usuarios().length;
    return total === 1 ? '1 usuario' : `${total} usuarios`;
  });
}
