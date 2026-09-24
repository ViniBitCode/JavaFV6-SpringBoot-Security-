# API protegida con Keycloak

API REST en Spring Boot que delega la autenticación en **Keycloak**. La API no maneja usuarios ni contraseñas: funciona como *resource server* y solo valida los tokens JWT que emite Keycloak.

🌐 **Demo:** [stalwart-taffy-a1a0ac.netlify.app](https://stalwart-taffy-a1a0ac.netlify.app)
🔌 **API:** [javafv6-springboot-security-1.onrender.com](https://javafv6-springboot-security-1.onrender.com)

> La API corre en el plan gratuito de Render: si estuvo inactiva, el primer request puede tardar hasta un minuto.

## 🛠️ Tecnologías

**Backend:** Java 21 · Spring Boot 4 · Spring Security · OAuth2 Resource Server · Lombok · Maven  
**Identidad:** Keycloak (Cloud-IAM en producción, Docker en local)  
**Frontend:** Angular (desarrollado con asistencia del amigo Claudio)  
**Infraestructura:** Docker · Render · Netlify · Cloud-IAM  

## 🔐 Seguridad

**En Keycloak:**
- Realm con roles `ADMIN` y `USER`. Los permisos (`READ`, `CREATE`, `UPDATE`, `DELETE`) son **roles compuestos**: `ADMIN` incluye los cuatro y `USER` incluye `READ`.
- `USER` es el rol por defecto: todo usuario nuevo lo recibe al registrarse.
- Client `angular-app` público, con *Standard flow* y PKCE `S256` obligatorio. Sin *Direct access grants* (password grant).

**En la API:**
- Configurada como **OAuth2 Resource Server**: valida tokens firmados con **RS256**. La API solo tiene la clave pública, así que puede verificar tokens pero no emitirlos.
- Un `JwtAuthenticationConverter` propio lee los roles del claim `realm_access.roles` y los convierte en *authorities* de Spring (`ROLE_ADMIN`, `ROLE_USER`), lo que permite usar `@PreAuthorize("hasRole('ADMIN')")`.
- Sesiones **stateless** y **CORS** restringido al frontend y al entorno local.
- El issuer de Keycloak y los orígenes permitidos se configuran por variables de entorno.
- Podria haber hecho el proyecto sin la api y hacer las conexiones a Keycloak desde Angular directamente, pero no fui por este camino ya que esto lo dejo como base para cuando quiera poner mas entidades en proyectos futuros.

## Extras acerca del proyecto:
- Aca no inclui ningun documentador de endpoints como en el anterior porque solo estaba practicando la integracion con Keycloak.
- El front nuevamente esta todo vibecodeado, lo unico que hago es simular comunicacion entre claude haciendo de frontend dev y mi persona como backen dev.
- Para hostear el front use Angular, back use Render, Keycloak use CloudIAM y como no hay mas entidades que los usuarios no me hizo falta la bbdd :P
