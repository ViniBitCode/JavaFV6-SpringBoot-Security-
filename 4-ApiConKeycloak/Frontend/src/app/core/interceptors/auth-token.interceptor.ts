import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { esUrlDeLaApi } from '../config/api.config';
import { AuthService } from '../services/auth.service';

/**
 * Agrega `Authorization: Bearer <token>` a los pedidos de nuestra API.
 *
 * Se filtra por URL a propósito: si algún día la app pide algo a un tercero
 * (un CDN, un mapa), no queremos filtrarle el token.
 */
export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthService).token;

  const debeFirmar = token !== null && esUrlDeLaApi(req.url) && !req.headers.has('Authorization');

  if (!debeFirmar) {
    return next(req);
  }

  return next(
    req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    }),
  );
};
