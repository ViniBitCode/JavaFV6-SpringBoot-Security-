# Retroauth — Frontend (Angular 22)

Frontend del panel privado para la API REST de Spring Boot que está en
`../Backend`. La autenticación la maneja **Keycloak**: la app no tiene
formularios de login ni de registro propios. Estética retro-moderna,
componentes standalone y signals.

![Panel](docs/panel.png)

## Requisitos

- Node.js 20.19+ (probado con 24.19)
- npm 10+
- **Keycloak corriendo** en `http://localhost:8180`, con el realm y el cliente
  ya creados (ver [Qué hay que configurar en Keycloak](#qué-hay-que-configurar-en-keycloak)).
- **La API corriendo** en `http://localhost:8080`.

Sin Keycloak la app no puede iniciar sesión y muestra una pantalla explicando
que el servidor de autenticación no responde. Sin la API se entra igual, pero el
panel no puede cargar el perfil.

## Cómo levantarlo

```bash
npm install
npm start
```

Queda en <http://localhost:4200>. `npm start` usa la configuración
`development`, que es la que trae las URLs de desarrollo.

### Scripts

| Script          | Qué hace                                                              |
| --------------- | --------------------------------------------------------------------- |
| `npm start`     | Servidor de desarrollo con recarga en caliente (`development`).       |
| `npm run build` | Build de producción en `dist/frontend`.                               |
| `npm run watch` | Build de desarrollo en modo watch.                                    |
| `npm test`      | Angular pedirá instalar el runner: el proyecto se generó sin pruebas. |

## Configuración por entorno

Todo lo que cambia entre entornos vive en `src/environments/`. **Nada de esto se
escribe en componentes ni en servicios**: se lee una sola vez, desde
`core/config/api.config.ts` y `app.config.ts`.

| Variable            | Desarrollo              | Qué es                         |
| ------------------- | ----------------------- | ------------------------------ |
| `apiBaseUrl`        | `http://localhost:8080` | Raíz de la API de Spring Boot. |
| `keycloak.url`      | `http://localhost:8180` | Raíz del servidor de Keycloak. |
| `keycloak.realm`    | `primer-api-keycloak`   | Realm.                         |
| `keycloak.clientId` | `angular-app`           | Cliente público (sin secret).  |

- `environment.development.ts` → la usa `npm start`.
- `environment.ts` → producción; tiene placeholders que hay que reemplazar.

## Flujo de autenticación

1. La pantalla de bienvenida (`/`) ofrece **Iniciar sesión** y **Registrarse**.
   Las dos redirigen a Keycloak; la segunda cae directo en la pestaña de alta.
2. Keycloak autentica (usuario y contraseña, Google o GitHub) y vuelve al front
   con un código, que la librería canjea por un token usando **Authorization
   Code con PKCE `S256`**. Las credenciales nunca pasan por la app.
3. Al arrancar se hace un `check-sso` silencioso: si ya había sesión abierta en
   Keycloak, se entra sin preguntar nada.
4. El token se renueva solo mientras haya actividad del usuario
   (`withAutoRefreshToken`; a los 5 minutos de inactividad cierra la sesión).
5. El interceptor agrega `Authorization: Bearer <token>` **solo** a las URLs que
   matchean `apiBaseUrl`. Keycloak y cualquier tercero no reciben el token.
6. **Cerrar sesión** llama al logout de Keycloak, no solo borra el token local:
   si no, la sesión del servidor seguiría viva y el `check-sso` volvería a
   entrar solo en la siguiente visita.

La librería es `keycloak-angular` v22 (peer `@angular/core@^22`), elegida sobre
`angular-auth-oidc-client` porque trae `register()` nativo para mandar a la
pantalla de alta; con la otra habría que armar esa URL a mano.

## Contrato con la API

La app consume un solo endpoint. Todo lo demás lo resuelve Keycloak.

### `GET /panel/me`

Requiere `Authorization: Bearer <token>`.

```json
{ "username": "facu", "email": "facu@mail.com", "role": "ADMIN" }
```

`role` es el rol principal, ya resuelto por el backend (`ADMIN` o `USER`). **El
front no lee los roles del token** ni conoce los roles técnicos del realm: usa
únicamente este campo.

### Manejo de errores

| Respuesta | Qué hace la app                                                   |
| --------- | ----------------------------------------------------------------- |
| `401`     | El token no sirve: dispara un login nuevo contra Keycloak.        |
| `403`     | Muestra un aviso de permisos insuficientes. **No** cierra sesión. |
| `0`       | Avisa que la API no responde (apagada, CORS o red caída).         |

## Rutas

| Ruta     | Guard        | Qué es                                              |
| -------- | ------------ | --------------------------------------------------- |
| `/`      | `guestGuard` | Bienvenida pública. Con sesión redirige a `/panel`. |
| `/panel` | `authGuard`  | Área privada. Sin sesión redirige a Keycloak.       |
| `**`     | —            | 404.                                                |

## Estructura

```
src/
  environments/            URLs de la API y de Keycloak por entorno
  styles/
    tokens.css             ← paleta, tipografías y espaciado (único archivo de tokens)
    base.css               reset, fondo retro (grilla + resplandores + scanlines)
    components.css         tarjetas, campos, botones, avisos
  app/
    core/
      auth/
        keycloak-bootstrap.service.ts  init de Keycloak + estado del arranque
        auth.service.ts                login / register / logout
        perfil.service.ts              GET /panel/me en signals
      config/              api.config.ts (única lectura de environment)
      errors/              traducción de errores HTTP a español
      guards/              authGuard, guestGuard
      interceptors/        apiErrorInterceptor (401 / 403 / red)
      models/              Perfil + constantes de rol
      services/            tema, avisos globales
    features/
      welcome/             pantalla pública `/`
      panel/               layout + home del área privada
      not-found/           pantalla 404
    shared/
      components/          brand, theme-toggle, alert
      directives/          *appSiRol
      layout/auth-shell/   marco de la pantalla pública
public/
  silent-check-sso.html    iframe del check-sso de Keycloak
```

## Estado de sesión y perfil

```ts
auth.autenticado(); // boolean, derivado de los eventos de keycloak-js
perfil.perfil(); // Perfil | null
perfil.role(); // 'ADMIN' | 'USER' | null
perfil.cargando(); // boolean
perfil.error(); // string | null
```

El token **no** se guarda en `localStorage`: lo administra keycloak-js y lo
renueva solo. El perfil se pide una vez al entrar al panel.

## Mostrar según el rol

```html
<section *appSiRol="'ADMIN'">…</section>
<section *appSiRol="['ADMIN', 'USER']">…</section>
```

> Esconder un bloque es **experiencia de usuario, no seguridad**: cualquiera
> puede mostrarlo desde las herramientas del navegador. Lo que protege de verdad
> es el backend, que valida el token y los roles en cada pedido.

## Qué hay que configurar en Keycloak

Consola de administración → realm `primer-api-keycloak` → **Clients →
angular-app → Settings**:

| Campo                           | Valor                            |
| ------------------------------- | -------------------------------- |
| Client authentication           | `Off` (cliente público)          |
| Standard flow                   | `On`                             |
| Direct access grants            | `Off` (no se usa password grant) |
| Valid redirect URIs             | `http://localhost:4200/*`        |
| Valid post logout redirect URIs | `http://localhost:4200/`         |
| Web origins                     | `http://localhost:4200`          |

El comodín `http://localhost:4200/*` cubre tanto el retorno del login (`/panel`)
como el `silent-check-sso.html`.

## Diseño

- **Tokens** en `src/styles/tokens.css`: paleta, tipografías, escala de
  espaciado (base 4px), radios, sombras y transiciones.
- **Tema claro / oscuro / automático.** El selector de la barra superior guarda
  la preferencia en `localStorage`. Con "automático" no se escribe nada en el
  `<html>` y manda `prefers-color-scheme`; con una elección explícita se escribe
  `data-theme="light|dark"`, que en el CSS pisa a la media query.
- **Mobile-first** y responsive; sin librerías de componentes.
- **Accesibilidad:** avisos con `role="alert"` / `role="status"`, enlace de
  salto al contenido, foco visible y soporte de `prefers-reduced-motion`.

Las tipografías (Orbitron para títulos y logo, Inter para la interfaz) se cargan
desde Google Fonts en `src/index.html`. Si no hay conexión, los fallbacks de los
tokens mantienen la app legible.

## Convención de nombres

- **Inglés** para lo técnico: archivos, clases, servicios, guards, interceptors,
  métodos públicos y los modelos que reflejan el JSON de la API (`username`,
  `role`).
- **Español** para el dominio y lo interno: variables locales, helpers privados,
  reglas de negocio, y todo el texto que ve el usuario, los comentarios y esta
  documentación.

## Notas

- No hay datos de prueba ni credenciales en el código: el panel muestra
  únicamente lo que devolvió la API.
- TypeScript en modo estricto y `strictTemplates` activado.
- La app es _zoneless_ (sin `zone.js`): el estado se maneja con signals.
