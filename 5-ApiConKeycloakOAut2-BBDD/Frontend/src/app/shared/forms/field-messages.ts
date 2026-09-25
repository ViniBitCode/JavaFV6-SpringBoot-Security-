import { AbstractControl } from '@angular/forms';

/** Mapa de clave de error de Angular Forms → mensaje para el usuario. */
export type FieldMessages = Record<string, string>;

/**
 * Devuelve el mensaje del primer error del control que tenga texto asociado,
 * o `null` si el control es válido o no hay mensaje para sus errores.
 */
export function firstErrorMessage(control: AbstractControl, messages: FieldMessages): string | null {
  const errors = control.errors;
  if (!errors) {
    return null;
  }

  for (const key of Object.keys(errors)) {
    const message = messages[key];
    if (message) {
      return message;
    }
  }

  return null;
}

/**
 * Regla de visibilidad de errores: solo después de que el usuario interactuó
 * con el campo (blur) o intentó enviar el formulario (`markAllAsTouched()`).
 */
export function shouldShowError(control: AbstractControl): boolean {
  return control.invalid && control.touched;
}
