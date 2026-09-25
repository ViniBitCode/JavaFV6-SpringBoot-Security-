import { Directive, TemplateRef, ViewContainerRef, effect, inject, input } from '@angular/core';

import { Rol } from '../../core/session/session.models';
import { SessionService } from '../../core/session/session.service';

/**
 * Muestra el bloque solo si el rol de la sesión (según `GET /panel/me`) está
 * entre los permitidos. Acepta un rol o una lista:
 *
 *   <button *appSiRol="'ADMIN'">Solo administradores</button>
 *   <section *appSiRol="['ADMIN', 'USER']">…</section>
 *
 * IMPORTANTE: ocultar en el front es solo experiencia de usuario. La seguridad
 * la aplica la API validando el token en cada petición; cualquiera puede
 * saltarse esta directiva desde las herramientas del navegador.
 */
@Directive({ selector: '[appSiRol]' })
export class SiRol {
  private readonly session = inject(SessionService);
  private readonly template = inject(TemplateRef<unknown>);
  private readonly container = inject(ViewContainerRef);

  readonly appSiRol = input.required<Rol | readonly Rol[]>();

  private rendered = false;

  constructor() {
    effect(() => {
      const allowed = this.appSiRol();
      const roles = Array.isArray(allowed) ? allowed : [allowed as Rol];
      const rol = this.session.rol();
      this.toggle(rol !== null && roles.includes(rol));
    });
  }

  private toggle(show: boolean): void {
    if (show === this.rendered) {
      return;
    }
    if (show) {
      this.container.createEmbeddedView(this.template);
    } else {
      this.container.clear();
    }
    this.rendered = show;
  }
}
