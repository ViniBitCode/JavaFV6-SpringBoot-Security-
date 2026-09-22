import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { toUserMessage } from '../../../core/errors/http-error-messages';
import { RETURN_URL_PARAM } from '../../../core/guards/auth.guard';
import { AuthService } from '../../../core/services/auth.service';
import { NoticeService } from '../../../core/services/notice.service';
import { Alert } from '../../../shared/components/alert/alert';
import { AuthShell } from '../../../shared/layout/auth-shell/auth-shell';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, AuthShell, Alert],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly form = this.formBuilder.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  /** Petición en curso: bloquea el botón y muestra el spinner. */
  protected readonly enviando = signal(false);

  /** Se activa con el primer submit: a partir de ahí se muestran los errores. */
  protected readonly seIntentoEnviar = signal(false);

  protected readonly errorDelServidor = signal<string | null>(null);
  protected readonly passwordVisible = signal(false);

  /** Aviso que dejó otra pantalla (típicamente "cuenta creada" del registro). */
  protected readonly aviso = signal(inject(NoticeService).consume());

  protected enviar(): void {
    this.seIntentoEnviar.set(true);
    this.errorDelServidor.set(null);
    this.aviso.set(null);

    if (this.enviando() || this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { username, password } = this.form.getRawValue();
    this.enviando.set(true);

    this.auth
      .login({ username: username.trim(), password })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.enviando.set(false);
          void this.router.navigateByUrl(this.destinoTrasIngresar());
        },
        error: (error: unknown) => {
          this.enviando.set(false);
          this.errorDelServidor.set(toUserMessage(error, 'login'));
        },
      });
  }

  protected alternarPassword(): void {
    this.passwordVisible.update((visible) => !visible);
  }

  /** Un campo muestra su error si falla y el usuario ya pasó por él. */
  protected tieneError(campo: 'username' | 'password'): boolean {
    const control = this.form.controls[campo];
    return control.invalid && (control.touched || this.seIntentoEnviar());
  }

  protected mensajeDeError(campo: 'username' | 'password'): string {
    if (!this.tieneError(campo)) {
      return '';
    }
    return campo === 'username' ? 'Ingresá tu usuario.' : 'Ingresá tu contraseña.';
  }

  /**
   * A dónde ir después de entrar. Si el guard guardó una URL se respeta, pero
   * solo si es interna: así el query param no sirve para redirigir afuera.
   */
  private destinoTrasIngresar(): string {
    const solicitada = this.route.snapshot.queryParamMap.get(RETURN_URL_PARAM);

    if (solicitada && solicitada.startsWith('/') && !solicitada.startsWith('//')) {
      return solicitada;
    }
    return '/panel';
  }
}
