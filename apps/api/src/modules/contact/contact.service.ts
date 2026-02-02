import { Injectable, BadRequestException } from '@nestjs/common';
import { db } from '../../database';
import { contactMessage } from '../../database/schema/contact_messages.schema';
import { CreateContactMessageDto } from './contact.dto';
import { TokenData } from '../../dto/user.dto';

@Injectable()
export class ContactService {
    async createMessage(dto: CreateContactMessageDto, user?: TokenData) {
        // Honeypot check
        if (dto.honeypot) {
            // Silently ignore or log for monitoring
            console.log('Honeypot triggered by:', dto.email);
            return { success: true, message: 'Message processed' };
        }

        const data = {
            name: dto.name,
            email: dto.email,
            reason: dto.reason,
            message: dto.message,
            userId: user?.userId || null,
            status: 'PENDING',
            createdAt: new Date(),
        };

        await db.insert(contactMessage).values(data);

        return { success: true };
    }
}
