import { Directive, TemplateRef, ViewContainerRef, effect, inject, input } from '@angular/core';
import { PerfilService } from '../../core/auth/perfil.service';

/**
 * Muestra el contenido solo si el usuario tiene alguno de los roles indicados.
 *
 *     <section *appSiRol="'ADMIN'"> ... </section>
 *     <section *appSiRol="['ADMIN', 'USER']"> ... </section>
 *
 * ⚠️  ESTO ES EXPERIENCIA DE USUARIO, NO SEGURIDAD. Esconder un bloque solo
 * evita ofrecer una puerta que no se puede abrir: cualquiera puede mostrarlo
 * desde las herramientas del navegador. Lo que protege de verdad es el
 * backend, que valida el token y los roles en cada pedido.
 *
 * El rol sale del perfil (`GET /panel/me`), no del token: el backend ya
 * resolvió la jerarquía y el front no conoce los roles técnicos de Keycloak.
 */
@Directive({
  selector: '[appSiRol]',
})
export class SiRolDirective {
  private readonly perfil = inject(PerfilService);
  private readonly plantilla = inject(TemplateRef<unknown>);
  private readonly contenedor = inject(ViewContainerRef);

  /** Un rol o una lista. Alcanza con cumplir uno. */
  readonly appSiRol = input.required<string | readonly string[]>();

  /** `true` mientras el perfil no cargó: evita el parpadeo de la sección. */
  private dibujado = false;

  constructor() {
    effect(() => {
      const permitidos = this.appSiRol();
      const actual = this.perfil.role();

      const lista = typeof permitidos === 'string' ? [permitidos] : permitidos;
      const debeVerse = actual !== null && lista.includes(actual);

      // Se compara con lo que ya está dibujado para no recrear la vista (y
      // perder el estado de lo que haya adentro) en cada recálculo.
      if (debeVerse === this.dibujado) {
        return;
      }

      if (debeVerse) {
        this.contenedor.createEmbeddedView(this.plantilla);
      } else {
        this.contenedor.clear();
      }
      this.dibujado = debeVerse;
    });
  }
}
