## ROADMAP: Sistema de Moderación (Enfoque Progresivo)

### Filosofía
Implementar moderación de forma incremental, comenzando simple y escalando según necesidad real. Evitar sobreingeniería prematura.

---

## FASE 1: Moderación Manual Simple (IMPLEMENTAR AHORA)

**Objetivo:** Control total del administrador con mínima complejidad

### Backend - Soft Delete Fields

**Mini-objetivos:**

- [ ] Agregar campos de moderación a entidades existentes:
  ```typescript
  // Para: cars, groups, posts (cuando existan)
  hidden: boolean;              // Oculto por moderación
  hidden_reason?: string;       // Nota interna (ej: "spam", "inapropiado")
  hidden_at?: Date;
  hidden_by?: string;           // user_id del moderador
  ```

- [ ] Crear migración para agregar estos campos
- [ ] Actualizar repositorios para filtrar `hidden: true` por defecto en queries públicas
- [ ] Crear endpoint admin: `PATCH /admin/cars/:id/hide` (protegido)
- [ ] Crear endpoint admin: `PATCH /admin/groups/:id/hide` (protegido)

**Archivos a modificar/crear:**
- `apps/api/src/database/migrations/XXXX_add_moderation_fields.ts`
- `apps/api/src/modules/cars/cars.repository.ts` (filtrar hidden)
- `apps/api/src/modules/groups/groups.repository.ts` (filtrar hidden)
- `apps/api/src/modules/admin/admin.controller.ts` (nuevo)
- `apps/api/src/modules/admin/admin.service.ts` (nuevo)

### Backend - Admin Guard

**Mini-objetivos:**

- [ ] Agregar campo `is_admin: boolean` a tabla `users` (default: false)
- [ ] Crear migración
- [ ] Crear guard `AdminGuard` para proteger rutas `/admin/*`
- [ ] Asignarte manualmente `is_admin: true` en BD

**Archivos a crear:**
- `apps/api/src/shared/guards/admin.guard.ts`
- `apps/api/src/database/migrations/XXXX_add_is_admin_to_users.ts`

### Frontend - Admin Actions

**Mini-objetivos:**

- [ ] En dropdown de autos (solo visible si `user.isAdmin`):
  - Agregar opción "🚫 Ocultar auto"
- [ ] Crear `HideContentModal.tsx`:
  - Input de motivo (texto libre)
  - Botón confirmar/cancelar
- [ ] Hook `useHideContent()` para llamar endpoints admin

**Archivos a crear:**
- `apps/web/src/features/admin/components/HideContentModal.tsx`
- `apps/web/src/features/admin/hooks/useHideContent.ts`

### Frontend - User Feedback (Opcional pero recomendado)

**Mini-objetivos:**

- [ ] Botón "⚠️ Reportar problema" en footer o perfil
- [ ] Abre mailto o form simple que te envía email
- [ ] No requiere base de datos ni lógica compleja

**Beneficio:** Los usuarios tienen forma de contactarte sin que implementes sistema complejo

### Validación Fase 1

**Criterios de completitud:**

- [ ] Tú como admin puedes ocultar autos/grupos desde la UI
- [ ] Contenido oculto no aparece en feeds públicos
- [ ] Usuarios tienen forma de reportarte problemas (email/contacto)
- [ ] Implementación total: ~4-6 horas

---

## FASE 2: Moderadores Curados (IMPLEMENTAR CUANDO...)

**Señales para implementar:**
- Pasas >2 horas/semana moderando
- Tienes 2-3 personas de confianza que pueden ayudar
- ~200-500 usuarios activos

**Qué agregar:**

- [ ] Tabla `moderators` (user_id, permissions, assigned_by)
- [ ] Roles: `admin`, `moderator`
- [ ] Panel simple para moderadores: `/mod/queue`
- [ ] Log de acciones de moderación (quién ocultó qué)

**Estimación:** 1-2 días de desarrollo

---

## FASE 3: Sistema de Reportes Comunitario (IMPLEMENTAR CUANDO...)

**Señales para implementar:**
- Recibes 5+ quejas/reportes por semana
- Usuarios preguntan "¿cómo reporto esto?"
- Tienes 500+ usuarios activos
- Ya entiendes patrones de contenido problemático (por experiencia en Fase 1-2)

**Qué agregar:**

- [ ] Tabla `reports` completa con thresholds
- [ ] Rate limiting (10 reportes/día por usuario)
- [ ] Auto-ocultamiento (5+ reportes)
- [ ] Panel de reportes comunitarios
- [ ] Email alerts automáticos

**Estimación:** 1-2 semanas de desarrollo

**Estructura técnica (referencia futura):**
```typescript
interface Report {
  id: string;
  reporter_id: string;
  reported_user_id?: string;
  reported_post_id?: string;
  reported_car_id?: string;
  reported_group_id?: string;
  reason: 'spam' | 'scam' | 'inappropriate' | 'harassment' | 'other';
  description?: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  created_at: Date;
  reviewed_at?: Date;
  reviewed_by?: string;
}
```

---

## Decisión Estratégica

**Implementar ahora:** Solo Fase 1 (moderación manual simple)

**Razones:**
1. ✅ Tienes control total inicial
2. ✅ Implementación rápida (~medio día)
3. ✅ Sin complejidad innecesaria
4. ✅ Aprendes qué necesitas antes de construir sistema robusto
5. ✅ Evitas sobreingeniería para problema que aún no existe

**No implementar todavía:** Fases 2-3 (esperar señales reales de necesidad)