# Contexto del proyecto (Fullstack)

Repo con dos apps separadas:

- `frontend/`: Angular (standalone) + Angular Material + Leaflet.
- `backend/`: Spring Boot (WebMVC) + acceso a datos (JdbcClient, JPA opcional).

El proyecto sigue **arquitectura hexagonal** (puertos y adaptadores) en backend y frontend.

---

## 0) Arquitectura hexagonal (resumen)

- **Dominio**: entidades y modelos puros, sin dependencias de frameworks.
- **Puertos de entrada** (casos de uso): interfaces que orquestan la lógica; los adaptadores de entrada (p. ej. REST) los invocan.
- **Puertos de salida**: interfaces para persistencia u otros servicios externos; los adaptadores (p. ej. JDBC, HTTP) las implementan.
- **Adaptadores de entrada**: controladores REST (backend), componentes/páginas (frontend) que llaman a los casos de uso.
- **Adaptadores de salida**: implementaciones concretas de los puertos (repositorios JDBC, cliente HTTP, etc.).

Las dependencias apuntan siempre hacia el dominio: la aplicación y los adaptadores dependen del dominio, no al revés.

---

## 1) Frontend (Angular) — estructura actual (hexagonal)

Árbol relevante (`frontend/src/app`):

- `app.ts`, `app.html`, `app.scss`, `app.config.ts`, `app.routes.ts`.
- `core/`
  - `domain/`: modelos de dominio (ej. `accident.model.ts`: `AccidentPoint`, `AccidentReport`).
  - `port/out/`: puertos de salida (clases abstractas, ej. `GetAccidentPointsPort`, `GetAccidentReportsPort`).
  - `use-case/`: casos de uso inyectables (ej. `GetAccidentPointsUseCase`, `GetAccidentReportsUseCase`).
  - `state/`: estado con Signals (ej. `SelectionStore`).
  - `loading.service.ts`, `loading.interceptor.ts`.
- `adapter/out/http/`: adaptador HTTP que implementa los puertos (ej. `AccidentHttpAdapter`).
- `features/`: vistas (map, accident-form, home, login, etc.); inyectan **casos de uso**, no el adaptador.
- `shared/`: header, loading-overlay, etc.

### Convenciones (frontend hexagonal)

- **Features** inyectan **use cases** (nunca el adaptador HTTP directamente).
- **Dominio** en `core/domain/` (interfaces/types sin dependencias).
- **Puertos** en `core/port/out/` (clases abstractas); se proveen en `app.config.ts` con el adaptador (`useExisting: AccidentHttpAdapter`).
- **Nuevo flujo**: definir port → implementar en `adapter/out/http/` → crear use case que use el port → registrar en `app.config` → usar el use case en las features.

### Enrutado

Hoy `routes` está vacío (`frontend/src/app/app.routes.ts`). Convención sugerida:

- **Rutas por feature**: declarar rutas en `app.routes.ts` (lazy cuando aplique) y que el componente raíz use `RouterOutlet` solo si se adopta navegación. Si el proyecto sigue “single-view”, mantenerlo explícito (sin rutas) y documentarlo.

---

## 2) Backend (Spring Boot) — estructura actual (hexagonal)

Árbol relevante (`backend/src/main/java/com/joaquin/proyecto_backend/`):

- `ProyectoBackendApplication.java`: bootstrap.
- **Dominio** (sin dependencias de framework):
  - `domain/AccidentPoint.java`, `domain/AccidentReport.java`: records de dominio.
- **Aplicación** (puertos y casos de uso):
  - `application/port/in/`: puertos de entrada (ej. `GetAccidentPointsUseCase`, `GetAccidentReportsUseCase`).
  - `application/port/out/`: puertos de salida (ej. `GetAccidentPointsPort`, `GetAccidentReportsPort`).
  - `application/service/`: implementación de los casos de uso (ej. `GetAccidentPointsService`, `GetAccidentReportsService`).
- **Adaptador de entrada (web)**:
  - `adapter/in/web/AccidentController.java`: REST; inyecta los use cases, mapea dominio → DTO.
  - `adapter/in/web/dto/AccidentPointDto.java`, `AccidentReportDto.java`: contrato de la API.
- **Adaptador de salida (persistencia)**:
  - `adapter/out/persistence/AccidentQueryAdapter.java`: implementa los puertos de salida con `JdbcClient`.
  - `adapter/out/persistence/AccidentEntity.java`, `AccidentJpaRepository.java`: JPA (opcional según perfil).

Convención a mantener:

- **Toda la ruta bajo** `com/joaquin/proyecto_backend/...` (nada en `repo/` suelto).
- **Nuevo flujo**: dominio → port out → service (use case) → port in; controller llama al use case; adaptador de persistencia implementa el port out.

### Configuración de runtime

- `application.properties`: H2 file-mode (con exclusiones de autoconfig de DataSource/JPA).
- `application-postgres.properties`: PostgreSQL (incluye `currentSchema=arena2`) y exclusiones de Hibernate/JPA repos.

Convención recomendada:

- **Usar perfiles** (`spring.profiles.active=postgres` en local o variables de entorno) y mantener configuración sensible fuera del repo.

---

## 3) Patrones de llamadas HTTP (identificado)

### Frontend → Backend

- Las features llaman a **casos de uso** (ej. `GetAccidentPointsUseCase.getByProvinces(provinces)`).
- El caso de uso usa el **puerto de salida**; el adaptador HTTP (`AccidentHttpAdapter`) hace `GET` a `http://localhost:8080/api/accidents` con query param `provinces`.
- Base URL: evitar hardcodear; centralizar en constante o `environment` cuando se incorpore.

### Backend (endpoints)

- `GET /api/accidents?provinces=...`: el **controller** (adaptador de entrada) valida, llama al **use case**, mapea dominio → DTO y devuelve `List<AccidentPointDto>`.
- `GET /api/accidents/report?province=...&from=...&to=...`: igual con `GetAccidentReportsUseCase` y `AccidentReportDto`.
- Validación en controller; errores 400 con `ResponseStatusException`.
- **Naming**: `XController`, `XDto`, puertos `GetXxxPort`, use cases `GetXxxUseCase`, servicios `GetXxxService`, adaptador `XxxAdapter`.

---

## 4) Manejo de loading y errores (identificado)

### Loading (frontend)

- `LoadingInterceptor` llama `loading.show()` antes de cada request y `loading.hide()` en `finalize()`.
- `LoadingOverlayComponent` se suscribe a `loading$` y muestra spinner.

Limitaciones actuales (a tener en cuenta):

- **Concurrencia**: si hay múltiples requests solapadas, un `hide()` puede apagar el loading antes de que terminen las demás. Convención sugerida: usar **contador (ref-count)** en `LoadingService` o track por request id.
- **Exclusiones**: no hay forma de “no mostrar loading” para ciertos requests (p.ej. polling). Convención sugerida: soporte por header (`X-Skip-Loading`) o por URL/patrón.

### Errores (frontend)

- No hay interceptor de errores HTTP.
- En `MapComponent.loadAndPaintAccidents` se usa `try/catch` y se hace `console.error`, limpiando markers.

Convenciones recomendadas (para coherencia futura):

- **Centralizar errores HTTP** con un interceptor (p.ej. `core/interceptors/error.interceptor.ts`) que:
  - Normalice `HttpErrorResponse` a un modelo de error de UI.
  - Notifique a la UI (snackbar/toast) para errores no manejados localmente.
- **Errores por feature**:
  - Cuando un error es parte del flujo de UX (ej. “sin datos”), manejarlo en la feature (estado + mensaje).

### Errores (backend)

- Se usa `ResponseStatusException` para 400 en validación de query params.
- No hay `@ControllerAdvice`/`@RestControllerAdvice` para un formato unificado de errores.

Convención recomendada:

- Implementar un `@RestControllerAdvice` con:
  - Respuesta consistente (timestamp, status, error, message, path, traceId opcional).
  - Mapeos comunes (`MethodArgumentNotValidException`, `ConstraintViolationException`, etc.).

---

## 5) Piezas reutilizables (identificadas)

### Frontend

- **Estado**: `SelectionStore` (Signals).
- **Casos de uso**: `GetAccidentPointsUseCase`, `GetAccidentReportsUseCase` (inyectables).
- **Adaptador HTTP**: `AccidentHttpAdapter` (implementa los puertos; registrado en `app.config`).
- **Cross-cutting**: `LoadingService` + `LoadingInterceptor`.
- **UI compartida**: `LoadingOverlayComponent`, `Header`.

### Backend

- **Dominio**: `AccidentPoint`, `AccidentReport` (records).
- **Casos de uso**: `GetAccidentPointsService`, `GetAccidentReportsService`.
- **Adaptador de persistencia**: `AccidentQueryAdapter` (JdbcClient); JPA opcional en `AccidentEntity` + `AccidentJpaRepository` según perfil.
- **DTO**: `AccidentPointDto`, `AccidentReportDto` en `adapter/in/web/dto/`.

---

## 6) Convenciones arquitectónicas (checklist para nuevas vistas/endpoints)

### Frontend (Angular, hexagonal)

- **Feature nueva**: crear `features/<feature>/...`; inyectar **use cases**, no el adaptador HTTP.
- **Nuevo flujo de datos**: definir modelo en `core/domain/`, puerto en `core/port/out/`, implementar en `adapter/out/http/`, crear use case en `core/use-case/`, registrar port en `app.config` con `useExisting: <Adaptador>`.
- Estado compartido: `core/state/*.store.ts`. UI compartida: `shared/`.
- Loading: requests pasan por interceptor; errores UX por feature o interceptor global.

### Backend (Spring Boot, hexagonal)

- **Nuevo flujo**: dominio (record) en `domain/` → port out en `application/port/out/` → implementación en `adapter/out/persistence/` → service en `application/service/` que implementa port in → controller en `adapter/in/web/` que inyecta el use case y mapea a DTO.
- DTOs en `adapter/in/web/dto/`. Validación en controller o Bean Validation; formato de errores unificado con `@RestControllerAdvice`.
- Datos: consultas complejas con `JdbcClient` en el adaptador de persistencia; JPA opcional en `adapter/out/persistence/` (entidad + JpaRepository).

---

## Seguridad y configuración (muy importante)

Hay credenciales en `backend/src/main/resources/application-postgres.properties` (`spring.datasource.password`). Convención a adoptar:

- No commitear secretos. Mover a variables de entorno / archivo local fuera de control de versiones.
- Si se necesita un ejemplo, usar placeholders y documentar en un `.example` (sin credenciales reales).

