import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthError, detalleDelError } from '../auth/auth.models';

/**
 * Una fila de la lista de usuarios.
 * Tiene que coincidir con tu record UserInfoDTO: { username, role }.
 */
export interface UserInfo {
  username: string;
  role: string;
}

/** GET /panel — la lista. DELETE /panel/{username} — el borrado (solo ADMIN). */
const PANEL_ENDPOINT = '/panel';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly http = inject(HttpClient);

  /**
   * Pide la lista de usuarios.
   *
   * Fijate que acá NO armo ningún header de autenticación: el endpoint pide
   * estar logueado, pero de eso se encarga solo el interceptor
   * (auth-interceptor.ts), que le pega el Authorization a toda petición.
   */
  list(): Observable<UserInfo[]> {
    return this.http.get<UserInfo[]>(environment.apiUrl + PANEL_ENDPOINT).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 0) {
          return throwError(
            () => new AuthError('No se pudo contactar al backend. ¿Está levantado Spring Boot?', 0),
          );
        }

        // 401 = el backend no aceptó las credenciales guardadas.
        if (error.status === 401) {
          return throwError(
            () => new AuthError('Tu sesión no es válida. Volvé a iniciar sesión.', 401),
          );
        }

        // 403 = está logueado pero su rol no alcanza para este endpoint.
        if (error.status === 403) {
          return throwError(
            () => new AuthError('Tu rol no tiene permiso para ver esta lista.', 403),
          );
        }

        return throwError(
          () =>
            new AuthError(
              `El backend respondió ${error.status}: ${detalleDelError(error)}`,
              error.status,
            ),
        );
      }),
    );
  }
  /**
   * Borra un usuario: DELETE /panel/{username}.
   *
   * El backend solo deja hacerlo si el que pide es ADMIN. Si un USER lo
   * intenta (por ejemplo desde la terminal), Spring corta con 403 antes de
   * que se ejecute una sola línea de tu código.
   */
  remove(username: string): Observable<unknown> {
    return this.http
      .delete(`${environment.apiUrl}${PANEL_ENDPOINT}/${encodeURIComponent(username)}`, {
        // El endpoint devuelve el cuerpo vacío, y los errores en texto plano.
        responseType: 'text',
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 0) {
            return throwError(
              () =>
                new AuthError('No se pudo contactar al backend. ¿Está levantado Spring Boot?', 0),
            );
          }

          // 403 = tu @PreAuthorize("hasRole('ADMIN')") lo frenó.
          if (error.status === 403) {
            return throwError(
              () => new AuthError('Tu rol no tiene permiso para borrar usuarios.', 403),
            );
          }

          // 404 = EntidadNoEncontradaException: ya no estaba.
          if (error.status === 404) {
            return throwError(() => new AuthError(`El usuario "${username}" ya no existe.`, 404));
          }

          // 409 = OperacionNoPermitidaException: se quiso borrar a sí mismo.
          if (error.status === 409) {
            return throwError(() => new AuthError(detalleDelError(error), 409));
          }

          return throwError(
            () =>
              new AuthError(
                `El backend respondió ${error.status}: ${detalleDelError(error)}`,
                error.status,
              ),
          );
        }),
      );
  }
}
