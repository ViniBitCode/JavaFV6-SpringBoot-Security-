import { Component, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';

import { Personas } from './features/personas/personas';

@Component({
  selector: 'app-root',
  imports: [MatIconModule, MatTabsModule, MatToolbarModule, Personas],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('Padrón');
}
