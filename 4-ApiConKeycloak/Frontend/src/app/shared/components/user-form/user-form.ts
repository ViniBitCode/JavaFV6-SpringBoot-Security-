import { Component, DestroyRef, computed, inject, input, output, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  evaluarReglas,
  passwordPolicyValidator,
} from '../../../core/validators/password-policy.validator';
import { passwordsMatchValidator } from '../../../core/validators/passwords-match.validator';

/** Largo mínimo del usuario. Se usa en el validador y en el mensaje de error. */
const LARGO_MINIMO_USUARIO = 4;

type CampoDelFormulario = 'username' | 'email' | 'password' | 'confirmPassword';

/** Datos que emite el formulario al enviarse (ya recortados). */
export interface UserFormValue {
  readonly username: string;
  readonly email: string;
  readonly password: string;
}

/**
 * Formulario de alta de usuario: usuario, email y contraseña con su política.
 *
 * Lo comparten el registro público (`/register`) y el alta desde el panel de
 * admin, que piden exactamente los mismos datos contra el mismo endpoint. Vive
 * acá para que la política de contraseñas y los mensajes de error no se
 * bifurquen en dos copias que después se desincronizan.
 *
 * El componente se ocupa SOLO del formulario. Quién llama a la API, qué se
 * hace después y cómo se muestran los errores del servidor es del padre.
 */
@Component({
  selector: 'app-user-form',
  imports: [ReactiveFormsModule],
  templateUrl: './user-form.html',
})
export class UserForm {
  /**
   * Prefijo de los `id` de los campos. Existe porque los `id` son globales al
   * documento: si algún día hay dos formularios en la misma pantalla, los
   * `<label for>` tienen que seguir apuntando a su propio input.
   */
  readonly idPrefijo = input('user');

  /** Texto del botón en reposo y mientras se envía. */
  readonly textoEnviar = input('Crear cuenta');
  readonly textoEnviando = input('Creando cuenta…');

  /** Lo maneja el padre: es el que sabe cuándo terminó el pedido. */
  readonly enviando = input(false);

  /** Se emite solo si el formulario es válido. */
  readonly enviar = output<UserFormValue>();

  private readonly formBuilder = inject(NonNullableFormBuilder);
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
  private readonly passwordActual = toSignal(
    this.form.controls.password.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)),
    { initialValue: this.form.controls.password.value },
  );

  /** Estado de cada regla de la política, recalculado en cada tecla. */
  protected readonly reglas = computed(() => evaluarReglas(this.passwordActual()));

  /** Se activa con el primer submit: a partir de ahí se muestran los errores. */
  protected readonly seIntentoEnviar = signal(false);

  protected readonly passwordVisible = signal(false);
  protected readonly confirmacionVisible = signal(false);

  /** Limpia el formulario. Lo llama el padre cuando el alta salió bien. */
  reiniciar(): void {
    this.form.reset();
    this.seIntentoEnviar.set(false);
  }

  protected alEnviar(): void {
    this.seIntentoEnviar.set(true);

    if (this.enviando() || this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { username, email, password } = this.form.getRawValue();
    this.enviar.emit({ username: username.trim(), email: email.trim(), password });
  }

  protected alternarPassword(): void {
    this.passwordVisible.update((visible) => !visible);
  }

  protected alternarConfirmacion(): void {
    this.confirmacionVisible.update((visible) => !visible);
  }

  /** Arma el id de un campo a partir del prefijo. */
  protected idDe(campo: string): string {
    return `${this.idPrefijo()}-${campo}`;
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
