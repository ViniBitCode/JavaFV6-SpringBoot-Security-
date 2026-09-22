import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Valida a nivel de FORMULARIO que dos campos coincidan.
 *
 * Va en el grupo (no en el control) porque la comparación necesita ver los dos
 * valores. El error queda en el grupo como `{ passwordsMismatch: true }`.
 *
 * @param campoOriginal     Nombre del control con la contraseña.
 * @param campoConfirmacion Nombre del control con la confirmación.
 */
export function passwordsMatchValidator(
  campoOriginal: string,
  campoConfirmacion: string,
): ValidatorFn {
  return (grupo: AbstractControl): ValidationErrors | null => {
    const original = grupo.get(campoOriginal)?.value;
    const confirmacion = grupo.get(campoConfirmacion)?.value;

    // Mientras la confirmación esté vacía no molestamos: ya la marca `required`.
    if (!confirmacion) {
      return null;
    }

    return original === confirmacion ? null : { passwordsMismatch: true };
  };
}
