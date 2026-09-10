import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { urlDe } from './api.config';
import type { NuevaPersona, Persona } from './persona.model';

/**
 * Las llamadas HTTP contra el backend de Spring Boot.
 * Las URLs salen de `api.config.ts` — acá no hay nada hardcodeado.
 */
@Injectable({ providedIn: 'root' })
export class PersonaService {
  private readonly http = inject(HttpClient);

  /** GET listarPersonas */
  listar(): Observable<Persona[]> {
    return this.http.get<Persona[]>(urlDe('listarPersonas'));
  }

  /** POST crearPersona */
  crear(persona: NuevaPersona): Observable<Persona> {
    return this.http.post<Persona>(urlDe('crearPersona'), persona);
  }
}
