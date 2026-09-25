import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';

import { ApiError } from '../../core/api/api-error';
import { PRODUCT_NAME } from '../../core/config/product';
import { SessionService } from '../../core/session/session.service';
import { SiRol } from '../../shared/directives/si-rol.directive';
import { FieldMessages, firstErrorMessage, shouldShowError } from '../../shared/forms/field-messages';
import { FieldError } from '../../shared/ui/field-error/field-error';
import { TorneosService } from './data/torneos.service';

type TorneoField = 'nombreTorneo' | 'fechaComienzo' | 'fechaFinalizacion' | 'premioGanador';

/**
 * Sección Torneos. Todos ven la lista (`GET /torneos`); solo ADMIN ve el
 * formulario de alta (`POST /torneos`). Ocultar el formulario es solo UX:
 * la API rechaza el POST con 403 si el rol no alcanza.
 */
@Component({
  selector: 'app-torneos',
  imports: [ReactiveFormsModule, DatePipe, DecimalPipe, SiRol, FieldError],
  templateUrl: './torneos.html',
  styleUrl: './torneos.css',
})
export class Torneos {
  protected readonly torneos = inject(TorneosService);
  protected readonly session = inject(SessionService);

  protected readonly productName = PRODUCT_NAME;

  protected readonly formVisible = signal(false);
  protected readonly saving = signal(false);
  protected readonly saveError = signal<ApiError | null>(null);
  protected readonly saved = signal<string | null>(null);

  protected readonly isEmpty = computed(() => this.torneos.loaded() && this.torneos.torneos().length === 0);

  protected readonly form = new FormGroup(
    {
      nombreTorneo: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.maxLength(80)],
      }),
      fechaComienzo: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      fechaFinalizacion: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      premioGanador: new FormControl<number | null>(null, { validators: [Validators.min(0)] }),
    },
    { validators: [fechasOrdenadasValidator] },
  );

  private readonly messages: Record<TorneoField, FieldMessages> = {
    nombreTorneo: { required: 'Ingresá el nombre del torneo.', maxlength: 'Máximo 80 caracteres.' },
    fechaComienzo: { required: 'Ingresá la fecha de comienzo.' },
    fechaFinalizacion: { required: 'Ingresá la fecha de finalización.' },
    premioGanador: { min: 'El premio no puede ser negativo.' },
  };

  protected showError(field: TorneoField): boolean {
    if (field === 'fechaFinalizacion') {
      const control = this.form.controls.fechaFinalizacion;
      return control.touched && (control.invalid || this.form.hasError('fechasDesordenadas'));
    }
    return shouldShowError(this.form.controls[field]);
  }

  protected errorMessage(field: TorneoField): string | null {
    if (!this.showError(field)) {
      return null;
    }
    const own = firstErrorMessage(this.form.controls[field], this.messages[field]);
    if (own) {
      return own;
    }
    if (field === 'fechaFinalizacion' && this.form.hasError('fechasDesordenadas')) {
      return 'La finalización no puede ser anterior al comienzo.';
    }
    return null;
  }

  protected toggleForm(): void {
    this.formVisible.update((visible) => !visible);
    this.saveError.set(null);
    this.saved.set(null);
  }

  protected async submit(): Promise<void> {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.saving()) {
      return;
    }

    const value = this.form.getRawValue();
    this.saving.set(true);
    this.saveError.set(null);
    try {
      await this.torneos.crear({
        nombreTorneo: value.nombreTorneo.trim(),
        fechaComienzo: value.fechaComienzo,
        fechaFinalizacion: value.fechaFinalizacion,
        premioGanador: value.premioGanador,
      });
      this.saved.set(value.nombreTorneo.trim());
      this.form.reset();
      this.formVisible.set(false);
    } catch (error) {
      this.saveError.set(
        ApiError.is(error) ? error : new ApiError('server', 0, 'No se pudo crear el torneo.'),
      );
    } finally {
      this.saving.set(false);
    }
  }
}

/** La fecha de finalización no puede ser anterior a la de comienzo. */
function fechasOrdenadasValidator(group: AbstractControl): ValidationErrors | null {
  const comienzo = group.get('fechaComienzo')?.value as string;
  const fin = group.get('fechaFinalizacion')?.value as string;
  return comienzo && fin && fin < comienzo ? { fechasDesordenadas: true } : null;
}
