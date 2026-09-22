import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import {
  AuthApiResponse,
  LoginRequest,
  RegisterApiResponse,
  RegisterRequest,
  Session,
} from '../models/auth.models';
import { apiBaseUrl } from '../config/api.config';
import { SessionStorageService } from './session-storage.service';
import { mapAuthResponse } from './auth-response.mapper';

/**
 * Estado de sesión de la aplicación.
 *
 * Es la única fuente de verdad: guards, interceptor y componentes leen de acá.
 * El estado se expone con signals de solo lectura; para cambiarlo hay que
 * pasar por `login()` / `logout()`.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly storage = inject(SessionStorageService);

  /** Raíz de los endpoints de autenticación, armada desde el environment. */
  private readonly authUrl = `${apiBaseUrl()}/auth`;

  /** Se hidrata desde localStorage para que un F5 no cierre la sesión. */
  private readonly sessionState = signal<Session | null>(this.storage.read());

  readonly session = this.sessionState.asReadonly();
  readonly user = computed(() => this.sessionState()?.user ?? null);
  readonly isAuthenticated = computed(() => this.sessionState() !== null);

  /** Token actual, para el interceptor. `null` si no hay sesión. */
  get token(): string | null {
    return this.sessionState()?.token ?? null;
  }

  /**
   * `POST /auth/login`. Si sale bien, deja la sesión iniciada antes de emitir.
   * Los errores se propagan tal cual: cada pantalla los traduce con
   * `toUserMessage()` según su contexto.
   */
  login(credenciales: LoginRequest): Observable<Session> {
    return this.http.post<AuthApiResponse>(`${this.authUrl}/login`, credenciales).pipe(
      map((respuesta) => mapAuthResponse(respuesta, credenciales.username)),
      tap((session) => this.iniciarSesion(session)),
    );
  }

  /**
   * `POST /auth/register`. No inicia sesión a propósito: el flujo pedido es
   * registrarse y después pasar por el login.
   */
  register(datos: RegisterRequest): Observable<RegisterApiResponse> {
    return this.http.post<RegisterApiResponse>(`${this.authUrl}/register`, datos);
  }

  /** Cierra la sesión local. No hace pedido al backend (el JWT es stateless). */
  logout(): void {
    this.sessionState.set(null);
    this.storage.clear();
  }

  private iniciarSesion(session: Session): void {
    this.sessionState.set(session);
    this.storage.save(session);
  }
}
