# apis-java

Frontend en **Angular 21** para practicar el consumo de una API REST.
El backend en Spring Boot va después, en `backend/`.

```
apis-java/
├── frontend/     Angular 21 + Angular Material
└── backend/      (pendiente) Spring Boot
```

## Levantar el front

```bash
cd frontend
npm install
npm start          # http://localhost:4200
```

## Conectar los endpoints

Todas las URLs viven en un solo archivo: **`frontend/src/app/core/api.config.ts`**.
No hay ninguna URL hardcodeada en otro lado.

```ts
export const API_CONFIG: ApiConfig = {
  baseUrl: 'http://localhost:8080',
  endpoints: {
    listarPersonas: '/api/personas',   // GET
    crearPersona:   '/api/personas',   // POST
  },
};
```

Mientras estén vacíos, la pestaña muestra un cartel avisando que falta configurarlos
en vez de tirar errores de red. Si un endpoint arranca con `http://` se usa tal cual y
se ignora el `baseUrl`.

Para sumar endpoints nuevos: agregalos a la interfaz `ApiConfig`, al objeto `API_CONFIG`
y creá el método correspondiente en `frontend/src/app/core/persona.service.ts`.

## Contrato que espera el front

`Persona` (`frontend/src/app/core/persona.model.ts`):

```json
{
  "id": 1,
  "nombre": "Ada",
  "apellido": "Lovelace",
  "email": "ada@example.com",
  "fechaNacimiento": "1815-12-10"
}
```

- `GET listarPersonas` → `Persona[]`
- `POST crearPersona` → recibe el objeto **sin** `id`, devuelve la `Persona` creada.

`fechaNacimiento` viaja como `yyyy-MM-dd`, así que del lado de Java mapea directo a
`LocalDate` sin necesidad de `@JsonFormat`. La conversión se hace con la fecha **local**
(no con `toISOString()`) para que en UTC-3 no se corra un día para atrás.

## CORS

Con el front en `:4200` y Spring Boot en `:8080` el navegador bloquea las llamadas
salvo que lo habilites del lado del backend:

```java
@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/personas")
public class PersonaController { ... }
```

## Comandos útiles

```bash
npm start                 # servidor de desarrollo
npm run build             # build de producción en dist/
npm test                  # tests (Vitest)
```
