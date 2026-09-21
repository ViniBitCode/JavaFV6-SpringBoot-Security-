import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/auth/auth-service';
import { AuthError } from '../../../../core/auth/auth.models';

/**
 * Validador de todo el formulario (no de un campo suelto): compara las dos
 * contraseñas. Si no coinciden, marca el formulario con el error
 * 'noCoinciden', que el HTML usa para mostrar el mensaje.
 */
function contrasenasIguales(grupo: AbstractControl) {
  const password = grupo.get('password')?.value;
  const repetir = grupo.get('passwordConfirm')?.value;
  return password === repetir ? null : { noCoinciden: true };
}

@Component({
  selector: 'auth-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly revealed = signal(false);
  protected readonly loading = signal(false);
  protected readonly serverError = signal<string | null>(null);

  /**
   * El segundo parámetro del group() son los validadores del formulario
   * entero, los que necesitan mirar más de un campo a la vez.
   */
  protected readonly form = this.fb.nonNullable.group(
    {
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      passwordConfirm: ['', [Validators.required]],
      terms: [false, [Validators.requiredTrue]],
    },
    { validators: contrasenasIguales },
  );

  protected readonly username = this.form.controls.username;
  protected readonly password = this.form.controls.password;
  protected readonly passwordConfirm = this.form.controls.passwordConfirm;
  protected readonly terms = this.form.controls.terms;

  /** Deja el valor del campo contraseña disponible para el medidor de fuerza. */
  private readonly passwordValue = toSignal(this.password.valueChanges, { initialValue: '' });

  /** Solo alimenta el medidor visual; la validación de verdad la hace el backend. */
  protected readonly strength = computed(() => {
    const value = this.passwordValue();
    let score = 0;
    if (value.length >= 8) score++;
    if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score++;
    if (/\d/.test(value)) score++;
    if (/[^\w\s]/.test(value)) score++;

    const label = value.length === 0 ? '—' : ['débil', 'débil', 'media', 'buena', 'fuerte'][score];
    return { score, label };
  });

  protected showError(control: 'username' | 'password' | 'passwordConfirm' | 'terms'): boolean {
    const field = this.form.controls[control];
    return field.invalid && (field.touched || field.dirty);
  }

  /** Las contraseñas distintas se avisan recién cuando tocó la segunda. */
  protected showMismatch(): boolean {
    return this.form.hasError('noCoinciden') && this.passwordConfirm.touched;
  }

  protected submit(): void {
    this.serverError.set(null);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    const { username, password } = this.form.getRawValue();

    this.auth.register(username, password).subscribe({
      next: () => {
        this.loading.set(false);
        // La cuenta quedó creada pero sin sesión abierta: lo mando al login
        // con el usuario ya escrito para que solo ponga la contraseña.
        this.router.navigate(['/auth/login'], { queryParams: { creado: username } });
      },
      error: (error: AuthError) => {
        this.loading.set(false);
        this.serverError.set(error.message);
      },
    });
  }
}
