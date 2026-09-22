import { Component, computed, input } from '@angular/core';
import { NoticeTone } from '../../../core/services/notice.service';

/**
 * Aviso de formulario o de pantalla.
 *
 * Los errores usan `role="alert"` (el lector de pantalla interrumpe) y el
 * resto `role="status"` (lo anuncia cuando termina lo que está diciendo).
 */
@Component({
  selector: 'app-alert',
  template: `
    <div
      class="alert"
      [class.alert--danger]="tone() === 'danger'"
      [class.alert--success]="tone() === 'success'"
      [class.alert--warning]="tone() === 'warning'"
      [attr.role]="tone() === 'danger' ? 'alert' : 'status'"
    >
      <span class="alert__icon" aria-hidden="true">{{ icono() }}</span>
      <span class="alert__text"><ng-content /></span>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
  `,
})
export class Alert {
  readonly tone = input<NoticeTone>('danger');

  protected readonly icono = computed(() => {
    switch (this.tone()) {
      case 'success':
        return '✓';
      case 'warning':
        return '▲';
      default:
        return '!';
    }
  });
}
