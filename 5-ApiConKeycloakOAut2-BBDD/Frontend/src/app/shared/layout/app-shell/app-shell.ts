import { Component, ElementRef, computed, inject, signal, viewChild } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { AuthService } from '../../../core/auth/auth.service';
import { SessionService } from '../../../core/session/session.service';
import { Avatar } from '../../ui/avatar/avatar';
import { Brand } from '../../ui/brand/brand';

/** Ítem de la navegación principal. Agregar acá las secciones futuras. */
interface NavItem {
  label: string;
  path: string;
}

/**
 * Estructura de la app autenticada: barra superior (marca + menú de usuario
 * con "Cerrar sesión"), navegación principal (barra lateral en escritorio,
 * menú inferior en mobile) y el área de contenido con el router-outlet.
 */
@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, Brand, Avatar],
  templateUrl: './app-shell.html',
  styleUrl: './app-shell.css',
  host: {
    '(document:click)': 'onDocumentClick($event)',
    '(document:keydown.escape)': 'closeMenu()',
  },
})
export class AppShell {
  private readonly auth = inject(AuthService);
  private readonly session = inject(SessionService);

  private readonly userMenu = viewChild<ElementRef<HTMLElement>>('userMenu');

  protected readonly navItems: NavItem[] = [{ label: 'Inicio', path: '/panel' }];

  /** Nombre a mostrar: el que informa la API; mientras responde, el del token. */
  protected readonly displayName = computed(
    () => this.session.user()?.username ?? this.auth.user()?.username ?? '',
  );

  protected readonly email = computed(() => this.auth.user()?.email ?? '');

  protected readonly menuOpen = signal(false);

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }

  protected onDocumentClick(event: MouseEvent): void {
    const container = this.userMenu()?.nativeElement;
    if (this.menuOpen() && container && !container.contains(event.target as Node)) {
      this.closeMenu();
    }
  }

  protected async logout(): Promise<void> {
    this.closeMenu();
    await this.auth.logout();
  }
}
