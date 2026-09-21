# Cómo se conecta este front con el backend

Resumen corto de la integración del **login**, para que puedas repetir el
mismo camino con el **register**.

## El recorrido de una petición

```
login.html         (formGroup)     el usuario escribe y toca "Entrar"
   |
login.ts           submit()        valida el form y llama a auth.login()
   |
auth-service.ts    HttpClient      hace POST /api/auth/login con { username, password }
   |
auth-interceptor   Authorization   (en el resto de las peticiones lo pone él solo)
   |
proxy.conf.js      dev server      /api/auth/login  ->  http://localhost:8080/auth/login
   |
Auth.java          /auth/login     busca el usuario y responde 200 con su nombre
```

## Archivos y para qué sirve cada uno

| Archivo | Qué hace |
| --- | --- |
| `proxy.conf.js` | Evita CORS en desarrollo reenviando `/api/*` al backend. |
| `src/environments/environment*.ts` | La URL de la API: `/api` en dev, host completo en prod. |
| `core/auth/auth.models.ts` | Interfaces `Credentials`, `Session` y la clase `AuthError`. |
| `core/auth/auth-service.ts` | Login, logout y estado de sesión (signals). |
| `core/auth/auth-interceptor.ts` | Le pega el header `Authorization` a cada request. |
| `core/auth/auth-guard.ts` | Bloquea rutas si no hay sesión. |
| `features/auth/pages/login/` | El formulario reactivo. |

## Puertos (verificado el 21/09/2026)

- `application.properties` **no define `server.port`**, así que Spring arranca
  en **8080**. En el 4200 lo que estaba corriendo era tu propio `ng serve`.
- Si querés que Spring use el 4200, agregá `server.port=4200` **y** mové el
  front (`ng serve --port 4300`), porque los dos no pueden compartir puerto.
  Después cambiá la constante `BACKEND` de `proxy.conf.js`.
- Postgres está en 5432, lo usa el backend; el front nunca le habla directo.

## Pendientes del lado de Spring

1. **`UserDetailsService`**: sin esto, los usuarios de la tabla `usuarios` no
   pueden loguearse; solo entra el usuario de `SS_USER`/`SS_PASSWORD`.
   Hace falta `loadUserByUsername()` + un `@Bean PasswordEncoder` (BCrypt).
2. **`AuthenticationEntryPoint`**: para que el 401 no dispare el cartel nativo
   del navegador (ver comentario en `auth-service.ts`).
3. **Comparar la contraseña dentro de `/auth/login`**: hoy `Auth.java` solo
   busca el usuario en la base, no valida la contraseña.
4. **Register**: `POST /usuarios/crear` hoy está protegido como todo lo demás,
   así que devolvería 401 a un usuario nuevo. Para que el registro funcione hay
   que permitirlo explícitamente en `SecurityConfig`:

   ```java
   .authorizeHttpRequests(auth -> auth
       .requestMatchers(HttpMethod.POST, "/usuarios/crear").permitAll()
       .anyRequest().authenticated())
   ```

   El body que espera hoy ese endpoint es la entidad completa:

   ```json
   {
     "username": "facu",
     "password": "1234",
     "enabled": true,
     "accountNotExpired": true,
     "accountNotLocked": true,
     "credentialNotExpired": true,
     "role": { "roleName": "USER" }
   }
   ```

   (el rol tiene que existir ya en la tabla `roles`, si no tira 404).
