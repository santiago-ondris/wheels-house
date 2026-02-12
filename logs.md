# Wheels House: Guía de Logueo y Observabilidad

## Resumen del Stack

### Backend (API):
*   **Pino (`nestjs-pino`)**: Logs estructurados en formato JSON.
*   **LoggingInterceptor**: Rastreo automático de peticiones HTTP (URL, Método, Status, Duración).
*   **Sentry SDK**: Captura global de excepciones y profiling de rendimiento.

### Frontend (Web):
*   **Sentry SDK**: Captura de errores en navegador.
*   **User Context**: Sincronización automática del perfil de usuario con eventos de error.
*   **Console Tracking**: Captura automática de `console.error` y `console.warn`.

---

## 🪵 Registro de Logs (Backend)

import { Injectable } from '@nestjs/common';
import { Logger } from 'nestjs-pino';

@Injectable()
export class MiServicio {
  constructor(private readonly logger: Logger) {}

  procesarDato(id: number) {
    // Log informativo con metadatos
    this.logger.log({ id, accion: 'procesar' }, "Iniciando procesamiento");
    
    // Log de error (Sentry lo captura automáticamente)
    try {
      // lógica...
    } catch (e) {
      this.logger.error({ err: e, id }, "Error al procesar dato");
    }
  }

---

## Captura de Errores (Global)

### Backend
No es necesario atrapar manualmente cada error para que Sentry se entere. Tenemos tres capas de red:
1.  **SentryGlobalFilter**: Captura cualquier excepción no controlada en los controladores.
2.  **Hook en main.ts**: Captura errores fatales que ocurren fuera de NestJS (`uncaughtException`).
3.  **Interceptor**: Rastrea si una petición falló y cuánto tiempo estuvo activa antes de fallar.

### Frontend
*   **Auto-identificación**: Cada error en Sentry viene marcado con el `userId` y `username` del usuario logueado.
*   **Breadcrumbs**: Sentry registra las acciones previas del usuario (clicks, navegación) para que puedas reproducir el error.

---

## Performance y Profiling

Se habilitó el **Profiling de Sentry (V10.38.0)**. 
*   Permite ver gráficos de llama (flamegraphs) en el panel de Sentry.
*   Permite identificar exactamente qué función o consulta a la base de datos está causando lentitud en una transacción específica.

---

