/** Fila de `GET /torneos` (ListaTorneosDTO). Las fechas llegan como ISO `yyyy-MM-dd`. */
export interface Torneo {
  nombreTorneo: string;
  fechaComienzo: string | null;
  fechaFinalizacion: string | null;
  premioGanador: number | null;
  equiposInscriptos: number;
}

/** Cuerpo de `POST /torneos` (AgregarTorneoDTO). Solo ADMIN. */
export interface NuevoTorneo {
  nombreTorneo: string;
  fechaComienzo: string;
  fechaFinalizacion: string;
  premioGanador: number | null;
}
