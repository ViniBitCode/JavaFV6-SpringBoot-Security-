import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { toUserMessage } from '../../../core/errors/http-error-messages';
import { NoticeService } from '../../../core/services/notice.service';
import { UsersService } from '../../../core/services/users.service';
import { Alert } from '../../../shared/components/alert/alert';
import { UserForm, UserFormValue } from '../../../shared/components/user-form/user-form';

/**
 * Alta de usuario desde el panel de admin.
 *
 * Es el mismo formulario que el registro público (`shared/components/user-form`)
 * contra el mismo endpoint; lo que cambia es el marco y a dónde se vuelve
 * después. El rol lo fija el backend en USER: ver `UsersService.crear`.
 */
@Component({
  selector: 'app-user-create',
  imports: [RouterLink, Alert, UserForm],
  templateUrl: './user-create.html',
  styleUrl: './user-create.css',
})
export class UserCreate {
  private readonly users = inject(UsersService);
  private readonly router = inject(Router);
  private readonly avisos = inject(NoticeService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly enviando = signal(false);
  protected readonly errorDelServidor = signal<string | null>(null);

  protected crear(datos: UserFormValue): void {
    this.errorDelServidor.set(null);
    this.enviando.set(true);

    this.users
      .crear(datos)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.enviando.set(false);
          // El listado consume el aviso apenas se monta.
          this.avisos.show(`Usuario "${datos.username}" creado.`, 'success');
          void this.router.navigate(['/panel/usuarios']);
        },
        error: (error: unknown) => {
          this.enviando.set(false);
          this.errorDelServidor.set(toUserMessage(error, 'register'));
        },
      });
  }
}
