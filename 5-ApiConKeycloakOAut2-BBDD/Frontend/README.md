# Fuchibol · Frontend

Front en **Angular 22** (standalone components, signals, control flow `@if/@for`, CSS propio) para un **gestor de torneos de fútbol amateur**, integrado con **Keycloak** (OAuth2 / OIDC, Authorization Code + PKCE S256) y con la **API de Spring Boot**.

## Requisitos

- Node 22+ y npm.
- **Keycloak** levantado en `http://localhost:8180` con el realm `segunda-api-keycloak-fuchibol` y el cliente público `angular-app` (ver [Configuración en Keycloak](#configuración-en-keycloak)).
- **API** de Spring Boot levantada en `http://localhost:8080` (carpeta `Backend`), apuntando al mismo realm.

## Cómo levantarlo

```bash
npm install
npm start          # http://localhost:4200
npm run build      # build de producción en dist/frontend
```

## Identidad visual: dónde se cambia cada cosa

| Qué                          | Dónde                                                                                     |
| ---------------------------- | ----------------------------------------------------------------------------------------- |
| Nombre y descripción corta   | `src/app/core/config/product.ts` (`PRODUCT_NAME`, `PRODUCT_TAGLINE`). El `<title>` de `src/index.html` se cambia a mano. |
| Logo                         | `src/app/shared/ui/brand/brand.ts`: el `<svg>` del isotipo (pelota estilizada, dibujada con `currentColor`). |
| Colores, tipografía, medidas | `src/styles/tokens.css`, **única fuente de verdad**. El acento (verde césped) y los semánticos están en bloques propios, en modo claro y en los dos bloques de modo oscuro. |
| Fondo de cancha              | `src/app/shared/ui/pitch/pitch-backdrop.ts` (líneas en SVG). Color y opacidad: tokens `--pitch-line-color` y `--pitch-line-opacity`. |
| Fuente                       | `src/index.html` (Google Fonts, Inter 400–800) y `--font-sans` en `tokens.css`.           |

Utilidades relevantes en `src/styles/base.css`: `.tabular-nums` (números de ancho fijo para marcadores y tablas), `.kicker` (etiqueta en mayúsculas sobre un título) y `.empty` (estado vacío).

Modo claro por defecto; oscuro por `prefers-color-scheme` o forzando `data-theme="dark"` en `<html>`. Todo es responsive mobile-first, con foco visible y contraste AA sobre los tokens definidos.

## Configuración de environments

Los valores viven en `src/environments/`:

| Archivo                      | Cuándo se usa                                  |
| ---------------------------- | ---------------------------------------------- |
| `environment.development.ts` | `npm start` (`ng serve`, vía `fileReplacements`) |
| `environment.ts`             | `npm run build` (producción)                   |

```ts
export const environment = {
  production: false,
  keycloak: {
    url: 'http://localhost:8180',              // SIN /realms/...: la librería arma esa parte
    realm: 'segunda-api-keycloak-fuchibol',
    clientId: 'angular-app',                   // cliente público, PKCE S256, sin secret
  },
  apiUrl: 'http://localhost:8080',             // sin barra final
} as const;
```

- `keycloak.url` va **sin** `/realms/<realm>`.
- `apiUrl` es la única URL a la que se le agrega el token: el interceptor compara la URL de cada petición contra este valor.
- En `environment.ts` los valores son los de desarrollo local; reemplazarlos por las URLs públicas antes de publicar.

## Flujo de autenticación

1. **Arranque**: `provideAuth()` (`core/auth/auth.providers.ts`) registra keycloak-js y, en un `APP_INITIALIZER`, `AuthService.initialize()` sondea el discovery endpoint del realm y luego hace `init` con `check-sso` (recupera la sesión sin redirigir si ya existe) y PKCE S256. Si Keycloak no responde, `status` queda en `unavailable` y la bienvenida muestra el aviso.
2. **Login / registro**: `AuthService.login()` y `register()` redirigen a las pantallas de Keycloak (registro directo con `kc_action=register`). Al volver a `/panel`, keycloak-js procesa el `code` del callback y obtiene los tokens.
3. **Guard**: `authGuard` protege `/panel`. Sin sesión, redirige al login de Keycloak con la URL que se quiso visitar como `redirectUri`.
4. **API**: `includeBearerTokenInterceptor` (keycloak-angular) agrega `Authorization: Bearer <token>` **solo** a las peticiones hacia `environment.apiUrl`, refrescando el token antes si hace falta. Al entrar al panel, `SessionService` llama a `GET /panel/me` y guarda `{ username, rol }` en signals. **El rol se toma de esa respuesta, no del token.**
5. **Refresco**: `AuthService` programa `updateToken` 30 s antes del `exp` del access token; si el refresco falla (sesión cerrada o expirada en Keycloak) se fuerza un nuevo login.
6. **Logout**: "Cerrar sesión" en el menú de usuario llama a `AuthService.logout()`, que va al `end_session_endpoint` de Keycloak y vuelve a `/`. Cierra la sesión también en Keycloak, no solo el token local.

### Manejo de errores

| Situación             | Qué pasa                                                                                                  |
| --------------------- | --------------------------------------------------------------------------------------------------------- |
| 401 de la API         | `apiErrorInterceptor` fuerza un nuevo login. Si vuelve a fallar enseguida, corta el bucle y avisa en `/`. |
| 403 de la API         | Se muestra "Permisos insuficientes" sin cerrar sesión.                                                    |
| API sin respuesta     | Se muestra "API no disponible" con botón "Reintentar".                                                   |
| Keycloak caído        | La bienvenida muestra el aviso y deshabilita los botones; `/panel` redirige a `/`.                        |
| `rol = SIN_ROL`       | El inicio avisa que la cuenta no tiene permisos asignados y oculta el contenido.                          |

## Rutas

| Ruta      | Qué es                                                                                      |
| --------- | ------------------------------------------------------------------------------------------- |
| `/`       | Bienvenida pública con "Iniciar sesión" y "Crear cuenta" (redirigen a Keycloak).            |
| `/panel`  | Inicio de la app autenticada (guard), dentro de `AppShell`. Usuario y rol desde `GET /panel/me`; contenido en estado vacío. |
| `/estilos`| Guía de estilos: tokens, componentes base y utilidades (incluye números tabulares).          |
| `**`      | Página 404.                                                                                 |

Las pantallas de `/login` y `/register` **no se rutean**: las muestra Keycloak. Su maquetado quedó en `src/app/prototypes/keycloak-theme/` como referencia visual para el futuro tema (todavía no hay tema creado); toman el estilo de `tokens.css` y `base.css`.

## Estructura de la app autenticada

`AppShell` (`shared/layout/app-shell/`) aporta la barra superior (logo, nombre, avatar con menú de usuario y **Cerrar sesión**), la navegación principal (barra lateral en escritorio, menú inferior en mobile; por ahora solo "Inicio") y el `router-outlet`. Para sumar secciones: agregar el ítem en `navItems` del shell y la ruta hija en `features/panel/panel.routes.ts`.

## Roles en el front

`*appSiRol` (`shared/directives/si-rol.directive.ts`) muestra u oculta bloques según el rol de `SessionService`:

```html
<section *appSiRol="['ADMIN', 'USER']">…</section>
<button *appSiRol="'ADMIN'">Solo administradores</button>
```

Ocultar en el front es solo experiencia de usuario: **la seguridad la aplica la API** validando el token en cada petición.

## Estructura

```
public/
└── silent-check-sso.html   página para el chequeo silencioso de sesión de keycloak-js
src/
├── styles/                 tokens.css + base.css (CSS plano)
├── environments/           keycloak.{url,realm,clientId} y apiUrl
└── app/
    ├── core/
    │   ├── config/         PRODUCT_NAME, PRODUCT_TAGLINE
    │   ├── auth/           AuthService (Keycloak), provideAuth(), authGuard, modelos
    │   ├── api/            apiUrl(), ApiError, apiErrorInterceptor
    │   └── session/        SessionService (GET /panel/me) + modelos de rol
    ├── features/
    │   ├── auth/           layout público + bienvenida
    │   ├── panel/          inicio autenticado (estado vacío) + rutas dentro del shell
    │   ├── styleguide/     /estilos
    │   └── not-found/      404
    ├── prototypes/
    │   └── keycloak-theme/ login, register y validadores: referencia visual, fuera del ruteo
    └── shared/
        ├── layout/         AppShell (topbar, navegación, menú de usuario)
        ├── directives/     *appSiRol
        ├── forms/          helpers de mensajes de error
        └── ui/             brand, avatar, pitch-backdrop, field-error, password-field, social-buttons
```

## Configuración en Keycloak

Consola de administración → realm `segunda-api-keycloak-fuchibol`:

1. **Clients → `angular-app` → Settings**
   - Client authentication: **Off** (cliente público).
   - Standard flow: **On**. Direct access grants: **Off**.
   - Valid redirect URIs: `http://localhost:4200/*`
   - Valid post logout redirect URIs: `http://localhost:4200/*`
   - Web origins: `http://localhost:4200`
2. **Clients → `angular-app` → Advanced → Proof Key for Code Exchange Code Challenge Method: `S256`**.
3. **Realm settings → Login → User registration: On** (para que `register()` tenga pantalla de registro).
4. **Realm roles**: `user_role_admin` y `user_role_user` (los nombres que mapea `RolApp` en la API). Asignarlos a los usuarios en **Users → usuario → Role mapping**.

## Qué sigue pendiente

- Secciones del dominio (torneos, equipos, partidos): no existen todavía; el inicio muestra un estado vacío.
- Botones "Continuar con Google / GitHub" y "¿Olvidaste tu contraseña?" de los prototipos: los resolverá el tema de Keycloak.
