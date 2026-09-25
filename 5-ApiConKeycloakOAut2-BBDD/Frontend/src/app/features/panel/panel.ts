import { DatePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';

import { AuthService } from '../../core/auth/auth.service';
import { PRODUCT_NAME } from '../../core/config/product';
import { SessionService } from '../../core/session/session.service';
import { SiRol } from '../../shared/directives/si-rol.directive';

/**
 * Inicio de la app autenticada (se renderiza dentro de `AppShell`).
 * - Usuario y rol: `SessionService` (`GET /panel/me`). El rol NO se lee del token.
 * - Contenido: por ahora un estado vacío; las secciones del dominio llegan después.
 */
@Component({
  selector: 'app-panel',
  imports: [DatePipe, SiRol],
  templateUrl: './panel.html',
  styleUrl: './panel.css',
})
export class Panel {
  private readonly auth = inject(AuthService);
  protected readonly session = inject(SessionService);

  protected readonly productName = PRODUCT_NAME;

  /** Nombre a mostrar: el que informa la API; mientras responde, el del token. */
  protected readonly displayName = computed(
    () => this.session.user()?.username ?? this.auth.user()?.username ?? '',
  );

  protected readonly today = new Date();
}
