import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/auth/auth-service';
import { AuthError } from '../../../../core/auth/auth.models';

/**
 * Formulario de login con Reactive Forms.
 *
 * Reactive Forms = el formulario vive en la clase (FormGroup / FormControl) y
 * el HTML solo se "ata" a él con [formGroup] y formControlName. La ventaja
 * frente a los template-driven forms es que la validación y el estado
 * (valid, touched, dirty) se manejan desde TypeScript, con tipos.
 */
@Component({
  selector: 'auth-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  /**
   * Si venimos del registro, la URL trae ?creado=usuario. Lo uso para
   * mostrar el cartel verde y dejar el nombre ya escrito en el campo.
   */
  protected readonly recienCreado = this.route.snapshot.queryParamMap.get('creado');

  /** Estado de vista. */
  protected readonly revealed = signal(false);
  /** true mientras esperamos la respuesta del backend. */
  protected readonly loading = signal(false);
  /** Mensaje de error que devolvió el backend (401, sin conexión, etc.). */
  protected readonly serverError = signal<string | null>(null);

  /**
   * nonNullable: los controles nunca valen null, así getRawValue() devuelve
   * { username: string; password: string; remember: boolean } tipado.
   * El segundo elemento del array son los validadores sincrónicos.
   */
  protected readonly form = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(4)]],
    remember: [false],
  });

  /** Atajos para no escribir form.controls.x en el HTML. */
  protected readonly username = this.form.controls.username;
  protected readonly password = this.form.controls.password;

  constructor() {
    if (this.recienCreado) {
      this.username.setValue(this.recienCreado);
    }
  }

  /** Un control muestra error solo si es inválido Y el usuario ya lo tocó. */
  protected showError(control: 'username' | 'password'): boolean {
    const field = this.form.controls[control];
    return field.invalid && (field.touched || field.dirty);
  }

  protected submit(): void {
    this.serverError.set(null);

    // Si hay campos inválidos, los marco como "touched" para que se vean los
    // mensajes de error, y corto acá sin llamar al backend.
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);

    // login() devuelve un Observable: recién con subscribe() sale el request.
    this.auth.login(this.form.getRawValue()).subscribe({
      next: () => {
        this.loading.set(false);
        // Sesión abierta -> me voy a la zona protegida.
        this.router.navigateByUrl('/panel');
      },
      error: (error: AuthError) => {
        this.loading.set(false);
        this.serverError.set(error.message);
        // Limpio la contraseña pero dejo el usuario escrito.
        this.password.reset();
      },
    });
  }
}
