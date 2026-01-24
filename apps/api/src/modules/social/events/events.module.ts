import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsSubscriber } from './events.subscriber';
import { FeedModule } from '../feed/feed.module';

/**
 * EventsModule - Módulo de eventos del sistema social
 * 
 * Provee:
 * - EventsService: Para emitir eventos desde otros módulos
 * - EventsSubscriber: Escucha eventos y crea feed entries
 */
@Module({
    imports: [FeedModule],
    providers: [EventsService, EventsSubscriber],
    exports: [EventsService], // Exportamos EventsService para usar en otros módulos (Cars, Groups, etc)
})
export class EventsModule { }
