import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { environment } from '../environments/environment';
import { KeycloakBootstrapService } from './core/auth/keycloak-bootstrap.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly estado = inject(KeycloakBootstrapService).estado;

  /** Se muestran en el error para que se vea contra qué servidor se intentó. */
  protected readonly servidor = `${environment.keycloak.url}/realms/${environment.keycloak.realm}`;

  protected recargar(): void {
    window.location.reload();
  }
}
