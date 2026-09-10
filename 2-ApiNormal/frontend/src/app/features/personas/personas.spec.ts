import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideNativeDateAdapter } from '@angular/material/core';

import { Personas } from './personas';

describe('Personas', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Personas],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideNativeDateAdapter(),
      ],
    }).compileComponents();
  });

  it('renderiza los cuatro campos del formulario', async () => {
    const fixture = TestBed.createComponent(Personas);
    await fixture.whenStable();

    const html = fixture.nativeElement as HTMLElement;
    const etiquetas = [...html.querySelectorAll('mat-label')].map((l) => l.textContent?.trim());

    expect(etiquetas).toEqual(['Nombre', 'Apellido', 'Email', 'Fecha de nacimiento']);
    expect(html.querySelector('mat-datepicker-toggle')).toBeTruthy();
  });

  it('avisa cuando los endpoints todavía no están configurados', async () => {
    const fixture = TestBed.createComponent(Personas);
    await fixture.whenStable();

    const html = fixture.nativeElement as HTMLElement;
    expect(html.textContent).toContain('Falta enchufar el backend');
  });
});
