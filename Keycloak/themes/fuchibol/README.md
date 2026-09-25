# Tema `fuchibol` para Keycloak

Tema **nativo de login** para Keycloak 26.7.x que hereda de `keycloak.v2` (PatternFly 5) y hace que las pantallas de acceso se vean como parte del front Angular de Fuchibol. Sin Keycloakify ni build: son archivos estáticos que Keycloak sirve tal cual.

## Estructura

```
themes/fuchibol/
└── login/
    ├── theme.properties            parent=keycloak.v2 + orden de hojas de estilo
    ├── password-checklist.ftl      macro: lista de requisitos de contraseña (visible y en vivo)
    ├── register.ftl                copia de keycloak.v2 26.7.4 + la lista de requisitos
    ├── login-update-password.ftl   copia de keycloak.v2 26.7.4 + la lista de requisitos
    ├── messages/                   textos propios (en, es); el resto viene del padre
    └── resources/
        ├── css/tokens.css          COPIA de Frontend/src/styles/tokens.css (no editar acá)
        ├── css/fuchibol.css        todos los estilos propios
        ├── img/logo.svg            isotipo (se usa como máscara CSS)
        ├── img/pitch.svg           líneas de cancha del fondo (máscara CSS)
        └── js/password-checklist.js
```

Todo lo que no está acá (login, olvidé mi contraseña, error, info, etc.) lo renderiza `keycloak.v2` y solo recibe los estilos.

## Cómo activarlo

1. La carpeta `themes/` está montada en el contenedor en `/opt/keycloak/themes`. En `start-dev` no hay caché de temas: **los cambios se ven recargando la página**.
2. Consola de administración → realm → **Realm settings → Themes → Login theme: `fuchibol`** → Save. (En el realm `segunda-api-keycloak-fuchibol` ya está seleccionado.)
3. Para probar sin la app: abrir cualquier URL de login del realm, por ejemplo la que arma el front al tocar "Iniciar sesión".

## Cómo agregar o cambiar estilos

- **Colores, tipografía, radios, espaciados**: no se tocan acá. Se cambian en el front (`Frontend/src/styles/tokens.css`) y se vuelve a copiar el archivo a `resources/css/tokens.css`. `fuchibol.css` solo usa esas variables.
- **Estilos propios**: `resources/css/fuchibol.css`, organizado por secciones (mapeo de variables de PatternFly, página, tarjeta, formulario, botones, alertas, pie, checklist). Todas las reglas van con el prefijo `.login-pf` para ganar en especificidad a PatternFly sin usar `!important` (salvo contra utilidades `pf-v5-u-*`, que ya lo usan).
- **Nombre del producto** en la cabecera: regla `#kc-header-wrapper::after` en `fuchibol.css`. **Logo**: `resources/img/logo.svg` (solo importa la forma; el color lo pone el CSS).
- **SVG usados como máscara** (`logo.svg`, `pitch.svg`): deben ser SVG "planos", sin comentarios XML, sin `<defs>` ni referencias internas `url(#id)`. Chrome descarta el archivo como `mask-image` si los tiene (se comprobó al armar el tema). El fundido del fondo lo hace `body::after` en CSS por ese motivo.
- **Orden de carga** (`theme.properties`): `css/styles.css` (del padre) → `css/tokens.css` → `css/fuchibol.css`. No crear un archivo propio llamado `styles.css`: taparía el del padre.
- **Plantillas**: primero intentar con CSS. Si hace falta tocar estructura, copiar el `.ftl` del tema `keycloak.v2` **de la misma versión de Keycloak** (está dentro de `/opt/keycloak/lib/lib/main/org.keycloak.keycloak-themes-<versión>.jar`, ruta `theme/keycloak.v2/login/`) y modificar lo mínimo, dejando un comentario `fuchibol:` en cada cambio.

## Qué se cambió en las plantillas y por qué

Solo dos, porque la lista de requisitos de contraseña visible desde el inicio no se puede generar con CSS:

- `register.ftl` y `login-update-password.ftl`: copias exactas de keycloak.v2 26.7.4 con tres cambios cada una:
  1. `<#import "password-checklist.ftl" as checklist>` en lugar de `password-validation.ftl`.
  2. `<@checklist.render field="..."/>` justo debajo del campo de contraseña.
  3. Se quitan `<@validator.templates/>` y `<@validator.script .../>` (la validación en vivo del padre, que mostraba los errores solo al salir del campo): la reemplaza la lista. La validación real la sigue haciendo el servidor con la política del realm.

La lista toma los mínimos de la política del realm (`passwordPolicies`) y, si el realm no tiene política, muestra los del producto: 10 caracteres, 1 mayúscula, 1 número, 1 carácter especial.
