/** Persona tal como la devuelve el backend. */
export interface Persona {
  id?: number;
  nombre: string;
  apellido: string;
  email: string;
  /** Formato ISO `yyyy-MM-dd`, compatible con `LocalDate` de Java. */
  fechaNacimiento: string;
}

/** Cuerpo que se manda en el POST de alta (sin id, lo asigna el backend). */
export type NuevaPersona = Omit<Persona, 'id'>;
