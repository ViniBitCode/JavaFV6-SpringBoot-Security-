import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Política de contraseñas.
 *
 * Está escrita como una lista de reglas independientes (no como una sola
 * expresión regular) por dos motivos:
 *
 *  1. El validador informa QUÉ regla falló, no solo que "algo" falló.
 *  2. La pantalla de registro dibuja la checklist recorriendo la misma lista,
 *     así que la política vive en un solo lugar: si se agrega una regla acá,
 *     aparece sola en la interfaz.
 */

export type ReglaId = 'longitud' | 'mayuscula' | 'numero' | 'especial';

export interface ReglaDeContrasena {
  readonly id: ReglaId;
  /** Texto que se muestra en la checklist. */
  readonly etiqueta: string;
  readonly cumple: (valor: string) => boolean;
}

export const LARGO_MINIMO = 10;

export const REGLAS_DE_CONTRASENA: readonly ReglaDeContrasena[] = [
  {
    id: 'longitud',
    etiqueta: `Al menos ${LARGO_MINIMO} caracteres`,
    cumple: (valor) => valor.length >= LARGO_MINIMO,
  },
  {
    id: 'mayuscula',
    etiqueta: 'Una letra mayúscula',
    cumple: (valor) => /[A-ZÁÉÍÓÚÜÑ]/.test(valor),
  },
  {
    id: 'numero',
    etiqueta: 'Un número',
    cumple: (valor) => /[0-9]/.test(valor),
  },
  {
    id: 'especial',
    etiqueta: 'Un carácter especial (!@#$%…)',
    // Cualquier cosa que no sea letra, número ni espacio.
    cumple: (valor) => /[^\p{L}\p{N}\s]/u.test(valor),
  },
];

/** Estado de una regla para la checklist de la interfaz. */
export interface EstadoDeRegla {
  readonly id: ReglaId;
  readonly etiqueta: string;
  readonly cumplida: boolean;
}

/** Evalúa todas las reglas contra un valor. Lo usa la vista, en vivo. */
export function evaluarReglas(valor: string): readonly EstadoDeRegla[] {
  return REGLAS_DE_CONTRASENA.map((regla) => ({
    id: regla.id,
    etiqueta: regla.etiqueta,
    cumplida: regla.cumple(valor),
  }));
}

/** Forma del error que publica el validador. */
export interface ErrorDePolitica {
  /** Ids de las reglas que NO se cumplen. */
  readonly incumplidas: readonly ReglaId[];
}

/**
 * Validador de la política. Devuelve `{ passwordPolicy: { incumplidas: [...] } }`
 * para que quien lo necesite sepa exactamente qué falta.
 *
 * El campo vacío no se marca acá: de eso se encarga `Validators.required`.
 */
export const passwordPolicyValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const valor = typeof control.value === 'string' ? control.value : '';

  if (valor.length === 0) {
    return null;
  }

  const incumplidas = REGLAS_DE_CONTRASENA.filter((regla) => !regla.cumple(valor)).map(
    (regla) => regla.id,
  );

  return incumplidas.length > 0
    ? { passwordPolicy: { incumplidas } satisfies ErrorDePolitica }
    : null;
};
