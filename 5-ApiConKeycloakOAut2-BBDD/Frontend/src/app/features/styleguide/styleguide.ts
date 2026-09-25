import { DOCUMENT } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { PRODUCT_NAME } from '../../core/config/product';
import { Avatar } from '../../shared/ui/avatar/avatar';
import { Brand } from '../../shared/ui/brand/brand';
import { FieldError } from '../../shared/ui/field-error/field-error';
import { PasswordField } from '../../shared/ui/password-field/password-field';
import { SocialButtons } from '../../shared/ui/social-buttons/social-buttons';

type ThemeChoice = 'system' | 'light' | 'dark';

interface TokenSample {
  name: string;
  label: string;
}

/**
 * Guía de estilos: muestra los tokens y los componentes base en sus estados.
 * Sirve como referencia para el futuro tema de Keycloak.
 */
@Component({
  selector: 'app-styleguide',
  imports: [ReactiveFormsModule, RouterLink, Brand, Avatar, FieldError, PasswordField, SocialButtons],
  templateUrl: './styleguide.html',
  styleUrl: './styleguide.css',
})
export class Styleguide {
  private readonly document = inject(DOCUMENT);

  protected readonly productName = PRODUCT_NAME;

  protected readonly theme = signal<ThemeChoice>('system');

  protected readonly themes: { value: ThemeChoice; label: string }[] = [
    { value: 'system', label: 'Sistema' },
    { value: 'light', label: 'Claro' },
    { value: 'dark', label: 'Oscuro' },
  ];

  protected setTheme(choice: ThemeChoice): void {
    this.theme.set(choice);
    const root = this.document.documentElement;
    if (choice === 'system') {
      delete root.dataset['theme'];
    } else {
      root.dataset['theme'] = choice;
    }
  }

  protected readonly neutralColors: TokenSample[] = [
    { name: '--color-bg', label: 'Fondo' },
    { name: '--color-surface', label: 'Superficie' },
    { name: '--color-surface-2', label: 'Superficie 2' },
    { name: '--color-surface-3', label: 'Superficie 3' },
    { name: '--color-border', label: 'Borde' },
    { name: '--color-border-strong', label: 'Borde fuerte' },
    { name: '--color-text', label: 'Texto' },
    { name: '--color-text-muted', label: 'Texto atenuado' },
    { name: '--color-text-subtle', label: 'Texto sutil' },
  ];

  protected readonly accentColors: TokenSample[] = [
    { name: '--color-accent', label: 'Acento' },
    { name: '--color-accent-hover', label: 'Acento hover' },
    { name: '--color-accent-active', label: 'Acento activo' },
    { name: '--color-accent-subtle', label: 'Acento suave' },
    { name: '--color-link', label: 'Enlace' },
  ];

  protected readonly semanticColors: TokenSample[] = [
    { name: '--color-success', label: 'Éxito' },
    { name: '--color-success-subtle', label: 'Éxito suave' },
    { name: '--color-warning', label: 'Advertencia' },
    { name: '--color-warning-subtle', label: 'Advertencia suave' },
    { name: '--color-danger', label: 'Peligro' },
    { name: '--color-danger-subtle', label: 'Peligro suave' },
    { name: '--color-info', label: 'Información' },
    { name: '--color-info-subtle', label: 'Información suave' },
  ];

  protected readonly typeScale: TokenSample[] = [
    { name: '--text-4xl', label: '44px' },
    { name: '--text-3xl', label: '36px' },
    { name: '--text-2xl', label: '28px' },
    { name: '--text-xl', label: '22px' },
    { name: '--text-lg', label: '18px' },
    { name: '--text-md', label: '16px' },
    { name: '--text-sm', label: '14px' },
    { name: '--text-xs', label: '12px' },
  ];

  protected readonly spacing: TokenSample[] = [
    { name: '--space-1', label: '4px' },
    { name: '--space-2', label: '8px' },
    { name: '--space-3', label: '12px' },
    { name: '--space-4', label: '16px' },
    { name: '--space-6', label: '24px' },
    { name: '--space-8', label: '32px' },
    { name: '--space-12', label: '48px' },
  ];

  protected readonly radii: TokenSample[] = [
    { name: '--radius-sm', label: '6px' },
    { name: '--radius-md', label: '10px' },
    { name: '--radius-lg', label: '14px' },
    { name: '--radius-xl', label: '20px' },
    { name: '--radius-full', label: 'circular' },
  ];

  protected readonly shadows: TokenSample[] = [
    { name: '--shadow-sm', label: 'Pequeña' },
    { name: '--shadow-md', label: 'Media' },
    { name: '--shadow-lg', label: 'Grande' },
  ];

  /* Controles de demostración para los inputs */
  protected readonly inputDefault = new FormControl('', { nonNullable: true });
  protected readonly inputFilled = new FormControl('facundo', { nonNullable: true });
  protected readonly inputInvalid = new FormControl('correo-invalido', { nonNullable: true });
  protected readonly inputDisabled = new FormControl({ value: 'No editable', disabled: true }, { nonNullable: true });
  protected readonly inputPassword = new FormControl('Secreta123!', { nonNullable: true });

  protected cssVar(name: string): string {
    return `var(${name})`;
  }
}
