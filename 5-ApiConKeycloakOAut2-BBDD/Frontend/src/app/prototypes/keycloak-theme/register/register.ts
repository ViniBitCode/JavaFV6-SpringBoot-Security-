import { Component, computed, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { FieldMessages, firstErrorMessage, shouldShowError } from '../../../shared/forms/field-messages';
import { FieldError } from '../../../shared/ui/field-error/field-error';
import { PasswordField } from '../../../shared/ui/password-field/password-field';
import { SocialButtons } from '../../../shared/ui/social-buttons/social-buttons';
import { passwordMatchValidator } from '../validators/password-match.validator';
import {
  PASSWORD_RULES,
  checkPasswordRules,
  passwordStrengthValidator,
} from '../validators/password.validator';

type RegisterField = 'username' | 'email' | 'password' | 'confirmPassword';

const USERNAME_MIN_LENGTH = 4;

/**
 * =============================================================================
 * PROTOTIPO — FUERA DEL RUTEO
 * =============================================================================
 *
 * Referencia visual para el futuro tema de Keycloak (pantalla de registro).
 * Desde la integración con Keycloak, el registro real lo muestra el servidor
 * de identidad (`AuthService.register()` redirige allí), por lo que este
 * componente no se rutea ni habla con ningún servicio: el envío solo simula
 * una espera para poder ver el estado de carga del botón.
 */
@Component({
  selector: 'app-register-prototype',
  imports: [ReactiveFormsModule, RouterLink, FieldError, PasswordField, SocialButtons],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  protected readonly form = new FormGroup(
    {
      username: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(USERNAME_MIN_LENGTH)],
      }),
      email: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.email],
      }),
      password: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, passwordStrengthValidator()],
      }),
      confirmPassword: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
    },
    { validators: [passwordMatchValidator('password', 'confirmPassword')] },
  );

  protected readonly loading = signal(false);

  /** Reglas de contraseña para la lista de requisitos. */
  protected readonly passwordRules = PASSWORD_RULES;

  private readonly passwordValue = toSignal(this.form.controls.password.valueChanges, {
    initialValue: this.form.controls.password.value,
  });

  /** Estado de cada regla, recalculado en tiempo real mientras se escribe. */
  protected readonly ruleStatus = computed(() => checkPasswordRules(this.passwordValue()));

  private readonly messages: Record<RegisterField, FieldMessages> = {
    username: {
      required: 'Ingresa un nombre de usuario.',
      minlength: `El usuario debe tener al menos ${USERNAME_MIN_LENGTH} caracteres.`,
    },
    email: {
      required: 'Ingresa tu email.',
      email: 'Ingresa un email válido.',
    },
    password: {
      required: 'Ingresa una contraseña.',
      passwordStrength: 'La contraseña no cumple todos los requisitos.',
    },
    confirmPassword: {
      required: 'Repite la contraseña.',
    },
  };

  protected showError(field: RegisterField): boolean {
    if (field === 'confirmPassword') {
      const control = this.form.controls.confirmPassword;
      return control.touched && (control.invalid || this.form.hasError('passwordMismatch'));
    }
    return shouldShowError(this.form.controls[field]);
  }

  protected errorMessage(field: RegisterField): string | null {
    if (!this.showError(field)) {
      return null;
    }

    const own = firstErrorMessage(this.form.controls[field], this.messages[field]);
    if (own) {
      return own;
    }

    if (field === 'confirmPassword' && this.form.hasError('passwordMismatch')) {
      return 'Las contraseñas no coinciden.';
    }

    return null;
  }

  protected async submit(): Promise<void> {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.loading()) {
      return;
    }

    // PROTOTIPO: no crea ninguna cuenta; solo muestra el estado de carga.
    this.loading.set(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } finally {
      this.loading.set(false);
    }
  }
}
