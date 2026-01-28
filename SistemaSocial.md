# Wheels House - Sistema Social: Especificación Completa

# PARTE 1 DE 3: Contexto, Visión, Definición y Features (Sprints 1-2)

## Índice General

- **PARTE 1**: Contexto, Visión, Definición del Producto, Features del Sistema Social, Sprints 1-2
- **PARTE 2**: Features (Sprints 3-5), Arquitectura y Estructura
- **PARTE 3**: Experiencia de Usuario, Roadmap Completo, Apéndices

---

## Contexto y Visión

### Problema Identificado

Wheels House v1.0 funciona como una herramienta de gestión de colecciones: permite agregar autos, crear grupos, mantener wishlist y visualizar estadísticas. Sin embargo, al usarla, se identifica un problema crítico:

**"Subo autos, creo grupos, añado a wishlist... y después ¿qué?"**

El producto carece de un **loop de retención**. Una vez que el usuario completa su colección inicial, no hay razón para volver al día siguiente. Es un administrador funcional pero "aburrido" que no genera engagement continuo.

### Decisión Estratégica

**Wheels House evoluciona de "Notion para colecciones" a "producto social para coleccionistas".**

El objetivo es crear interconectividad entre usuarios que genere razones para volver diariamente:

- Ver qué autos consiguió la comunidad
- Recibir validación social por las propias adquisiciones
- Descubrir coleccionistas con gustos similares
- Facilitar búsquedas e intercambios informales

### Principios Fundamentales

1. **Sin marketplace formal**: Wheels House NO procesa transacciones, NO modera intercambios, NO maneja pagos. Solo facilita señalización social y conexiones.

2. **Engagement genuino sobre vanity metrics**: Cada feature debe generar comportamientos que impulsen retención real, no solo números inflados.

3. **Incremental y validable**: Construir en sprints claros

4. **Network effects desde el inicio**: Las features sociales solo funcionan si hay actividad visible. El feed global permite esto incluso con pocos usuarios.

---

## Definición del Producto

### ¿Qué es Wheels House después del sistema social?

Una **plataforma social especializada para coleccionistas de vehículos a escala** que combina:

1. **Gestión personal**: Organización profesional de colecciones con fotos, grupos y wishlist
2. **Descubrimiento**: Feed de actividad que muestra qué están haciendo otros coleccionistas
3. **Comunidad**: Sistema de follows para personalizar qué coleccionistas seguir
4. **Validación social**: Likes y notificaciones que reconocen logros y adquisiciones
5. **Facilitación de intercambios**: Tablón de anuncios donde usuarios publican búsquedas y ofertas, pero negocian externamente

### Diferenciadores vs Competencia

| Aspecto        | Instagram/Facebook                 | Wheels House                              |
| -------------- | ---------------------------------- | ----------------------------------------- |
| Contenido      | Mezclado con otros temas           | 100% coleccionismo de vehículos           |
| Organización   | Posts temporales, búsqueda difícil | Colección permanente + feed temporal      |
| Búsquedas      | Se pierden en stories/comments     | Feed dedicado con expiración automática   |
| Gestión        | No existe                          | Sistema completo de grupos y estadísticas |
| Descubrimiento | Algoritmo opaco                    | Cronológico + filtros claros              |

### Usuario Target

**Coleccionista activo de die-cast vehicles** que:

- Tiene 50+ vehículos en su colección (o aspira a tenerlos)
- Participa en grupos de Facebook/Reddit/Instagram
- Busca activamente piezas específicas para completar sets
- Disfruta mostrando sus adquisiciones
- Valora conectar con coleccionistas de gustos similares
- Considera intercambios o compras ocasionales

**Mercado inicial**: Hispanohablantes
**Expansión futura**: Global con internacionalización

---

## Features del Sistema Social

### 1. Feed de Actividad

#### Propósito

Crear sensación de "comunidad viva" donde los usuarios vean que hay movimiento constante, generando FOMO (fear of missing out) y razones para volver diariamente.

#### Tipos de Eventos en Feed

##### Eventos Pasivos (Actividad de colección)

**Auto agregado**

- Trigger: Usuario sube nuevo auto a su colección
- Visualización: Card con foto del auto y atributos del mismo
- Interacción: Click lleva a detalle del auto en perfil del usuario
- Puede recibir likes

**Milestone alcanzado**

- Trigger: Usuario llega a 50, 100, 250, 500, 1000 autos
- Visualización: Mensaje de celebración con emoji 🎉
- Interacción: Click lleva a colección completa del usuario
- Puede recibir likes

**Wishlist conseguido**

- Trigger: Usuario marca item de wishlist como "conseguido"
- Visualización: Badge especial "✓ Wishlist" + foto del auto
- Interacción: Click lleva a detalle del auto
- Puede recibir likes

**Grupo creado**

- Trigger: Usuario crea nuevo grupo con 5+ autos
- Visualización: Nombre del grupo + preview de primeros 3 autos
- Interacción: Click lleva a vista del grupo (si es público)
- Puede recibir likes

##### Eventos Activos (Posts de usuario)

**Búsqueda activa**

- Trigger: Usuario crea post "Estoy buscando X"
- Contenido:
  - Descripción libre: "Ferrari F40 roja"
  - Criterios estructurados opcionales: marca, color, año, fabricante
  - Imagen de referencia (opcional)
  - Información de contacto
- Visualización: Card destacada con ícono 🔍
- Interacción: Botón "Contactar" que revela info de contacto
- Expiración: 30 días automático
- Usuario puede marcar como "Resuelto" o eliminar antes

**Oferta disponible**

- Trigger: Usuario crea post "Tengo para ofrecer/vender X"
- Contenido:
  - Auto específico de su colección
  - Descripción de estado, condiciones
  - Tags: "Intercambio" y/o "Venta"
  - Información de contacto
- Visualización: Card destacada con ícono 💱
- Interacción: Botón "Me interesa" que revela contacto
- Expiración: 30 días automático

#### Estructura Técnica

**Tabla: `feed_events`**

```typescript
interface FeedEvent {
  id: string;
  type:
    | "car_added"
    | "milestone_reached"
    | "wishlist_achieved"
    | "group_created";
  user_id: string;
  car_id?: string;
  group_id?: string;
  metadata?: {
    milestone?: number;
    wishlistItem?: boolean;
    groupName?: string;
  };
  created_at: Date;
}
```

**Tabla: `user_posts`**

```typescript
interface UserPost {
  id: string;
  user_id: string;
  type: "search" | "offer";
  car_id?: string; // Para ofertas, referencia al auto
  target_description?: string; // Para búsquedas, texto libre
  target_criteria?: {
    brand?: string;
    color?: string;
    year?: number;
    manufacturer?: string;
    tags?: string[];
  };
  description: string; // Detalles adicionales
  contact_method?: string; // Info de contacto específica del post
  available_for_trade?: boolean;
  available_for_sale?: boolean;
  status: "active" | "resolved" | "expired";
  expires_at: Date;
  created_at: Date;
  updated_at: Date;
}
```

#### Sistema de Eventos (Event-Driven)

**EventEmitter Pattern**

```typescript
// Cuando usuario agrega auto
carsService.create() {
  // ... lógica de creación
  eventEmitter.emit('car.added', { userId, carId });
}

// EventSubscriber escucha y crea feed event
@OnEvent('car.added')
handleCarAdded({ userId, carId }) {
  feedService.createEvent({
    type: 'car_added',
    userId,
    carId
  });
}
```

**Ventajas**:

- Desacoplamiento: `cars` module no conoce `feed` module
- Escalabilidad: Fácil agregar más listeners
- Extensibilidad: Nuevos eventos sin modificar código existente

#### Reglas de Feed

**Ventana temporal**: 30 días

- Eventos más antiguos no se muestran (pero no se borran)
- Balance entre "feed fresco" y "suficiente contenido"

**Ordenamiento**: Cronológico inverso (más reciente primero)

- Sin algoritmo de "relevancia" inicialmente
- Simple, predecible, transparente

**Paginación**: 20 items por carga

- Scroll infinito
- Indicador de loading al cargar más
- "Fin del feed" cuando no hay más items

**Cache**:

- Feed global: 5 minutos
- Feed personalizado: 2 minutos
- Evita queries constantes a BD

#### Tabs del Feed

**Tab 1: Explorar (Global)**

- Muestra actividad de TODOS los usuarios
- Incluye todos los tipos de eventos
- Objetivo: Descubrimiento, sentir comunidad activa
- Usuarios nuevos ven esto primero

**Tab 2: Siguiendo (Personalizado)**

- Muestra SOLO actividad de usuarios que sigo
- Mismo tipo de eventos
- Empty state si no sigo a nadie: "Empieza a seguir coleccionistas desde Explorar"
- Objetivo: Feed relevante, reducción de ruido

**Tab 3: Búsquedas y Ofertas**

- Muestra SOLO posts de tipo `search` y `offer`
- De todos los usuarios (no filtrado por follows)
- Solo posts activos (no expirados)
- Objetivo: Tablón dedicado para trading informal

#### Filtros Secundarios (En tabs Explorar y Siguiendo)

- **Todo**: Todos los tipos de eventos
- **Autos agregados**: Solo `car_added`
- **Logros**: Solo `milestone_reached`
- **Wishlist conseguidos**: Solo `wishlist_achieved`

Filtros implementados client-side inicialmente (menos complejidad backend).

#### Consideraciones y Casos Edge

**¿Qué pasa si no hay actividad?**

- Empty state claro: "No hay actividad reciente. Sé el primero en agregar autos"
- En fase inicial, esto incentiva a los primeros usuarios a generar contenido

**¿Usuarios pueden publicar spam?**

- Límites de posts: máximo 5 activos simultáneos, 3 nuevos por día
- Cooldown: 1 hora entre posts del mismo tipo
- Sistema de reportes (ver sección de Moderación)

**¿Usuarios publican búsquedas y nunca las cierran?**

- Expiración automática a 30 días
- Notificación 3 días antes: "Tu búsqueda expira pronto, ¿la extiendes?"
- Usuario puede marcar como "Resuelta" manualmente

**¿Cómo se mantiene el feed interesante con pocos usuarios?**

- Con 10 usuarios activos subiendo 2 autos/día = 20 eventos/día
- Con 50 usuarios activos = 100 eventos/día
- Con 100+ usuarios = feed siempre tiene contenido fresco
- Ventana de 30 días asegura suficiente backlog inicialmente

---

### 2. Sistema de Follow (Seguimiento)

#### Propósito

Permitir que usuarios "marquen" coleccionistas de interés para personalizar su feed y construir su red.

#### Decisión: Follow Unidireccional (Twitter-style)

**Por qué NO amistad bidireccional (Facebook-style):**

- **Alta fricción**: Requiere esperar aprobación
- **Crecimiento lento**: Red tarda en formarse
- **Complejidad**: 3 estados (pending/accepted/rejected) + UI para gestionar solicitudes
- **Valor retrasado**: Usuario no ve contenido hasta que acepten

**Por qué Follow unidireccional:**

- **Fricción baja**: Click = sigo inmediatamente
- **Crecimiento rápido**: Construir red de 10-20 usuarios en minutos
- **Simplicidad**: 2 estados (follow/unfollow)
- **Valor inmediato**: Veo su contenido en mi feed al instante

#### Estructura Técnica

**Tabla: `user_follows`**

```typescript
interface UserFollow {
  follower_id: string; // Quien sigue (FK users.id)
  followed_id: string; // A quien sigue (FK users.id)
  created_at: Date;

  // Constraints
  UNIQUE(follower_id, followed_id) // No duplicados
  CHECK(follower_id != followed_id) // No auto-follow
}
```

**Contadores denormalizados en `users`:**

```sql
ALTER TABLE users ADD COLUMN followers_count INT DEFAULT 0;
ALTER TABLE users ADD COLUMN following_count INT DEFAULT 0;
```

**¿Por qué denormalizar?**

- Mostrar contadores sin COUNT() query costoso
- Actualizar con triggers o en service layer
- Trade-off: Pequeño overhead en write por MUCHO beneficio en read

#### Endpoints

```typescript
POST   /api/users/:id/follow
DELETE /api/users/:id/unfollow
GET    /api/users/:id/followers      // Lista de seguidores
GET    /api/users/:id/following      // Lista de quien sigue
GET    /api/users/me/following        // Mis follows (shortcut)
```

#### Límites y Restricciones

**Límite de follows**: 1,000 usuarios

- Suficiente para caso de uso real
- Previene abusos (seguir a todos para conseguir follow-back)
- Similar a límites de plataformas establecidas

**Throttling**: 10 follows por minuto

- Previene bots
- Permite crecimiento orgánico rápido
- Si usuario llega al límite, cooldown de 5 minutos

**NO implementar (al menos inicialmente)**:

- Sugerencias de "a quién seguir"
- Badge de "mutual follow"
- Bloqueo de usuarios (puede venir después si hay acoso)
- Follows privados (todos los perfiles son públicos)

#### Integración con Feed

Una vez implementado follow:

- Tab "Siguiendo" en feed se activa
- Query filtra eventos por `user_id IN (list_of_followed_users)`
- Cache separado para feed personalizado

#### UX de Follow Button

**Estado: No sigo**

```tsx
<Button onClick={follow} variant="primary">
  Seguir
</Button>
```

**Estado: Sigo**

```tsx
<Button onClick={unfollow} variant="secondary">
  Siguiendo
</Button>
```

**Con contador:**

```tsx
<FollowButton>
  <ButtonPrimary onClick={follow}>Seguir</ButtonPrimary>
  <FollowerCount>{followersCount} seguidores</FollowerCount>
</FollowButton>
```

#### Visualización de Listas

**En perfil propio:**

- Stats clickeables: "123 seguidores" → `/profile/followers`
- Stats clickeables: "45 siguiendo" → `/profile/following`

**En perfil ajeno:**

- Mismo patrón
- Badge adicional: "Te sigue" si el usuario visitado me sigue

**Página de lista:**

```tsx
<UserListPage>
  <Header>
    <BackButton />
    <Title>Seguidores</Title>
  </Header>

  <UserList>
    {users.map((user) => (
      <UserCard>
        <Avatar />
        <UserInfo>
          <Username>{user.username}</Username>
          <Bio>{user.bio}</Bio>
          <CollectionCount>{user.collectionCount} autos</CollectionCount>
        </UserInfo>
        <FollowButton userId={user.id} />
      </UserCard>
    ))}
  </UserList>
</UserListPage>
```

#### Consideraciones y Casos Edge

**¿Usuario A sigue a Usuario B, luego B se da de baja?**

- Cascade delete: row en `user_follows` se borra automáticamente
- Decrementar contador de A

**¿Usuario sigue/unsigue rápidamente (spam)?**

- Throttling lo previene
- Si detectas patrón (10+ follow/unfollow en hora): temporal ban de feature

**¿Cómo descubro a quién seguir?**

- Desde feed global, veo actividad interesante → clickeo perfil → sigo
- Desde listas de followers/following de otros usuarios
- Feature futura: "Sugerencias" basadas en autos en común

**¿Puedo ver followers/following de otros usuarios?**

- SÍ, son públicos
- Ayuda a descubrimiento: "A quién sigue Juan que colecciona Ferraris?"

---

## ROADMAP: SPRINT 1 - Feed Básico

**Objetivo:** Feed de actividad funcionando donde usuarios vean que hay "vida" en la plataforma.

### Backend - Sistema de Eventos

**Mini-objetivos:**

- [x] Instalar y configurar `@nestjs/event-emitter`
- [x] Crear módulo `social/events`
- [x] Crear servicio `EventsService` con métodos de emisión
- [x] Crear subscriber `EventsSubscriber` con handlers básicos
- [x] Definir tipos de eventos en `event-types.ts`

**Archivos a crear:**

- `apps/api/src/modules/social/social.module.ts` ✅
- `apps/api/src/modules/social/events/events.service.ts` ✅
- `apps/api/src/modules/social/events/events.subscriber.ts` ✅
- `apps/api/src/modules/social/events/event-types.ts` ✅

### Backend - Feed Events

**Mini-objetivos:**

- [x] Crear entidad `FeedEvent` con Drizzle
- [x] Crear migración para tabla `feed_events`
- [x] Ejecutar migración en dev DB
- [x] Crear `FeedRepository` con métodos básicos:
  - `create(event)` ✅
  - `findMany(query)` con paginación ✅
  - `findByUserId(userId, query)` ✅
- [x] Crear `FeedService` con lógica de negocio:
  - `createEvent(event)` (llamado por subscriber) ✅
  - `getFeedGlobal(page, limit)` (feed de todos) ✅
  - `getFeedFollowing(userId, page, limit)` (feed personalizado) ✅
- [x] Crear DTOs:
  - `FeedQueryDto` (page, limit, filters) ✅
  - `FeedResponseDto` (items, hasMore, total) ✅
- [x] Crear `FeedController` con endpoints:
  - `GET /feed?tab=explore&page=0&limit=20` ✅
  - `GET /feed?tab=following&page=0&limit=20` ✅

**Archivos a crear:**

- `apps/api/src/modules/social/feed/entities/feed-event.entity.ts` ✅ (social.schema.ts)
- `apps/api/src/database/migrations/XXXX_create_feed_events.ts` ✅
- `apps/api/src/modules/social/feed/feed.repository.ts` ✅
- `apps/api/src/modules/social/feed/feed.service.ts` ✅
- `apps/api/src/modules/social/feed/feed.controller.ts` ✅
- `apps/api/src/modules/social/feed/dto/feed.dto.ts` ✅
- `apps/api/src/modules/social/feed/dto/feed-response.dto.ts` ✅ (FeedResponseDto)

### Backend - Integración con Cars

**Mini-objetivos:**

- [x] En `CarsService.create()`, emitir evento `car.added` después de crear ✅
- [x] En subscriber, escuchar `car.added` y crear feed event ✅
- [x] Testear: crear auto → verificar que aparece en feed ✅

**Archivos a modificar:**

- `apps/api/src/services/car.service.ts` ✅
- `apps/api/src/modules/social/events/events.subscriber.ts` ✅

### Backend - Milestone Tracking

**Mini-objetivos:**

- [x] En `CarsService.create()`, después de crear auto: ✅
  - [x] Contar total de autos del usuario ✅
  - [x] Verificar si alcanzó milestone (50, 100, 250, 500, 1000) ✅
  - [x] Si sí, emitir evento `milestone.reached` ✅
- [x] En subscriber, escuchar `milestone.reached` y crear feed event ✅

**Lógica a implementar:**

```typescript
// Pseudocódigo
const userCarsCount = await this.carsRepo.countByUserId(userId);
const milestones = [50, 100, 250, 500, 1000];
const milestone = milestones.find((m) => userCarsCount === m);
if (milestone) {
  this.eventEmitter.emit("milestone.reached", { userId, milestone });
}
```

### Backend - Wishlist Achieved

**Mini-objetivos:**

- [x] En `WishlistService` (o donde se maneje wishlist), cuando usuario marca item como conseguido: ✅
  - [x] Emitir evento `wishlist.item_achieved` ✅
- [x] En subscriber, escuchar y crear feed event ✅

**Archivos a modificar:**

- `apps/api/src/services/car.service.ts` ✅ (contiene la lógica de wishlist achieved)

### Frontend - API Client

**Mini-objetivos:**

- [x] Crear `apps/web/src/services/social.service.ts` ✅
- [x] Implementar función `getFeed(tab, page, limit, filter)` ✅
- [x] Configurar React Query hooks (`useSocialFeed`) ✅

**Archivo creado:**

- `apps/web/src/services/social.service.ts` ✅
- `apps/web/src/hooks/useSocialFeed.ts` ✅

````

### Frontend - Feed UI

**Mini-objetivos:**

- [x] Crear página `CommunityPage.tsx` ✅
- [x] Implementar `FeedTabs` (dentro de `CommunityPage`) ✅
- [x] Implementar `FeedList` component con mapeo de items ✅
- [x] Implementar `FeedItem` component con variantes dinámicas ✅
- [x] Implementar hook `useSocialFeed` (Infinite Scroll integrado) ✅
- [x] Integrar infinite scroll con `IntersectionObserver` ✅
- [x] Implementar loading states (Skeletons) ✅
- [x] Implementar empty states ✅

**Archivos a crear:**
- `apps/web/src/pages/social/CommunityPage.tsx` ✅
- `apps/web/src/components/social/FeedList.tsx` ✅
- `apps/web/src/components/social/FeedItem.tsx` ✅
- `apps/web/src/hooks/useSocialFeed.ts` ✅

### Frontend - Routing

**Mini-objetivos:**

- [x] Agregar ruta `/community` en router principal ✅
- [x] Agregar link en `Navbar.tsx` ✅
- [ ] Considerar hacer `/community` la home para usuarios autenticados

**Archivos modificados:**
- `apps/web/src/routes/router.tsx` ✅
- `apps/web/src/components/Navbar.tsx` ✅

### Testing Sprint 1

**Mini-objetivos:**

- [ ] Backend: Testear endpoint `GET /feed` devuelve eventos correctos
- [ ] Backend: Testear evento `car.added` crea feed event
- [ ] Backend: Testear milestone detection funciona
- [ ] Frontend: Verificar que feed carga y muestra items
- [ ] Frontend: Verificar infinite scroll funciona
- [ ] Frontend: Verificar tabs cambian correctamente
- [ ] Frontend: Verificar filtros funcionan

### Validación Sprint 1

**Criterios de completitud:**

- [x] Usuario puede navegar a `/community` ✅
- [x] Ve actividad reciente de todos los usuarios ✅
- [x] Puede cambiar entre tabs (Global / Siguiendo) ✅
- [/] Puede aplicar filtros (Implementado en backend, pendiente UI de filtros avanzada)
- [x] Infinite scroll carga más items ✅
- [x] Click en item de auto lleva a detalle ✅
- [x] Click en avatar lleva a perfil ✅

---

## ROADMAP: SPRINT 2 - Sistema de Follow

**Objetivo:** Usuarios pueden seguir/dejar de seguir a otros usuarios, construyendo su red personalizada.

### Backend - Follow System

**Mini-objetivos:**

- [x] Crear entidad `UserFollow` con Drizzle
- [x] Crear migración para tabla `user_follows` con constraint único
- [x] Ejecutar migración
- [x] Agregar campos a `users`:
  - `followers_count INT DEFAULT 0`
  - `following_count INT DEFAULT 0`
- [x] Crear migración para campos nuevos
- [x] Crear `FollowsRepository` con métodos:
  - `create(followerId, followedId)`
  - `delete(followerId, followedId)`
  - `findFollowers(userId, page, limit)`
  - `findFollowing(userId, page, limit)`
  - `isFollowing(followerId, followedId)`
  - `getFollowersCount(userId)`
  - `getFollowingCount(userId)`
- [x] Crear `FollowsService` con lógica:
  - `follow(followerId, followedId)`
    - Verificar no self-follow
    - Crear registro
    - Incrementar contadores
    - Emitir evento `user.followed`
  - `unfollow(followerId, followedId)`
    - Eliminar registro
    - Decrementar contadores
    - Emitir evento `user.unfollowed`
  - `getFollowers(userId, page, limit)`
  - `getFollowing(userId, page, limit)`
- [x] Implementar throttling: máximo 10 follows por minuto
- [x] Implementar límite: máximo 1000 follows por usuario
- [x] Crear `FollowsController` con endpoints:
  - `POST /users/:id/follow`
  - `DELETE /users/:id/unfollow`
  - `GET /users/:id/followers`
  - `GET /users/:id/following`

**Archivos a crear:**
- `apps/api/src/modules/social/follows/entities/user-follow.entity.ts`
- `apps/api/src/database/migrations/XXXX_create_user_follows.ts`
- `apps/api/src/database/migrations/XXXX_add_follow_counts_to_users.ts`
- `apps/api/src/modules/social/follows/follows.repository.ts`
- `apps/api/src/modules/social/follows/follows.service.ts`
- `apps/api/src/modules/social/follows/follows.controller.ts`

### Backend - Integración con Feed

**Mini-objetivos:**

- [x] Modificar `FeedService.getFeedFollowing()`:
  - Obtener lista de `followed_ids` del usuario
  - Filtrar feed events donde `user_id IN (followed_ids)`
- [x] Cachear lista de follows del usuario (5 minutos)

### Backend - Contadores Denormalizados

**Mini-objetivos:**

- [x] Implementar triggers o lógica en service para actualizar contadores:
  - Cuando se crea follow → +1 en ambos contadores
  - Cuando se elimina follow → -1 en ambos contadores
- [ ] Testear que contadores se actualizan correctamente

### Frontend - API Client

**Mini-objetivos:**

- [x] Crear `apps/web/src/features/social/api/followsApi.ts`
- [x] Implementar funciones:
  - `followUser(userId)`
  - `unfollowUser(userId)`
  - `getFollowers(userId, page, limit)`
  - `getFollowing(userId, page, limit)`

### Frontend - Follow Button

**Mini-objetivos:**

- [x] Crear component `FollowButton.tsx`
- [x] Implementar estados:
  - No sigo → "Seguir" (botón primary)
  - Sigo → "Siguiendo" (botón secondary)
  - Loading → spinner
- [x] Implementar hook `useFollow(userId)`
- [x] Manejar optimistic updates
- [x] Manejar errores (mostrar toast)

**Archivo a crear:**
```tsx
// apps/web/src/features/social/components/follow/FollowButton.tsx

interface FollowButtonProps {
  userId: string;
  isFollowing: boolean;
  followersCount?: number;
  variant?: 'default' | 'mini';
}

export const FollowButton: React.FC<FollowButtonProps> = ({...}) => {
  const { follow, unfollow, isLoading } = useFollow(userId);

  const handleClick = () => {
    if (isFollowing) {
      unfollow();
    } else {
      follow();
    }
  };

  return (
    <Button
      onClick={handleClick}
      variant={isFollowing ? 'secondary' : 'primary'}
      loading={isLoading}
    >
      {isFollowing ? 'Siguiendo' : 'Seguir'}
    </Button>
  );
};
````

### Frontend - Followers/Following Lists

**Mini-objetivos:**

- [no] Crear página `FollowersPage.tsx`
  QUEDO OBSOLETO - SE DECIDIO TOMAR UN APPROACH TIPO VSCO
- [no] Crear página `FollowingPage.tsx`
  QUEDO OBSOLETO - SE DECIDIO TOMAR UN APPROACH TIPO VSCO
- [x] Implementar component `UserCard` (avatar, username, bio, stats, FollowButton)
- [x] Implementar hook `useFollowersList(userId)`
- [x] Implementar hook `useFollowingList(userId)`
- [x] Agregar paginación (infinite scroll o "Load more")

**Archivos a crear:**

- `apps/web/src/features/social/pages/FollowersPage.tsx`
- `apps/web/src/features/social/pages/FollowingPage.tsx`
- `apps/web/src/features/social/components/follow/UserCard.tsx`

### Frontend - Profile Integration

**Mini-objetivos:**

- [no] En componente de perfil, agregar stats clickeables:
  - "123 seguidores" → `/collection/:username/followers`
  - "45 siguiendo" → `/collection/:username/following`
  QUEDO OBSOLETO - SE DECIDIO TOMAR UN APPROACH TIPO VSCO
- [x] En perfil ajeno, mostrar `FollowButton`
- [no] Mostrar badge "Te sigue" si el usuario visitado me sigue
  QUEDO OBSOLETO - SE DECIDIO TOMAR UN APPROACH TIPO VSCO

**Archivos a modificar:**

- Componente de perfil existente

### Frontend - Feed Integration

**Mini-objetivos:**

- [x] En `FeedPage`, activar tab "Siguiendo"
- [x] Implementar empty state: "No sigues a nadie aún. Empieza a seguir desde Explorar"
- [x] Cuando usuario está en tab "Siguiendo", pasar `tab=following` al hook


### Validación Sprint 2

**Criterios de completitud:**

- [x] Usuario puede seguir a otro desde su perfil
- [x] Botón cambia a "Siguiendo" inmediatamente
- [no] Contadores se actualizan - QUEDO OBSOLETO - SE DECIDIO TOMAR UN APPROACH TIPO VSCO
- [x] Usuario puede dejar de seguir
- [x] Tab "Siguiendo" en feed muestra solo actividad de quien sigo
- [x] Listas de followers/following son accesibles
- [no] Badge "Te sigue" aparece en perfiles ajenos cuando corresponde - QUEDO OBSOLETO - SE DECIDIO TOMAR UN APPROACH TIPO VSCO

---

**FIN DE PARTE 1**

# Wheels House - Sistema Social: Especificación Completa
# PARTE 2 DE 3: Features (Sprints 3-5) y Arquitectura

## Continuación de Features del Sistema Social

### 3. Sistema de Likes

#### Propósito
Validación social directa: "Mi auto es cool, la gente lo reconoce". Engagement básico que incentiva subir más contenido.

#### Alcance

**¿Qué se puede likear?**
- ✅ Autos individuales en colecciones ajenas
- ✅ Grupos de colecciones ajenas
- ❌ Colecciones completas (demasiado abstracto)
- ❌ Usuarios (no es red social de "popularidad")
- ❌ Posts de búsqueda/oferta (no tiene sentido, son utilitarios)

**¿Dónde aparece el botón de like?**
- Card de auto en feed
- Modal/detalle de auto
- En cada grupo ajeno
- Galería de colección ajena (cada auto tiene botón)

#### Estructura Técnica

**Tabla: `car_likes`**
```typescript
interface CarLike {
  user_id: string;   // Quien likea (FK users.id)
  car_id: string;    // Auto likeado (FK cars.id)
  created_at: Date;
  
  // Constraints
  UNIQUE(user_id, car_id) // Un usuario solo puede likear un auto una vez
}
```

**Contador denormalizado en `cars`:**
```sql
ALTER TABLE cars ADD COLUMN likes_count INT DEFAULT 0;
```

**¿Por qué denormalizar?**
- Mostrar contador sin COUNT() query
- Cache del contador en FE
- Actualizar incrementally (+1 / -1)

#### Endpoints

```typescript
POST   /api/cars/:id/like
DELETE /api/cars/:id/unlike
GET    /api/cars/:id/likes        // Lista de usuarios que likearon (max 100)
GET    /api/users/:id/liked-cars  // Autos que el usuario likeó
```

#### Límites y Restricciones

**Throttling**: 50 likes por hora
- Suficiente para uso genuino
- Previene abuse (likear todo para llamar atención)

**Lista de "quién likeó"**: Máximo 100 usuarios visibles
- Si auto tiene 500 likes, muestra "500 likes" pero lista solo primeros 100
- Reduce carga de UI y queries

**NO puede likear sus propios autos**
- Validación en backend
- UI no muestra botón en autos propios

#### Feature: "Mis autos más populares"

En perfil propio:
```tsx
<ProfileSection>
  <SectionTitle>Mis autos más populares</SectionTitle>
  
  <CarGrid>
    {topLikedCars.map(car => (
      <CarCard>
        <CarImage src={car.mainImage} />
        <CarName>{car.name}</CarName>
        <LikeCount>❤️ {car.likesCount}</LikeCount>
      </CarCard>
    ))}
  </CarGrid>
</ProfileSection>
```

Query: Top 10 autos del usuario ordenados por `likes_count DESC`.

---

### 4. Sistema de Notificaciones

#### Propósito
Pull-back mechanism: traer usuarios de vuelta cuando algo relevante pasa.

#### Tipos de Notificaciones

**1. Nuevo seguidor**
- Trigger: Usuario B sigue a usuario A
- Notificación para A: "Juan te siguió"
- Click → perfil de Juan
- Metadata: `{ actorId: B }`

**2. Like en auto/grupo**
- Trigger: Usuario B likea auto/grupo de usuario A
- Notificación para A: "María likeó tu [Corvette C8]"
- Click → detalle del auto/grupo
- Metadata: `{ actorId: B, carId: X }`

**3. Milestone alcanzado**
- Trigger: Usuario alcanza 50, 100, 250, 500, 1000 autos
- Notificación para el mismo usuario: "¡Llegaste a 100 autos! 🎉"
- Click → vista de colección
- Metadata: `{ milestone: 100 }`

**4. Wishlist match (Fase futura)**
- Trigger: Usuario B agrega auto X que está en wishlist de usuario A
- Notificación para A: "Pedro agregó [Skyline GT-R] - está en tu wishlist"
- Click → perfil de Pedro o auto específico
- Metadata: `{ actorId: B, carId: X }`

#### Estructura Técnica

**Tabla: `notifications`**
```typescript
interface Notification {
  id: string;
  user_id: string;           // A quién va dirigida
  type: 'new_follower' | 'car_liked' | 'milestone_reached' | 'wishlist_match';
  actor_id?: string;         // Quién hizo la acción (null para milestone)
  car_id?: string;           // Auto relacionado (null para follower)
  metadata?: {
    milestone?: number;
    carName?: string;
  };
  read: boolean;             // Leída o no
  created_at: Date;
}

// Índices
CREATE INDEX idx_notifications_user_unread ON notifications(user_id, read, created_at);
```

#### Endpoints

```typescript
GET    /api/notifications               // Últimas 50 notificaciones
GET    /api/notifications/unread-count  // Para badge en header
PUT    /api/notifications/:id/read      // Marcar una como leída
PUT    /api/notifications/read-all      // Marcar todas como leídas
DELETE /api/notifications/:id           // Eliminar una
```

#### Límites

**Retención**: Últimas 100 notificaciones
- Notificaciones mayores a 100 se borran automáticamente (FIFO)
- Cron job semanal para limpieza

**Agrupación (Fase futura)**:
- Si usuario B likea 5 autos de usuario A en 10 minutos
- En vez de 5 notificaciones: "Juan likeó 5 de tus autos"
- Reduce spam de notificaciones

#### Comportamiento

**Click en notificación:**
1. Marca como leída (optimistic update)
2. Navega al destino correspondiente:
   - `new_follower` → `/profile/{actor.username}`
   - `car_liked` → `/profile/{car.owner.username}/cars/{car.id}`
   - `milestone_reached` → `/profile/collection`

**Polling vs WebSocket:**
- **Inicialmente**: Polling cada 30 segundos cuando usuario está activo
- **Futuro**: WebSocket para real-time (mayor complejidad)

---

### 5. Sistema de Posts (Búsquedas y Ofertas)

#### Propósito
Facilitar señalización de intención ("busco X", "ofrezco Y") sin convertirse en marketplace. Toda negociación y transacción sucede FUERA de Wheels House.

#### Filosofía

**Wheels House NO es un marketplace. Es un tablón de anuncios.**

- ❌ NO procesamos pagos
- ❌ NO moderamos negociaciones
- ❌ NO garantizamos transacciones
- ❌ NO manejamos disputas
- ❌ NO verificamos identidades
- ✅ SÍ facilitamos conexiones
- ✅ SÍ permitimos señalización de intención
- ✅ SÍ mostramos info de contacto

**Responsabilidad legal**: Mínima. Disclaimer claro en ToS y en cada post.

#### Shortcut desde Wishlist

Integración directa:
```tsx
<WishlistItem car={car}>
  <CarImage />
  <CarName />
  
  <Actions>
    <Button onClick={markAsAcquired}>
      ✓ Lo conseguí
    </Button>
    
    <Button onClick={() => createSearchPost(car)}>
      🔍 Publicar búsqueda
    </Button>
  </Actions>
</WishlistItem>
```

Click en "Publicar búsqueda" → modal pre-rellenado con info del auto.

#### Límites y Reglas

**Límites por usuario:**
- Máximo 5 posts activos simultáneamente
- Máximo 3 posts nuevos por día
- Cooldown: 1 hora entre posts del mismo tipo

**Expiración automática:**
- Posts expiran a los 30 días
- Notificación 3 días antes: "Tu búsqueda expira pronto. ¿La extiendes por 30 días más?"
- Usuario puede marcar como "Resuelta" antes de expirar
- Usuario puede eliminar en cualquier momento

**Auto-moderación:**
- Si post recibe 5+ reportes → se oculta automáticamente (pending review)
- Filtros de palabras clave: detectar URLs sospechosas, "envía dinero", etc.

#### Perfil de Usuario: Contacto

**Campo nuevo en `users`:**
```typescript
contact_info: string;  // Máx 500 caracteres
is_trader: boolean;    // Badge "Hace intercambios"
is_seller: boolean;    // Badge "Vendedor"
```

#### Disclaimer Legal

**En footer de cada post:**
```tsx
<Disclaimer>
  ⚠️ Wheels House facilita conexiones entre coleccionistas pero no interviene 
  en negociaciones, intercambios o ventas. Toda comunicación y transacción 
  ocurre fuera de la plataforma. Ten precaución y verifica identidad antes 
  de realizar intercambios o compras.
</Disclaimer>
```

---

### 6. Sistema de Reportes y Moderación

#### Propósito
Permitir que la comunidad auto-modere contenido inapropiado, spam o scams. Reducir carga de moderación manual inicial.

#### Qué se Puede Reportar

- ✅ Posts de búsqueda/oferta
- ✅ Usuarios (perfil completo)
- ✅ Autos individuales (en caso de contenido inapropiado)
- ❌ Comments (no existen aún)
- ❌ Likes (no tiene sentido)

#### Estructura Técnica

**Tabla: `reports`**
```typescript
interface Report {
  id: string;
  reporter_id: string;         // Quien reporta (FK users.id)
  reported_user_id?: string;   // Si reporte es de usuario
  reported_post_id?: string;   // Si reporte es de post
  reported_car_id?: string;    // Si reporte es de auto
  reason: 'spam' | 'scam' | 'inappropriate' | 'harassment' | 'other';
  description?: string;         // Detalles opcionales
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  created_at: Date;
  reviewed_at?: Date;
  reviewed_by?: string;        // Admin user_id
  
  // Constraints
  CHECK((reported_user_id IS NOT NULL) OR 
        (reported_post_id IS NOT NULL) OR 
        (reported_car_id IS NOT NULL))
}
```

#### Límites

**Por usuario:**
- No puede reportar el mismo contenido dos veces
- Máximo 10 reportes por día (previene abuse)

**Threshold de auto-moderación:**
- Post con 5+ reportes → se oculta automáticamente (status: `under_review`)
- Usuario con 10+ reportes (diferentes posts/autos) → flag para revisión de cuenta

---

## ROADMAP: SPRINT 3 - Likes y Notificaciones

**Objetivo:** Usuarios pueden likear autos y reciben notificaciones de actividad social.

### Backend - Likes System

**Mini-objetivos:**

- [x] Crear entidad `CarLike` con Drizzle
- [x] Crear migración para tabla `car_likes` con constraint único
- [x] Ejecutar migración
- [x] Agregar campo a `cars`: `likes_count INT DEFAULT 0`
- [x] Crear migración para campo nuevo
- [x] Crear `LikesRepository` con métodos:
  - `create(userId, carId)`
  - `delete(userId, carId)`
  - `findByCarId(carId, page, limit)`
  - `isLiked(userId, carId)`
  - `getLikesCount(carId)`
- [x] Crear `LikesService` con lógica:
  - `likeCar(userId, carId)` - Verificar auto existe, no es propio, crear, incrementar, emitir evento
  - `unlikeCar(userId, carId)` - Eliminar, decrementar, emitir evento
  - `getLikers(carId, page, limit)` (máximo 100)

- [x] Implementar throttling: 100 likes por hora
- [x] Crear `LikesController` con endpoints


**Archivos a crear:**
- `apps/api/src/modules/social/likes/entities/car-like.entity.ts`
- `apps/api/src/database/migrations/XXXX_create_car_likes.ts`
- `apps/api/src/modules/social/likes/likes.repository.ts`
- `apps/api/src/modules/social/likes/likes.service.ts`
- `apps/api/src/modules/social/likes/likes.controller.ts`

### Backend - Notifications System

**Mini-objetivos:**

- [x] Crear entidad `Notification` con Drizzle
- [x] Crear migración para tabla `notifications`
- [x] Ejecutar migración
- [x] Crear `NotificationsRepository` con métodos CRUD
- [x] Crear `NotificationsService` con lógica de negocio
- [x] Crear `NotificationsController` con endpoints
- [x] Implementar cron job semanal para limpiar notificaciones antiguas

**Archivos a crear:**
- `apps/api/src/modules/social/notifications/entities/notification.entity.ts`
- `apps/api/src/database/migrations/XXXX_create_notifications.ts`
- `apps/api/src/modules/social/notifications/notifications.repository.ts`
- `apps/api/src/modules/social/notifications/notifications.service.ts`
- `apps/api/src/modules/social/notifications/notifications.controller.ts`

### Backend - Event Subscribers for Notifications

**Mini-objetivos:**

- [x] En `EventsSubscriber`, agregar handler para `user.followed`
- [x] Agregar handler para `car.liked`
- [x] Agregar handler para `milestone.reached`

### Frontend - Like Button

**Mini-objetivos:**

- [x] Crear component `LikeButton.tsx`
- [x] Implementar estados (no likeado / likeado / loading)
- [x] Implementar hook `useLike(carId)`
- [x] Manejar optimistic updates
- [x] Agregar animación al likear


**Archivo a crear:**
- `apps/web/src/features/social/components/likes/LikeButton.tsx`

### Frontend - Integration with Feed

**Mini-objetivos:**

- [x] En `CarAddedItem` y `WishlistAchievedItem`, agregar `LikeButton`
- [x] En detalle de auto, agregar `LikeButton`
- [x] En galería de colección, agregar `LikeButton` en cada card

### Frontend - Notifications Bell

**Mini-objetivos:**

- [x] Crear component `NotificationBell.tsx`
- [x] Implementar badge con contador de no leídas
- [x] Implementar hook `useNotifications()`
- [x] Implementar hook `useUnreadCount()` con polling cada 30 segundos
- [x] Implementar dropdown `NotificationDropdown.tsx`
- [x] Implementar component `NotificationItem.tsx` con variantes
- [x] Click en notificación: marca como leída, navega, cierra dropdown
- [x] Botón "Marcar todas como leídas"

**Archivos a crear:**
- `apps/web/src/features/social/components/notifications/NotificationBell.tsx`
- `apps/web/src/features/social/components/notifications/NotificationDropdown.tsx`
- `apps/web/src/features/social/components/notifications/NotificationItem.tsx`

### Frontend - Header Integration

**Mini-objetivos:**

- [x] Agregar `NotificationBell` al header
- [x] Posicionar a la izquierda del avatar
- [x] Testear que no rompe layout en mobile

### Validación Sprint 3

**Criterios de completitud:**

- [x] Usuario puede likear autos ajenos
- [x] Contador se actualiza inmediatamente
- [x] Dueño del auto recibe notificación
- [x] NotificationBell muestra badge correcto
- [x] Click en notificación navega correctamente

---

## ROADMAP: SPRINT 4 - Posts de Búsqueda y Oferta

**Objetivo:** Usuarios pueden publicar búsquedas y ofertas que aparecen en el feed.

### Backend - User Contact Info

**Mini-objetivos:**

- [ ] Agregar campos a tabla `users`: `contact_info`, `is_trader`, `is_seller`
- [ ] Crear migración
- [ ] Modificar DTOs de usuario para incluir campos
- [ ] Modificar endpoint `PUT /users/me` para permitir actualizar

### Backend - User Posts

**Mini-objetivos:**

- [ ] Crear entidad `UserPost` con Drizzle
- [ ] Crear migración para tabla `user_posts`
- [ ] Crear `PostsRepository` con métodos CRUD
- [ ] Crear `PostsService` con lógica:
  - Validar límites (5 activos, 3 por día)
  - Calcular `expires_at` (30 días)
  - Emitir eventos
- [ ] Implementar cron job diario para expirar posts
- [ ] Implementar throttling
- [ ] Crear `PostsController` con endpoints

**Archivos a crear:**
- `apps/api/src/modules/social/posts/entities/user-post.entity.ts`
- `apps/api/src/database/migrations/XXXX_create_user_posts.ts`
- `apps/api/src/modules/social/posts/posts.repository.ts`
- `apps/api/src/modules/social/posts/posts.service.ts`
- `apps/api/src/modules/social/posts/posts.controller.ts`

### Backend - Integration with Feed

**Mini-objetivos:**

- [ ] En `EventsSubscriber`, agregar handler para `post.created`
- [ ] Modificar `FeedService` para incluir posts en queries
- [ ] Agregar método `FeedService.getPostsFeed(page, limit)`

### Frontend - Profile Settings

**Mini-objetivos:**

- [ ] En página de settings, agregar sección "Contacto e Intercambios"
- [ ] Campo `contact_info` (textarea, 500 chars max)
- [ ] Checkboxes `is_trader` y `is_seller`

### Frontend - Post Creator

**Mini-objetivos:**

- [ ] Crear component `PostCreator.tsx`
- [ ] Implementar form con radio para tipo, campos específicos por tipo
- [ ] Implementar hook `useCreatePost()`
- [ ] Validaciones y preview

**Archivos a crear:**
- `apps/web/src/features/social/components/posts/PostCreator.tsx`
- `apps/web/src/features/social/components/posts/SearchPostForm.tsx`
- `apps/web/src/features/social/components/posts/OfferPostForm.tsx`

### Frontend - Wishlist Integration

**Mini-objetivos:**

- [ ] En cada item de wishlist, agregar botón "🔍 Publicar búsqueda"
- [ ] Click abre `PostCreator` con datos pre-rellenados

### Frontend - Post Cards en Feed

**Mini-objetivos:**

- [ ] Crear component `SearchPostCard.tsx`
- [ ] Crear component `OfferPostCard.tsx`
- [ ] Implementar botón "Contactar" que muestra modal
- [ ] Implementar `ContactModal.tsx` con disclaimer

**Archivos a crear:**
- `apps/web/src/features/social/components/posts/SearchPostCard.tsx`
- `apps/web/src/features/social/components/posts/OfferPostCard.tsx`
- `apps/web/src/features/social/components/posts/ContactModal.tsx`

### Frontend - Tab "Búsquedas y Ofertas"

**Mini-objetivos:**

- [ ] En `FeedPage`, activar tab completamente
- [ ] Implementar FAB visible solo en este tab
- [ ] Click en FAB abre `PostCreator`

### Frontend - Profile "Posts Activos" Tab

**Mini-objetivos:**

- [ ] En perfil, agregar tab "Posts activos"
- [ ] Mostrar posts del usuario activos
- [ ] Empty state apropiado

### Frontend - Badges en Perfil

**Mini-objetivos:**

- [ ] Si `user.is_trader`, mostrar badge "🔄 Hace intercambios"
- [ ] Si `user.is_seller`, mostrar badge "💰 Vendedor"
- [ ] Badges en header de perfil, cards de usuario, posts

### Testing Sprint 4

**Mini-objetivos:**

- [ ] Backend: Testear creación de posts, límites, expiración
- [ ] Frontend: Verificar PostCreator, shortcut desde wishlist, badges

### Validación Sprint 4

**Criterios de completitud:**

- [ ] Usuario puede crear posts de búsqueda y oferta
- [ ] Posts aparecen en feed
- [ ] Tab dedicado muestra solo posts
- [ ] Botón "Contactar" funciona
- [ ] Posts expiran automáticamente
- [ ] Badges aparecen correctamente

---

## ROADMAP: SPRINT 5 - Sistema de Reportes

**Objetivo:** Comunidad puede reportar contenido y sistema auto-modera.

### Backend - Reports System

**Mini-objetivos:**

- [ ] Crear entidad `Report` con Drizzle
- [ ] Crear migración para tabla `reports`
- [ ] Crear `ReportsRepository` con métodos CRUD
- [ ] Crear `ReportsService` con lógica de threshold
- [ ] Implementar límite: 10 reportes por día por usuario
- [ ] Crear `ReportsController` con endpoints (admin protegido)

**Archivos a crear:**
- `apps/api/src/modules/social/reports/entities/report.entity.ts`
- `apps/api/src/database/migrations/XXXX_create_reports.ts`
- `apps/api/src/modules/social/reports/reports.repository.ts`
- `apps/api/src/modules/social/reports/reports.service.ts`
- `apps/api/src/modules/social/reports/reports.controller.ts`

### Backend - Auto-Moderation

**Mini-objetivos:**

- [ ] En `EventsSubscriber`, handler para `report.threshold_reached`
- [ ] Implementar servicio de emails para alertas
- [ ] Template de email para moderación

### Backend - Admin Guards

**Mini-objetivos:**

- [ ] Crear guard `AdminGuard`
- [ ] Agregar campo `is_admin BOOLEAN` a users
- [ ] Proteger endpoints de admin

**Archivo a crear:**
- `apps/api/src/shared/guards/admin.guard.ts`

### Frontend - Report Modal

**Mini-objetivos:**

- [ ] Crear component `ReportModal.tsx`
- [ ] Form con motivo, textarea opcional, disclaimer
- [ ] Implementar hook `useReport()`

**Archivo a crear:**
- `apps/web/src/features/social/components/reports/ReportModal.tsx`

### Frontend - Report Button Integration

**Mini-objetivos:**

- [ ] En dropdown de posts, agregar "🚩 Reportar"
- [ ] En perfil ajeno, agregar "🚩 Reportar usuario"

### Frontend - Admin Panel

**Mini-objetivos:**

- [ ] Crear página `AdminReportsPage.tsx` (protegida)
- [ ] Implementar filtros (status, content type)
- [ ] Implementar lista de reportes con acciones
- [ ] Modal de acciones (descartar, eliminar, advertir, suspender, banear)

**Archivos a crear:**
- `apps/web/src/features/social/pages/AdminReportsPage.tsx`
- `apps/web/src/features/social/components/reports/ReportCard.tsx`

### Frontend - Routing

**Mini-objetivos:**

- [ ] Agregar ruta `/admin/reports` protegida
- [ ] Redirect si usuario no es admin

### Testing Sprint 5

**Mini-objetivos:**

- [ ] Backend: Testear creación de reportes, límites, threshold
- [ ] Frontend: Verificar modal, admin panel, protección de rutas

### Validación Sprint 5

**Criterios de completitud:**

- [ ] Usuario puede reportar contenido
- [ ] Admin recibe email cuando threshold
- [ ] Contenido se oculta automáticamente
- [ ] Admin puede gestionar reportes

---

## Arquitectura y Estructura

### Reestructuración del Monorepo

**Estado actual:**
```
wheels/
├── apps/
│   ├── api/
│   │   └── src/
│   │       ├── controllers/
│   │       ├── database/
│   │       ├── dto/
│   │       ├── services/
│   │       └── validators/
│   └── web/
└── packages/
```

**Problema:** Organización por capa dificulta escalar.

**Solución: Feature-based organization**

```
wheels/
├── apps/
│   ├── api/
│   │   └── src/
│   │       ├── modules/
│   │       │   ├── auth/
│   │       │   ├── users/
│   │       │   ├── cars/
│   │       │   └── social/              ← NUEVO
│   │       │       ├── social.module.ts
│   │       │       ├── events/
│   │       │       │   ├── events.service.ts
│   │       │       │   ├── events.subscriber.ts
│   │       │       │   └── event-types.ts
│   │       │       ├── feed/
│   │       │       │   ├── feed.controller.ts
│   │       │       │   ├── feed.service.ts
│   │       │       │   ├── feed.repository.ts
│   │       │       │   ├── entities/
│   │       │       │   └── dto/
│   │       │       ├── follows/
│   │       │       ├── likes/
│   │       │       ├── notifications/
│   │       │       ├── posts/
│   │       │       └── reports/
│   │       ├── shared/
│   │       ├── database/
│   │       └── config/
│   │
│   └── web/
│       └── src/
│           ├── features/
│           │   ├── auth/
│           │   ├── cars/
│           │   ├── profile/
│           │   └── social/           ← NUEVO
│           │       ├── components/
│           │       │   ├── feed/
│           │       │   ├── follow/
│           │       │   ├── likes/
│           │       │   ├── notifications/
│           │       │   ├── posts/
│           │       │   └── reports/
│           │       ├── hooks/
│           │       ├── pages/
│           │       └── api/
│           ├── shared/
│           └── lib/
│
└── packages/
    └── shared-types/
```

### Sistema de Eventos (Crítico)

**Sin eventos:**
```typescript
// 😱 Acoplamiento directo
async create(createCarDto) {
  const car = await this.carsRepo.save(createCarDto);
  await this.feedService.createEvent(...);
  await this.notificationsService.notifyFollowers(...);
  return car;
}
```

**Con eventos:**
```typescript
// 🎉 Desacoplado
async create(createCarDto) {
  const car = await this.carsRepo.save(createCarDto);
  this.eventEmitter.emit('car.added', { userId, carId });
  return car;
}

// En subscriber
@OnEvent('car.added')
async handleCarAdded({ userId, carId }) {
  await this.feedService.createEvent(...);
  await this.notificationsService.notifyFollowers(...);
}
```

**Eventos a implementar:**

```typescript
export const EVENTS = {
  // Cars
  CAR_ADDED: 'car.added',
  CAR_UPDATED: 'car.updated',
  CAR_DELETED: 'car.deleted',
  
  // Wishlist
  WISHLIST_ITEM_ADDED: 'wishlist.item_added',
  WISHLIST_ITEM_ACHIEVED: 'wishlist.item_achieved',
  
  // Groups
  GROUP_CREATED: 'group.created',
  
  // Social
  USER_FOLLOWED: 'user.followed',
  USER_UNFOLLOWED: 'user.unfollowed',
  CAR_LIKED: 'car.liked',
  CAR_UNLIKED: 'car.unliked',
  
  // Posts
  POST_CREATED: 'post.created',
  POST_RESOLVED: 'post.resolved',
  POST_EXPIRED: 'post.expired',
  
  // Milestones
  MILESTONE_REACHED: 'milestone.reached',
  
  // Reports
  CONTENT_REPORTED: 'content.reported',
  REPORT_THRESHOLD_REACHED: 'report.threshold_reached',
} as const;
```

---

**FIN DE PARTE 2**

export const EVENTS = {
// Cars
CAR_ADDED: 'car.added',
CAR_UPDATED: 'car.updated',
CAR_DELETED: 'car.deleted',

// Wishlist
WISHLIST_ITEM_ADDED: 'wishlist.item_added',
WISHLIST_ITEM_ACHIEVED: 'wishlist.item_achieved',

// Groups
GROUP_CREATED: 'group.created',

// Social
USER_FOLLOWED: 'user.followed',
USER_UNFOLLOWED: 'user.unfollowed',
CAR_LIKED: 'car.liked',
CAR_UNLIKED: 'car.unliked',

// Posts
POST_CREATED: 'post.created',
POST_RESOLVED: 'post.resolved',
POST_EXPIRED: 'post.expired',

// Milestones
MILESTONE_REACHED: 'milestone.reached',

// Reports
CONTENT_REPORTED: 'content.reported',
REPORT_THRESHOLD_REACHED: 'report.threshold_reached',
} as const;

# Wheels House - Sistema Social: Especificación Completa

# PARTE 3 DE 3: Experiencia de Usuario, Post-Launch y Apéndices

## Experiencia de Usuario

### Flujo Completo: Usuario Nuevo

**Día 1 - Descubrimiento**

1. Usuario llega a Wheels House (ads, boca a boca, post viral)
2. Landing page muestra propuesta de valor clara:
   - "La red social para coleccionistas de Hot Wheels"
   - Preview del feed con actividad real
   - CTA: "Ver actividad de la comunidad" (sin necesidad de registro)
3. Usuario entra a `/feed` sin registrarse → ve Tab "Explorar"
4. Ve feed con actividad:
   - "Juan agregó Corvette C8 a su colección"
   - "María consiguió un auto de su wishlist: Ferrari F40"
   - "Pedro está buscando: Skyline GT-R 1999"
5. Usuario piensa: "Ah, hay movimiento. Esto está activo."
6. Clickea en perfil de Juan, ve su colección de 150 autos
7. Impresionado, decide registrarse

**Día 1 - Onboarding**

1. Registro simple: email + contraseña (o Google/Facebook)
2. Username único
3. Avatar opcional
4. Primera acción guiada: "Agregá tu primer auto"
   - Upload foto
   - Nombre, marca, año (autocompletado con sugerencias)
   - Botón grande: "Agregar a mi colección"
5. Confirmación: "¡Auto agregado! 🎉"
6. CTA: "Explorá la comunidad" → redirect a `/feed`

**Día 1-3 - Construcción de Colección**

1. Usuario sube 10-20 autos en sesión inicial
2. Crea primer grupo: "Ferraris"
3. Marca algunos en wishlist
4. Entre subidas, vuelve a `/feed` → ve su propio "Juan agregó [auto]"
5. Se da cuenta: "Mi actividad aparece aquí. Cool."
6. Ve actividad de otros, clickea perfiles, descubre colecciones
7. Encuentra coleccionista con gustos similares → botón "Seguir"
8. Notificación in-app: "Empezaste a seguir a Pedro"

**Día 4-7 - Engagement Social**

1. Usuario entra, va a Tab "Siguiendo"
2. Ve: "Pedro agregó Mustang 1969"
3. Le gusta → da like
4. Pedro recibe notificación: "Juan likeó tu Mustang 1969"
5. Pedro entra a Wheels House (pulled back), ve notificación
6. Clickea → va a su auto, ve que Juan lo likeó
7. Pedro visita perfil de Juan, le gusta su colección → lo sigue
8. Juan recibe notificación: "Pedro te siguió"
9. Juan entra → ve notificación → visita perfil de Pedro
10. **Loop cerrado**: ambos ahora se siguen y ven actividad mutua

**Día 8-14 - Participación Activa**

1. Usuario tiene auto raro que muchos buscan
2. Crea post: "Ofrezco Skyline GT-R 1999 - Intercambio o venta"
3. Post aparece en feed global → 5 personas ven
4. 2 clickean "Me interesa" → ven info de contacto
5. Usuario recibe mensaje por Instagram
6. Negocian, completan intercambio
7. Usuario marca post como "Resuelto"
8. Resultado: Wheels House facilitó la conexión, valor tangible generado

**Día 15-30 - Retención**

Usuario ahora:

- Entra 2-3 veces por semana
- Revisa Tab "Siguiendo" → ve qué consiguieron sus follows
- Da likes regularmente
- Sube nuevos autos cuando compra
- Chequea Tab "Búsquedas y ofertas" cuando busca algo específico
- Recibe notificaciones que lo traen de vuelta

**Resultado:** Usuario retenido.

---

### URLs y Navegación

**Estructura de URLs:**

```
# Públicas (sin auth)
/                                  → Landing page
/login                             → Login
/register                          → Registro

# Feed
/feed                              → Feed (default: tab Explorar)
/feed?tab=explore                  → Explícito: Explorar
/feed?tab=following                → Tab Siguiendo
/feed?tab=posts                    → Tab Búsquedas y Ofertas

# Perfil propio
/profile                           → Mi perfil
/profile/settings                  → Configuración
/profile/collection                → Mi colección
/profile/wishlist                  → Mi wishlist
/profile/followers                 → Mis seguidores
/profile/following                 → A quién sigo
/profile/posts                     → Mis posts activos

# Perfil ajeno
/profile/:username                 → Perfil de usuario
/profile/:username/collection      → Colección del usuario
/profile/:username/wishlist        → Wishlist del usuario (si pública)
/profile/:username/followers       → Seguidores del usuario
/profile/:username/following       → A quién sigue el usuario
/profile/:username/posts           → Posts activos del usuario

# Auto específico
/profile/:username/cars/:carId     → Detalle de auto

# Admin
/admin/reports                     → Panel de reportes (protegido)
```

**Navegación principal (Header):**

```tsx
<Header>
  <Logo onClick={() => navigate("/")} />

  <Nav>
    <NavItem to="/feed" active={isActive}>
      🌍 Explorar
    </NavItem>
    <NavItem to="/profile/collection">📦 Mi Colección</NavItem>
    <NavItem to="/profile/wishlist">⭐ Wishlist</NavItem>
  </Nav>

  <UserActions>
    <NotificationBell />
    <UserMenu>
      <Avatar onClick={toggleMenu} />
      <Dropdown>
        <MenuItem to="/profile">Mi Perfil</MenuItem>
        <MenuItem to="/profile/settings">Configuración</MenuItem>
        <Divider />
        <MenuItem onClick={logout}>Cerrar sesión</MenuItem>
      </Dropdown>
    </UserMenu>
  </UserActions>
</Header>
```

---

### Responsive y Mobile

**Consideraciones:**

- 80%+ de usuarios pueden estar en mobile
- Feed debe funcionar perfecto en pantallas pequeñas
- Infinite scroll crítico en mobile (no paginación tradicional)
- Touch-friendly: botones grandes, spacing adecuado

**Adaptaciones mobile:**

**Header mobile:**

```tsx
<HeaderMobile>
  <Logo />
  <Actions>
    <NotificationBell />
    <HamburgerMenu onClick={toggleSidebar} />
  </Actions>
</HeaderMobile>

<SidebarMobile open={sidebarOpen}>
  <NavItem to="/feed">Explorar</NavItem>
  <NavItem to="/profile/collection">Mi Colección</NavItem>
  <NavItem to="/profile/wishlist">Wishlist</NavItem>
  <NavItem to="/profile">Mi Perfil</NavItem>
  <Divider />
  <NavItem onClick={logout}>Cerrar sesión</NavItem>
</SidebarMobile>
```

**Feed mobile:**

- Cards full-width (no grid)
- Imágenes ocupan ancho completo
- Texto legible (16px mínimo)
- Botones táctiles (44px mínimo de altura)

**Tabs mobile:**

- Swipeable tabs (gesto de swipe para cambiar)
- Indicador de tab activo claro

---

### Accesibilidad

**Estándares mínimos:**

- **Keyboard navigation**: Todo clickeable accesible con Tab
- **Screen readers**: Labels en inputs, alt text en imágenes
- **Contraste**: Ratios WCAG AA mínimo (4.5:1 para texto)
- **Focus visible**: Outline claro en elementos focuseados
- **Semántica HTML**: `<button>`, `<nav>`, `<main>`, etc.

**Implementación:**

```tsx
// Like button accesible
<button
  onClick={handleLike}
  aria-label={isLiked ? 'Unlike this car' : 'Like this car'}
  aria-pressed={isLiked}
>
  <Icon>{isLiked ? '❤️' : '🤍'}</Icon>
  <span aria-live="polite">{likesCount}</span>
</button>

// Notificaciones accesibles
<button
  onClick={toggleNotifications}
  aria-label="Notifications"
  aria-expanded={isOpen}
  aria-haspopup="true"
>
  <Icon>🔔</Icon>
  {unreadCount > 0 && (
    <Badge aria-label={`${unreadCount} unread notifications`}>
      {unreadCount}
    </Badge>
  )}
</button>
```

---

### Visualización Completa del Feed

**Layout de /feed:**

```tsx
<FeedPage>
  {/* Tabs principales */}
  <FeedTabs>
    <Tab active={activeTab === "explore"} onClick={() => setTab("explore")}>
      🌍 Explorar
    </Tab>

    <Tab active={activeTab === "following"} onClick={() => setTab("following")}>
      👥 Siguiendo
      {followingCount > 0 && <Badge>{followingCount}</Badge>}
    </Tab>

    <Tab active={activeTab === "posts"} onClick={() => setTab("posts")}>
      💬 Búsquedas y ofertas
    </Tab>
  </FeedTabs>

  {/* Filtros secundarios (solo en Explorar y Siguiendo) */}
  <FeedFilters show={activeTab !== "posts"}>
    <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>
      Todo
    </FilterChip>

    <FilterChip active={filter === "cars"} onClick={() => setFilter("cars")}>
      Autos agregados
    </FilterChip>

    <FilterChip
      active={filter === "milestones"}
      onClick={() => setFilter("milestones")}
    >
      Logros
    </FilterChip>

    <FilterChip
      active={filter === "wishlist"}
      onClick={() => setFilter("wishlist")}
    >
      Wishlist conseguidos
    </FilterChip>
  </FeedFilters>

  {/* Contenido del feed */}
  <FeedContent>
    {activeTab === "following" && followingCount === 0 && (
      <EmptyState>
        <Icon>👥</Icon>
        <Title>No sigues a nadie aún</Title>
        <Description>
          Empieza a seguir coleccionistas desde la pestaña Explorar
        </Description>
        <Button onClick={() => setTab("explore")}>Explorar comunidad</Button>
      </EmptyState>
    )}

    {feedItems.length === 0 && activeTab !== "following" && (
      <EmptyState>
        <Icon>🏜️</Icon>
        <Title>No hay actividad reciente</Title>
        <Description>Sé el primero en agregar autos</Description>
      </EmptyState>
    )}

    {/* Feed items con scroll infinito */}
    <FeedList>
      {feedItems.map((item) => (
        <FeedItem key={item.id} item={item} />
      ))}

      <InfiniteScrollTrigger onVisible={loadMoreItems} loading={isLoading} />

      {isLoading && <LoadingSpinner />}

      {!hasMore && feedItems.length > 0 && (
        <EndMessage>Has visto toda la actividad reciente</EndMessage>
      )}
    </FeedList>
  </FeedContent>

  {/* FAB para crear post (solo en tab "posts") */}
  {activeTab === "posts" && (
    <FloatingActionButton onClick={openCreatePostModal}>
      + Crear búsqueda/oferta
    </FloatingActionButton>
  )}
</FeedPage>
```

---

## POST-LAUNCH: Mejoras y Features Adicionales

Una vez completados los sprints 1-5 y lanzado el producto, estas son mejoras que pueden implementarse basándose en feedback real de usuarios:

### Mejoras de Feed

**Mini-objetivos:**

- [ ] Implementar WebSocket para notificaciones real-time (reemplazar polling)
- [ ] Agregar filtros avanzados en feed:
  - Por marca de auto
  - Por fecha (última semana, último mes)
- [ ] Implementar "Posts guardados" (bookmark functionality)
- [ ] Agregar search en feed (buscar por marca, modelo, usuario)

### Mejoras de Posts

**Mini-objetivos:**

- [ ] Wishlist matches: notificar cuando alguien agrega auto que está en tu wishlist
- [ ] Búsqueda inteligente: sugerir matches entre búsquedas y ofertas
- [ ] Imágenes múltiples en posts
- [ ] Tags personalizados en posts

### Gamificación y Engagement

**Mini-objetivos:**

- [ ] Sistema de achievements/badges:
  - "Primer auto"
  - "100 autos"
  - "10 seguidores"
  - "Primera búsqueda resuelta"
- [ ] Leaderboards:
  - Top coleccionistas (más autos)
  - Top contribuidores (más posts activos)
  - Top comunidad (más seguidores)
- [ ] Streaks: días consecutivos agregando autos
- [ ] Featured collector del mes

### Comentarios y Conversaciones

**Mini-objetivos:**

- [ ] Sistema de comentarios en autos
- [ ] Mensajería directa in-app (DM)
- [ ] Threads en posts (discusión sobre búsquedas)

### Analíticas y Stats

**Mini-objetivos:**

- [ ] Dashboard de usuario:
  - Autos más vistos
  - Engagement rate
  - Crecimiento de colección
- [ ] Stats de comunidad:
  - Marcas más populares
  - Trending cars
  - Búsquedas más comunes

### Internacionalización

**Mini-objetivos:**

- [ ] Implementar i18n (react-i18next)
- [ ] Traducir UI a inglés
- [ ] Permitir usuario cambiar idioma en settings
- [ ] Detectar idioma del navegador automáticamente

### Optimizaciones de Performance

**Mini-objetivos:**

- [ ] Implementar image optimization (next/image o similar)
- [ ] Lazy loading de imágenes en feed
- [ ] Service Worker para offline functionality
- [ ] Redis cache para queries frecuentes
- [ ] CDN para imágenes de usuarios

### Mejoras de UX

**Mini-objetivos:**

- [ ] Onboarding interactivo para nuevos usuarios
- [ ] Tooltips en features complejas
- [ ] Keyboard shortcuts (j/k para navegar feed)
- [ ] Dark mode
- [ ] Personalización de tema (colores)

---

## Métricas de Éxito Post-Launch

### Semana 1

- [ ] 50+ usuarios registrados
- [ ] 500+ autos agregados
- [ ] 100+ eventos en feed diarios

### Mes 1

- [ ] Retención semanal 30%+
- [ ] 10+ posts de búsqueda/oferta activos
- [ ] 50+ follows creados
- [ ] 200+ likes dados

### Mes 3

- [ ] Retención semanal 40%+
- [ ] DAU/MAU ratio > 0.2
- [ ] 5+ intercambios exitosos facilitados
- [ ] Usuarios piden features específicas orgánicamente

---

## Criterios para Considerar Monetización

### NO monetizar hasta:

- [ ] 500+ usuarios activos mensuales
- [ ] Retención semanal consistente 40%+
- [ ] Usuarios usan la plataforma sin incentivos
- [ ] Hay evidencia de valor tangible generado (intercambios exitosos)

### Opciones de monetización cuando llegue el momento:

- Plan free limitado (3 posts activos, 500 follows)
- Plan premium ($5-10/mes): posts ilimitados, sin expiración, destacados, analytics
- Sponsorships de tiendas (publicar stock sin límites)
- Comisión opcional en intercambios (solo si eventualmente manejás transacciones)

---

## Filosofía de Implementación

### Principios

**Calidad sobre velocidad**: Cada sprint debe resultar en código bien testeado, documentado y mantenible. No hay prisa.

**Validación constante**: Después de sprints mayores, probar con usuarios reales. Su feedback guiará prioridades futuras.

**Flexibilidad**: Este roadmap es una guía, no una ley. Si descubrís que algo no funciona, pivoteamos.

**Documentación**: Mantener este archivo actualizado en cada módulo nuevo, en cada avance realizado.

### Approach de Desarrollo

**Incremental**: Cada mini-objetivo es un paso alcanzable. No intentar hacer todo de una vez.

**Testeable**: Cada feature debe tener criterios claros de validación. "¿Cómo sé que esto funciona?"

**Reversible**: Si una decisión resulta mala, debe ser fácil cambiarla. Evitar acoplamiento fuerte.

**Comunicable**: Código claro > código clever. Nombres descriptivos, funciones pequeñas, comments donde sea necesario.

---

## Apéndice: Checklist de Lanzamiento

### Pre-Launch (Antes de beta con amigos)

**Backend:**

- [x] Todas las migraciones ejecutadas en producción
- [x] Variables de entorno configuradas (Cloudinary, Resend, DB)
- [x] CORS configurado correctamente
- [ ] Rate limiting activado
- [x] Logging configurado (Sentry o similar)
- [x] Health check endpoint funciona

**Frontend:**

- [x] Variables de entorno de producción configuradas
- [ ] Analytics configurado (opcional: Google Analytics, Plausible)
- [ ] Error boundary implementado
- [ ] Meta tags SEO configurados
- [x] Favicon y app icons listos

**Legal:**

- [ ] Términos de servicio publicados
- [ ] Política de privacidad publicada
- [ ] Disclaimer en posts de búsqueda/oferta

**Infraestructura:**

- [x] Dominio configurado
- [x] SSL certificado activo
- [x] Vercel deployment funciona
- [x] Railway deployment funciona
- [ ] Backups automáticos de BD configurados

### Post-Launch (Después de beta)

**Monitoreo:**

- [ ] Configurar alertas de downtime
- [ ] Configurar alertas de errores críticos
- [ ] Dashboard de métricas clave (usuarios, eventos, posts)

**Comunicación:**

- [ ] Email de contacto configurado
- [ ] Formulario de feedback en app
- [ ] Canal para reportar bugs

**Marketing:**

- [ ] Landing page optimizada
- [ ] Screenshots actualizados
- [ ] Video demo (opcional)
- [ ] Posts en grupos de coleccionistas

---

## Apéndice: Troubleshooting Común

### Problema: Feed no carga

**Diagnóstico:**

1. Verificar que endpoint `/feed` responde (Postman/cURL)
2. Verificar logs de backend para errores
3. Verificar query de DB no está tardando mucho (> 2 segundos)

**Soluciones:**

- Agregar índices en tabla `feed_events` (user_id, created_at)
- Implementar cache en Redis
- Reducir ventana temporal de 30 a 14 días

### Problema: Contadores de followers/likes desincronizados

**Diagnóstico:**

1. Verificar si hay rows en `user_follows` o `car_likes` sin actualizar contador
2. Correr query manual: `SELECT COUNT(*) FROM user_follows WHERE followed_id = X`
3. Comparar con `users.followers_count`

**Soluciones:**

- Script de sincronización manual:

```sql
UPDATE users SET followers_count = (
  SELECT COUNT(*) FROM user_follows WHERE followed_id = users.id
);
```

- Implementar cron job diario de sincronización

### Problema: Notificaciones no llegan

**Diagnóstico:**

1. Verificar que evento se está emitiendo correctamente
2. Verificar que subscriber está registrado
3. Verificar logs del subscriber
4. Verificar que notificación se creó en BD

**Soluciones:**

- Agregar logging extensivo en EventsSubscriber
- Verificar que módulo de notificaciones está importado en AppModule
- Testear endpoint manualmente: `POST /notifications` (crear notificación directa)

---

## Diseño de Interfaz: Sidebars en Desktop

### Propósito

Optimizar el uso del espacio horizontal en pantallas grandes, reduciendo el "aire" lateral y proporcionando acceso rápido a funciones clave sin salir del feed.

### Implementación Actual (Sprint 1.5)

**Sidebar Izquierdo (Compacto):**

- **Mini-Perfil**: Avatar, handle y contadores rápidos (autos/grupos).
- **Acceso Directo**: Link a perfil público.
- **Navegación**: Links rápidos a Mi Colección, Grupos, Wishlist, Stats y Configuración.
- **Acción Principal**: Botón "Agregar Auto" persistente.

**Sidebar Derecho (Utilidad):**

- **Búsqueda**: Filtro por texto en el feed (Client-side inicialmente).
- **Filtros de Contenido**: Toggle para filtrar por tipos de eventos (Sólo autos, sólo ofertas, etc).
- **Filtros de Marca**: Chips para filtrado rápido por marcas populares.

### Futuro: De Sidebars a Discovery Engines

Cuando la base de usuarios crezca, los sidebars evolucionarán hacia:

1. **Discovery Sidebar (Derecha):**
   - **Sugerencias**: "Coleccionistas para seguir" basado en marcas en común.
   - **Trending**: Marcas que son tendencia esta semana.
   - **Actividad Global**: Gráfico minimalista de actividad de la comunidad.

2. **Contextual Sidebar (Izquierda):**
   - **Notificaciones rápidas**: Preview de últimas alertas.
   - **Shortcuts dinámicos**: Acceso a los grupos más visitados por el usuario.

---

## Apéndice: Glosario de Términos

**DAU/MAU**: Daily Active Users / Monthly Active Users. Ratio que indica qué porcentaje de usuarios mensuales usa la app diariamente.

**Retention rate**: Porcentaje de usuarios que vuelven después de X días (semanal, mensual).

**FOMO**: Fear of Missing Out. Sensación de que otros están haciendo algo interesante y no quiero perderlo.

**Optimistic update**: Actualizar UI inmediatamente asumiendo que el request va a tener éxito, antes de recibir confirmación del servidor.

**Throttling**: Limitar la frecuencia de requests para prevenir abuse.

**Denormalization**: Duplicar datos (ej: contadores) para evitar queries costosos en read-time.

**Event-driven architecture**: Arquitectura donde módulos se comunican via eventos en vez de llamadas directas.

**Feed**: Stream de actividad cronológica.

**Infinite scroll**: Técnica de paginación donde contenido carga automáticamente al hacer scroll.

**Empty state**: UI que se muestra cuando no hay contenido (ej: "No sigues a nadie aún").

**Rate limiting**: Restringir número de requests por usuario en ventana de tiempo.

---

## Notas Finales

### Recordatorios Importantes

1. **No hay deadlines**: Implementamos a ritmo. Calidad > velocidad.

2. **Validá con usuarios reales**: Después de cada sprint mayor, invitamos a amigos coleccionistas a probar.

3. **Documentá decisiones**: Cuando tomes una decisión técnica importante (ej: "elegí Follow unidireccional porque X"), escribila en un README o en comments.

4. **Commitea frecuentemente**: Feature branches, commits descriptivos, PRs para merge a main.

5. **No te obsesiones con perfección**: MVP funcional > producto perfecto que nunca se lanza.

6. **Pedí feedback temprano**: Mejor descubrir que algo no funciona en sprint 2 que en sprint 5.

7. **Celebrá milestones**: Completaste Sprint 1? Feed funciona? 🎉 Tomate un descanso.

8. **Mantené scope bajo control**: Si una feature empieza a crecer demasiado, dividila en sub-features.

9. **Usá las herramientas que tenés**: Google Antigravity para tareas repetitivas, Claude para consultas técnicas.

10. **Divertite**: Estás construyendo algo para una comunidad que te apasiona. Disfrutá el proceso.

---

### Próximos Pasos Inmediatos

1. **Revisar estructura actual del proyecto** y planear reestructuración si es necesaria
2. **Configurar entorno de desarrollo** para features sociales
3. **Comenzar Sprint 1**: Sistema de eventos + Feed básico
4. **Testear cada mini-objetivo** antes de avanzar al siguiente

---

**Este es el mapa completo para construir el sistema social de Wheels House.**

**Sprint por sprint. Feature por feature. Mini-objetivo por mini-objetivo.**

---

**FIN DE PARTE 3**

**FIN DEL DOCUMENTO COMPLETO**
