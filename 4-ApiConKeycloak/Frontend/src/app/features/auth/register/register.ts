import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { toUserMessage } from '../../../core/errors/http-error-messages';
import { AuthService } from '../../../core/services/auth.service';
import { NoticeService } from '../../../core/services/notice.service';
import { Alert } from '../../../shared/components/alert/alert';
import { UserForm, UserFormValue } from '../../../shared/components/user-form/user-form';
import { AuthShell } from '../../../shared/layout/auth-shell/auth-shell';

/**
 * Registro público. El formulario en sí vive en `shared/components/user-form`,
 * compartido con el alta de usuarios del panel de admin: acá queda solo el
 * pedido a la API y qué hacer después.
 */
@Component({
  selector: 'app-register',
  imports: [RouterLink, AuthShell, Alert, UserForm],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly avisos = inject(NoticeService);
  private readonly destroyRef = inject(DestroyRef);

  /** Petición en curso: bloquea el botón y muestra el spinner. */
  protected readonly enviando = signal(false);

  protected readonly errorDelServidor = signal<string | null>(null);

  protected crearCuenta(datos: UserFormValue): void {
    this.errorDelServidor.set(null);
    this.enviando.set(true);

    this.auth
      .register(datos)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.enviando.set(false);
          // El aviso lo muestra /login apenas se monta.
          this.avisos.show('¡Cuenta creada! Ya podés iniciar sesión.', 'success');
          void this.router.navigate(['/login']);
        },
        error: (error: unknown) => {
          this.enviando.set(false);
          this.errorDelServidor.set(toUserMessage(error, 'register'));
        },
      });
  }
}
