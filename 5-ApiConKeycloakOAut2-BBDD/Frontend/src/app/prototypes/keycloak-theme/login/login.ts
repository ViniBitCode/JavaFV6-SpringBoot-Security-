import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { FieldMessages, firstErrorMessage, shouldShowError } from '../../../shared/forms/field-messages';
import { FieldError } from '../../../shared/ui/field-error/field-error';
import { PasswordField } from '../../../shared/ui/password-field/password-field';
import { SocialButtons } from '../../../shared/ui/social-buttons/social-buttons';

type LoginField = 'username' | 'password';

/**
 * =============================================================================
 * PROTOTIPO — FUERA DEL RUTEO
 * =============================================================================
 *
 * Referencia visual para el futuro tema de Keycloak (pantalla de login).
 * Desde la integración con Keycloak, el login real lo muestra el servidor de
 * identidad (`AuthService.login()` redirige allí), por lo que este componente
 * no se rutea ni habla con ningún servicio: el envío solo simula una espera
 * para poder ver el estado de carga del botón.
 */
@Component({
  selector: 'app-login-prototype',
  imports: [ReactiveFormsModule, RouterLink, FieldError, PasswordField, SocialButtons],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  protected readonly form = new FormGroup({
    username: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  protected readonly loading = signal(false);

  private readonly messages: Record<LoginField, FieldMessages> = {
    username: { required: 'Ingresa tu usuario.' },
    password: { required: 'Ingresa tu contraseña.' },
  };

  protected showError(field: LoginField): boolean {
    return shouldShowError(this.form.controls[field]);
  }

  protected errorMessage(field: LoginField): string | null {
    return this.showError(field)
      ? firstErrorMessage(this.form.controls[field], this.messages[field])
      : null;
  }

  protected async submit(): Promise<void> {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.loading()) {
      return;
    }

    // PROTOTIPO: no autentica; solo muestra el estado de carga.
    this.loading.set(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } finally {
      this.loading.set(false);
    }
  }
}
