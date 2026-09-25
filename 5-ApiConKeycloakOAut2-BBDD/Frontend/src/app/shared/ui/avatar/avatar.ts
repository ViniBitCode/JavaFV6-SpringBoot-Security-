import { Component, computed, input } from '@angular/core';

/** Avatar con las iniciales del nombre (hasta dos letras). */
@Component({
  selector: 'app-avatar',
  template: `
    <span class="avatar" [class.avatar--lg]="size() === 'lg'" [attr.aria-label]="name()" role="img">
      {{ initials() }}
    </span>
  `,
  styles: `
    .avatar {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 2.125rem;
      height: 2.125rem;
      border-radius: var(--radius-full);
      background: var(--color-accent-subtle);
      color: var(--color-accent-subtle-fg);
      font-size: var(--text-xs);
      font-weight: var(--weight-semibold);
      letter-spacing: 0.02em;
      text-transform: uppercase;
      user-select: none;
      flex-shrink: 0;
    }
    .avatar--lg {
      width: 3rem;
      height: 3rem;
      font-size: var(--text-md);
    }
  `,
})
export class Avatar {
  readonly name = input.required<string>();
  readonly size = input<'md' | 'lg'>('md');

  protected readonly initials = computed(() => {
    const parts = this.name().trim().split(/[\s._-]+/).filter(Boolean);
    if (parts.length === 0) {
      return '?';
    }
    if (parts.length === 1) {
      return parts[0].slice(0, 2);
    }
    return parts[0].charAt(0) + parts[parts.length - 1].charAt(0);
  });
}
