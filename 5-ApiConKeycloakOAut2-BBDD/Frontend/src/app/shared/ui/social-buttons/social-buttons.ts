import { Component } from '@angular/core';

/**
 * Botones "Continuar con Google / GitHub".
 * Solo maquetado: no tienen funcionalidad. Con Keycloak, estos proveedores se
 * configuran como Identity Providers del realm y los botones los renderiza el
 * propio tema de Keycloak.
 */
@Component({
  selector: 'app-social-buttons',
  template: `
    <div class="social">
      <button type="button" class="btn btn--secondary" (click)="notImplemented()">
        <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18">
          <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.7-2.4 3.6v3h3.9c2.2-2.1 3.5-5.1 3.5-8.8z"/>
          <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-2.9l-3.9-3c-1.1.7-2.5 1.2-4.1 1.2-3.1 0-5.8-2.1-6.7-5H1.2v3.1C3.2 21.3 7.3 24 12 24z"/>
          <path fill="#FBBC05" d="M5.3 14.3c-.5-1.5-.5-3.1 0-4.6V6.6H1.2c-1.6 3.3-1.6 7.5 0 10.8l4.1-3.1z"/>
          <path fill="#EA4335" d="M12 4.7c1.7 0 3.3.6 4.5 1.8l3.4-3.4C17.9 1.2 15.1 0 12 0 7.3 0 3.2 2.7 1.2 6.6l4.1 3.1c.9-2.9 3.6-5 6.7-5z"/>
        </svg>
        Continuar con Google
      </button>

      <button type="button" class="btn btn--secondary" (click)="notImplemented()">
        <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
          <path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.7 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3z"/>
        </svg>
        Continuar con GitHub
      </button>
    </div>
  `,
  styles: `
    .social {
      display: grid;
      gap: var(--space-3);
      grid-template-columns: 1fr;
    }
    .social .btn { min-width: 0; }
  `,
})
export class SocialButtons {
  protected notImplemented(): void {
    // Intencionalmente vacío: en esta etapa los proveedores externos no hacen nada.
  }
}
