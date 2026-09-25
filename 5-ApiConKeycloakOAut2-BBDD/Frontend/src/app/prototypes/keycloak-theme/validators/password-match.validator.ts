import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validador a nivel de formulario: comprueba que dos controles tengan el mismo
 * valor. Deja `{ passwordMismatch: true }` en el grupo cuando no coinciden.
 * No se evalúa mientras el segundo campo esté vacío (de eso se ocupa `required`).
 */
export function passwordMatchValidator(
  passwordKey = 'password',
  confirmKey = 'confirmPassword',
): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const password = group.get(passwordKey)?.value as string | null | undefined;
    const confirm = group.get(confirmKey)?.value as string | null | undefined;

    if (!confirm) {
      return null;
    }

    return password === confirm ? null : { passwordMismatch: true };
  };
}
