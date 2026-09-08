import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';

import { endpointConfigurado } from '../../core/api.config';
import type { NuevaPersona, Persona } from '../../core/persona.model';
import { PersonaService } from '../../core/persona.service';

@Component({
  selector: 'app-personas',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressBarModule,
    MatTableModule,
  ],
  templateUrl: './personas.html',
  styleUrl: './personas.scss',
})
export class Personas {
  private readonly fb = inject(FormBuilder);
  private readonly personaService = inject(PersonaService);

  /** Nadie nace en el futuro: tope del calendario. */
  protected readonly hoy = new Date();

  /** Se apagan solas si todavía no cargaste la URL en `api.config.ts`. */
  protected readonly puedeListar = endpointConfigurado('listarPersonas');
  protected readonly puedeCrear = endpointConfigurado('crearPersona');

  protected readonly personas = signal<Persona[]>([]);
  protected readonly cargando = signal(false);
  protected readonly guardando = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly exito = signal<string | null>(null);

  protected readonly columnas = ['nombre', 'apellido', 'email', 'fechaNacimiento'];

  protected readonly form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.maxLength(60)]],
    apellido: ['', [Validators.required, Validators.maxLength(60)]],
    email: ['', [Validators.required, Validators.email]],
    fechaNacimiento: this.fb.nonNullable.control<Date | null>(null, Validators.required),
  });

  constructor() {
    if (this.puedeListar) {
      this.cargar();
    }
  }

  protected cargar(): void {
    if (!this.puedeListar || this.cargando()) {
      return;
    }

    this.cargando.set(true);
    this.error.set(null);

    this.personaService.listar().subscribe({
      next: (personas) => {
        this.personas.set(personas ?? []);
        this.cargando.set(false);
      },
      error: (err: unknown) => {
        this.error.set(`No se pudo traer el listado. ${this.mensajeDeError(err)}`);
        this.cargando.set(false);
      },
    });
  }

  protected guardar(): void {
    if (this.guardando()) {
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (!this.puedeCrear) {
      this.error.set(
        'Todavía no configuraste el endpoint "crearPersona" en src/app/core/api.config.ts',
      );
      return;
    }

    const { nombre, apellido, email, fechaNacimiento } = this.form.getRawValue();
    const nueva: NuevaPersona = {
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      email: email.trim(),
      fechaNacimiento: this.aIsoLocal(fechaNacimiento!),
    };

    this.guardando.set(true);
    this.error.set(null);
    this.exito.set(null);

    this.personaService.crear(nueva).subscribe({
      next: (creada) => {
        this.guardando.set(false);
        this.exito.set(`Se guardó ${nueva.nombre} ${nueva.apellido}.`);
        this.form.reset();

        if (this.puedeListar) {
          this.cargar();
        } else {
          this.personas.update((actuales) => [...actuales, creada ?? { ...nueva }]);
        }
      },
      error: (err: unknown) => {
        this.guardando.set(false);
        this.error.set(`No se pudo guardar. ${this.mensajeDeError(err)}`);
      },
    });
  }

  /**
   * `Date` -> `yyyy-MM-dd` usando la fecha local.
   * A propósito no usamos `toISOString()`: convierte a UTC y en Argentina (UTC-3)
   * te corre el cumpleaños un día para atrás.
   */
  private aIsoLocal(fecha: Date): string {
    const anio = fecha.getFullYear();
    const mes = `${fecha.getMonth() + 1}`.padStart(2, '0');
    const dia = `${fecha.getDate()}`.padStart(2, '0');
    return `${anio}-${mes}-${dia}`;
  }

  /** `yyyy-MM-dd` -> `dd/MM/yyyy` para mostrar en la tabla. */
  protected formatearFecha(iso: string): string {
    const [anio, mes, dia] = (iso ?? '').split('-');
    return anio && mes && dia ? `${dia}/${mes}/${anio}` : (iso ?? '');
  }

  private mensajeDeError(err: unknown): string {
    if (err instanceof HttpErrorResponse) {
      if (err.status === 0) {
        return 'El backend no respondió (¿está levantado? ¿falta habilitar CORS?).';
      }
      const detalle =
        typeof err.error === 'string'
          ? err.error
          : (err.error?.message ?? err.error?.error ?? err.message);
      return `HTTP ${err.status}: ${detalle}`;
    }
    return err instanceof Error ? err.message : String(err);
  }
}
