import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  AuthError,
  Credentials,
  NewUser,
  Session,
  SessionInfo,
  detalleDelError,
} from './auth.models';

/**
 * Endpoint de login de tu backend: POST /auth/login (clase Auth.java).
 * En desarrollo la URL final queda http://localhost:4200/api/auth/login y el
 * proxy la reenvía a http://localhost:8080/auth/login.
 */
const LOGIN_ENDPOINT = '/auth/login';
const REGISTER_ENDPOINT = '/auth/register';

/*
 * CÓMO RESPONDE TU BACKEND (verificado el 21/09/2026):
 *
 *   POST /auth/login     credenciales correctas  -> 200 + { username, role }
 *                        contraseña incorrecta   -> 401 "Usuario o contraseña incorrectos"
 *                        usuario inexistente     -> 401 (mismo mensaje)
 *   POST /auth/register   alta correcta          -> 201 + el username
 *                        username repetido       -> 409
 *                        el rol no existe        -> 404
 *
 * El 401 sale de authenticationManager.authenticate(), que lanza una
 * AuthenticationException, y de tu @ExceptionHandler en GlobalExceptionHandler.
 *
 * Los demás controllers siguen en @PreAuthorize("denyAll()"), así que por
 * ahora el front solo puede hablar con /auth.
 */

const STORAGE_KEY = 'sec-admin:session';

/**
 * Arma el header HTTP Basic: "Basic " + base64(usuario:contraseña).
 * Tu SecurityConfig sigue usando httpBasic(), así que cuando vuelvas a abrir
 * los endpoints protegidos, esta es la forma en que el front se identifica.
 * Lo guardamos en la sesión y el interceptor lo manda solo.
 */
function toBasicHeader(username: string, password: string): string {
  const bytes = new TextEncoder().encode(`${username}:${password}`);
  let binary = '';
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return `Basic ${btoa(binary)}`;
}

/** Recupera la sesión si el usuario ya se había logueado antes. */
function restoreSession(): Session | null {
  const raw = localStorage.getItem(STORAGE_KEY) ?? sessionStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as Session;
  } catch {
    return null;
  }
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);

  /** Estado privado: solo este servicio puede escribir la sesión. */
  private readonly session = signal<Session | null>(restoreSession());

  /** Lecturas públicas para los componentes y el guard. */
  readonly username = computed(() => this.session()?.username ?? null);
  readonly isLoggedIn = computed(() => this.session() !== null);

  /** Rol del que entró, tal como lo mandó el backend ('USER' | 'ADMIN'). */
  readonly role = computed(() => this.session()?.role ?? null);

  /**
   * Solo sirve para decidir QUÉ DIBUJAR. No protege nada: quien corta el
   * acceso de verdad es el @PreAuthorize("hasRole('ADMIN')") del backend.
   */
  readonly isAdmin = computed(() => this.role() === 'ADMIN');

  /** El interceptor lee esto para firmar cada petición. */
  authHeader(): string | null {
    return this.session()?.basic ?? null;
  }

  /**
   * Manda usuario y contraseña a POST /auth/login.
   *
   * El cuerpo que viaja es { "username": "...", "password": "..." }, que es
   * lo que tu @RequestBody UserSecurity espera (los campos que no mando
   * quedan en su valor por defecto, no molestan).
   */
  login({ username, password, remember }: Credentials): Observable<Session> {
    // post<SessionInfo> le dice a Angular qué forma tiene la respuesta que espera.
    return this.http
      .post<SessionInfo>(environment.apiUrl + LOGIN_ENDPOINT, { username, password })
      .pipe(
        // 200 OK => entra. Guardo el rol que me dijo el backend.
        map((info) =>
          this.openSession(
            { username: info.username, role: info.role, basic: toBasicHeader(username, password) },
            remember,
          ),
        ),

        catchError((error: HttpErrorResponse) => {
          // status 0 = la petición ni salió: backend apagado, puerto mal o
          // proxy mal configurado. No es culpa de la contraseña.
          if (error.status === 0) {
            return throwError(
              () =>
                new AuthError('No se pudo contactar al backend. ¿Está levantado Spring Boot?', 0),
            );
          }

          // 401 = credenciales incorrectas (tu AuthenticationException).
          // 404 = el usuario no existe. Mismo mensaje para los dos: así no
          // le regalamos a nadie la pista de qué usuarios existen.
          if (error.status === 404 || error.status === 401) {
            return throwError(
              () => new AuthError('Usuario o contraseña incorrectos.', error.status),
            );
          }

          if (error.status === 403) {
            return throwError(
              () => new AuthError('Tu usuario no tiene permiso para entrar acá.', 403),
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
   * Crea una cuenta nueva: POST /auth/register.
   *
   * El cuerpo que viaja es { username, password, roleName }, que es
   * exactamente lo que espera tu record RegisterRequest.
   * Ojo: esto NO deja la sesión abierta, solo crea el usuario. Después el
   * componente manda al login para que entre con sus datos.
   */
  register(username: string, password: string): Observable<string> {
    const nuevo: NewUser = { username, password };

    return this.http
      .post(environment.apiUrl + REGISTER_ENDPOINT, nuevo, { responseType: 'text' })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 0) {
            return throwError(
              () =>
                new AuthError('No se pudo contactar al backend. ¿Está levantado Spring Boot?', 0),
            );
          }

          // 409 lo tira tu ValorYaExisteException cuando el nombre está tomado.
          if (error.status === 409) {
            return throwError(() => new AuthError('Ese nombre de usuario ya está en uso.', 409));
          }

          // 404 = EntidadNoEncontradaException: el rol USER no está cargado en la base.
          if (error.status === 404) {
            return throwError(
              () =>
                new AuthError('No existe el rol USER en la base de datos.', 404),
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

  logout(): void {
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
    this.session.set(null);
  }

  /**
   * Guarda la sesión.
   * localStorage sobrevive al cierre del navegador ("mantener sesión abierta");
   * sessionStorage se borra al cerrar la pestaña.
   *
   * NOTA DE SEGURIDAD: acá guardo las credenciales en base64, que es
   * reversible. Sirve para practicar, no para producción. Cuando pases a JWT
   * guardás el token (que expira) en lugar de esto.
   */
  private openSession(session: Session, remember: boolean): Session {
    const store = remember ? localStorage : sessionStorage;
    store.setItem(STORAGE_KEY, JSON.stringify(session));
    this.session.set(session);
    return session;
  }
}
