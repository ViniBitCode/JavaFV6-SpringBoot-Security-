import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { toUserMessage } from '../../../core/errors/http-error-messages';
import { AuthService } from '../../../core/services/auth.service';
import { NoticeService } from '../../../core/services/notice.service';
import {
  evaluarReglas,
  passwordPolicyValidator,
} from '../../../core/validators/password-policy.validator';
import { passwordsMatchValidator } from '../../../core/validators/passwords-match.validator';
import { Alert } from '../../../shared/components/alert/alert';
import { AuthShell } from '../../../shared/layout/auth-shell/auth-shell';

/** Largo mínimo del usuario. Se usa en el validador y en el mensaje de error. */
const LARGO_MINIMO_USUARIO = 4;

type CampoDelFormulario = 'username' | 'email' | 'password' | 'confirmPassword';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink, AuthShell, Alert],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly avisos = inject(NoticeService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly form = this.formBuilder.group(
    {
      username: ['', [Validators.required, Validators.minLength(LARGO_MINIMO_USUARIO)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, passwordPolicyValidator]],
      confirmPassword: ['', [Validators.required]],
    },
    // La coincidencia se valida en el grupo porque necesita ver los dos campos.
    { validators: passwordsMatchValidator('password', 'confirmPassword') },
  );

  /**
   * Valor de la contraseña como signal, para recalcular la checklist en vivo.
   * Se lee del stream del control en lugar de un evento del template para que
   * también reaccione a cambios programáticos (por ejemplo, un reset).
   */
  private readonly passwordActual = toSignal(this.form.controls.password.valueChanges, {
    initialValue: this.form.controls.password.value,
  });

  /** Estado de cada regla de la política, recalculado en cada tecla. */
  protected readonly reglas = computed(() => evaluarReglas(this.passwordActual()));

  protected readonly enviando = signal(false);
  protected readonly seIntentoEnviar = signal(false);
  protected readonly errorDelServidor = signal<string | null>(null);
  protected readonly passwordVisible = signal(false);
  protected readonly confirmacionVisible = signal(false);

  protected enviar(): void {
    this.seIntentoEnviar.set(true);
    this.errorDelServidor.set(null);

    if (this.enviando() || this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { username, email, password } = this.form.getRawValue();
    this.enviando.set(true);

    this.auth
      .register({ username: username.trim(), email: email.trim(), password })
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

  protected alternarPassword(): void {
    this.passwordVisible.update((visible) => !visible);
  }

  protected alternarConfirmacion(): void {
    this.confirmacionVisible.update((visible) => !visible);
  }

  /**
   * Los errores aparecen recién cuando el usuario salió del campo o intentó
   * enviar: no lo corregimos mientras escribe por primera vez.
   */
  protected tieneError(campo: CampoDelFormulario): boolean {
    const control = this.form.controls[campo];
    const yaSeVio = control.touched || this.seIntentoEnviar();

    if (!yaSeVio) {
      return false;
    }

    // La confirmación también falla si el error está en el grupo.
    if (campo === 'confirmPassword') {
      return control.invalid || this.form.hasError('passwordsMismatch');
    }

    return control.invalid;
  }

  protected mensajeDeError(campo: CampoDelFormulario): string {
    if (!this.tieneError(campo)) {
      return '';
    }

    const control = this.form.controls[campo];

    if (control.hasError('required')) {
      switch (campo) {
        case 'username':
          return 'Elegí un nombre de usuario.';
        case 'email':
          return 'Ingresá tu email.';
        case 'password':
          return 'Ingresá una contraseña.';
        case 'confirmPassword':
          return 'Repetí la contraseña.';
      }
    }

    if (campo === 'username' && control.hasError('minlength')) {
      return `El usuario necesita al menos ${LARGO_MINIMO_USUARIO} caracteres.`;
    }

    if (campo === 'email' && control.hasError('email')) {
      return 'Ese email no parece válido. Revisá el formato.';
    }

    if (campo === 'password' && control.hasError('passwordPolicy')) {
      // El detalle de qué falta lo cuenta la checklist de abajo.
      return 'La contraseña todavía no cumple los requisitos.';
    }

    if (campo === 'confirmPassword' && this.form.hasError('passwordsMismatch')) {
      return 'Las contraseñas no coinciden.';
    }

    return 'Revisá este dato.';
  }
}
