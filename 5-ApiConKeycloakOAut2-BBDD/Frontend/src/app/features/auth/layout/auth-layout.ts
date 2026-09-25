import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

import { PRODUCT_NAME } from '../../../core/config/product';
import { Brand } from '../../../shared/ui/brand/brand';
import { PitchBackdrop } from '../../../shared/ui/pitch/pitch-backdrop';

/** Marco de las pantallas públicas: fondo con líneas de cancha, marca, tarjeta centrada y pie. */
@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet, RouterLink, Brand, PitchBackdrop],
  templateUrl: './auth-layout.html',
  styleUrl: './auth-layout.css',
})
export class AuthLayout {
  protected readonly productName = PRODUCT_NAME;
  protected readonly year = new Date().getFullYear();
}
