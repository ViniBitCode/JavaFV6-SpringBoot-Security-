/**
 * Modelos de la administración de usuarios.
 *
 * Misma separación que en `auth.models.ts`: lo que llega por HTTP va por un
 * lado y lo que usa la app por otro, con el mapeo en el servicio.
 */

/**
 * Un usuario tal como lo devuelve `GET /panel/users`, espejo del `UserInfoDTO`
 * del backend:
 *
 *     GET /panel/users      (Authorization: Bearer, rol ADMIN)
 *     200 [ { "username": "facu", "email": "f@mail.com", "role": "ADMIN" }, ... ]
 *
 * Los campos son opcionales porque esto es JSON de la red: lo que garantiza
 * que estén es la normalización del servicio, no el tipo.
 */
export interface UserApiItem {
  username?: string;
  email?: string;
  role?: string;
}

/**
 * Un usuario ya normalizado, que es lo que consume la tabla.
 *
 * No hay `id`: el DTO no lo expone, y como `username` es único en la base
 * (`@Column(unique = true)`) alcanza para identificar la fila.
 */
export interface UserSummary {
  readonly username: string;
  readonly email: string | null;
  /** Rol sin el prefijo `ROLE_`, o `null` si la API no lo informó. */
  readonly role: string | null;
}
