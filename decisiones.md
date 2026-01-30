# Architecture & Decision Record

## 1. Backend Architecture (@wheels/api)

### Seguridad & Throttling

- **Throttling Global:** Protegido por `ThrottlerModule`.
  - Límite: **30 requests** por minuto.
  - TTL: **60 segundos**.
- **Cors:** Configurado para aceptar requests solo del frontend.

### Autenticación (JWT)

- **Access Token:** Expira en **15 minutos**.
- **Refresh Token:** Expira en **14 días**.
- **Estrategia:** Dual-token. El access token se usa para requests, el refresh token para obtener nuevos pares de tokens sin re-login.

### Cloudinary & Uploads

Manejado por `UploadService`.

- **Modo:** Carga directa desde el frontend ([Signed Uploads](https://cloudinary.com/documentation/upload_images#signed_upload)).
- **Firmas:**
  - Validez: ~1 hora (Timestamp based).
  - Carpeta: `wheels-house/cars`.
- **Optimizaciones (Eager):**
  - `w_1200`: Redimensiona a max 1200px de ancho.
  - `c_limit`: Mantiene aspect ratio, no escala hacia arriba.
  - `q_auto`: Calidad automática.
  - `f_auto`: Formato automático (webp/avif).

### Wheelword (Game Service)

- **Diccionario:** Base de datos de palabras (`gameWord` table). Si está vacía, se auto-semilla al inicio.
- **Selección de Palabra:**
  - Longitud válida: **4 a 11 caracteres**.
  - **Cooldown:** Una misma palabra no puede repetirse en los últimos **70 juegos**.
  - Prioridad: Selecciona palabras con menos usos (`timesUsed`).
- **Juego Diario:**
  - Se genera "on-demand" (cuando el primer usuario del día lo pide).
  - Basado en fecha UTC (`YYYY-MM-DD`).
- **Límites:**
  - Intentos máximos: **6**.

### Importación Masiva (Excel)

Manejado por `ImportService`.

- **Límite:** **500 filas** máximo por archivo.
- **Validación:** Estricta contra listas de opciones (`carOptions.ts`).
- **Template:** Se genera dinámicamente con `ExcelJS` incluyendo hoja de validaciones.

---

## 2. Frontend Architecture (@wheels/web)

### Social Feed (Polling & Caching)

Implementado en `useSocialFeed` hook.

- **Tecnología:** TanStack Query (`useInfiniteQuery`).
- **Paginación:** Bloques de **20 items**.
- **Cache (Stale Time):** **2 minutos**. El feed no se refresca automáticamente si cambias de tab y volves rápido.
- **Detección de Novedades (Polling):**
  - Hook: `useNewActivityCheck`.
  - Intervalo: **30 segundos**.
  - Lógica: Pide solo el último item (`limit: 1`). Si el ID es mayor al que estás viendo, muestra la píldora "Nuevos posts".
  - **Optimización:** El polling se DETIENE (`enabled: false`) una vez que se detectan items nuevos, para ahorrar recursos.

### Masonry Grid

- Componente `CarMasonryGrid`.
- Responsive:
  - Móvil: 2 columnas.
  - Tablet: 3 columnas.
  - Desktop: 4 columnas.
  - Wide: 5 columnas.

### Constantes de Negocio

Sincronizadas con Backend en `src/data/`:

- `carOptions.ts`: Contiene las listas "duras" de Fabricantes, Marcas, Colores, etc. Si se agrega una marca nueva, debe actualizarse en ambos lados (API y Web).

### Global Stats Strategy (HomePage Analytics)

- **Endpoint:** `/api/stats/global`.
- **Estrategia de Caching:** **Lazy Server-Side Cache** con TTL.
  - El primer request del día (o después del vencimiento) calcula los conteos reales (`totalUsers`, `totalCars`, `totalPhotos`).
  - Los resultados se guardan en memoria en el servidor (`StatsService`).
  - **TTL:** **24 horas**.
- **Racional:** Dado el volumen actual de datos y tráfico, un cron job pesado es innecesario. Esta solución ofrece performance instantánea para el usuario final con un costo de base de datos despreciable (1 query cada 24hs).

### Hall of Fame Selection Strategy

- **Estructura de Datos:** Se utiliza un campo `hallOfFameFlags` de tipo `jsonb` en la tabla `user` para permitir multi-categoría.
- **Campos Técnicos (Manual Control):**
  - `hallOfFameFlags`: `{"isFounder": bool, "isContributor": bool, "isAmbassador": bool, "isLegend": bool}`
  - `hallOfFameOrder`: Entero (1, 2, 3) para fijar posición en la Home.
  - `hallOfFameTitle`: Texto personalizado que pisa al título de rango.
- **Categorías y Colores (Referencia UI):**
  | Categoría | Flag DB | Color UI | Icono |
  | :--- | :--- | :--- | :--- |
  | **Leyenda** | `isLegend` | Amber (`#f59e0b`) | Star |
  | **Embajador** | `isAmbassador` | Purple (`#a855f7`) | Trophy |
  | **Colaborador** | `isContributor` | Emerald (`#10b981`) | Code |
  | **Fundador** | `isFounder` | Sky (`#0ea5e9`) | Users |
- **Curación:** Se gestiona mediante el script CLI `manage-hof.ts` o directamente en la DB.
- **Lógica de "Featured" (Home):**
  - Se muestran solo los usuarios que tengan un `hallOfFameOrder` (1, 2 o 3) no nulo.
  - El órden en pantalla respeta estrictamente ese número.
- **Visual Showcase:** La tarjeta de la Home busca automáticamente el auto con **más likes** del usuario que tenga al menos una foto cargada (`innerJoin` con `carPicture`).
