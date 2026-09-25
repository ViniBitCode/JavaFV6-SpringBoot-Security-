import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Reglas de la contraseña. Cada una se evalúa por separado para poder informar
 * exactamente cuál falló (y marcarla en la lista de requisitos en tiempo real).
 */
export type PasswordRuleKey = 'minLength' | 'uppercase' | 'number' | 'special';

export interface PasswordRule {
  key: PasswordRuleKey;
  label: string;
  test: (value: string) => boolean;
}

export const PASSWORD_MIN_LENGTH = 10;

export const PASSWORD_RULES: readonly PasswordRule[] = [
  {
    key: 'minLength',
    label: `Al menos ${PASSWORD_MIN_LENGTH} caracteres`,
    test: (value) => value.length >= PASSWORD_MIN_LENGTH,
  },
  {
    key: 'uppercase',
    label: 'Una letra mayúscula',
    test: (value) => /[A-ZÁÉÍÓÚÑÜ]/.test(value),
  },
  {
    key: 'number',
    label: 'Un número',
    test: (value) => /\d/.test(value),
  },
  {
    key: 'special',
    label: 'Un carácter especial (por ejemplo ! @ # $ %)',
    test: (value) => /[^\p{L}\p{N}\s]/u.test(value),
  },
];

export type PasswordRuleStatus = Record<PasswordRuleKey, boolean>;

/** Evalúa cada regla contra el valor y devuelve cuáles se cumplen. */
export function checkPasswordRules(value: string | null | undefined): PasswordRuleStatus {
  const text = value ?? '';
  return PASSWORD_RULES.reduce((status, rule) => {
    status[rule.key] = rule.test(text);
    return status;
  }, {} as PasswordRuleStatus);
}

/** Forma del error que deja el validador en el control. */
export interface PasswordStrengthError {
  failed: PasswordRuleKey[];
}

/**
 * Validador de fortaleza de contraseña.
 * Devuelve `{ passwordStrength: { failed: [...] } }` con las reglas que fallaron,
 * o `null` si se cumplen todas. Un valor vacío se considera válido para este
 * validador: de eso se ocupa `Validators.required`.
 */
export function passwordStrengthValidator(): ValidatorFn {
  return (control: AbstractControl<string | null>): ValidationErrors | null => {
    const value = control.value ?? '';
    if (value === '') {
      return null;
    }

    const status = checkPasswordRules(value);
    const failed = PASSWORD_RULES.filter((rule) => !status[rule.key]).map((rule) => rule.key);

    if (failed.length === 0) {
      return null;
    }

    const error: PasswordStrengthError = { failed };
    return { passwordStrength: error };
  };
}
