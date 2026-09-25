/** Forma que deben respetar todos los archivos de environment. */
export interface AppEnvironment {
  readonly production: boolean;
  /** URL base de la API REST, sin barra final. */
  readonly apiBaseUrl: string;
}
