import { Body, Controller, Post, Request, UseGuards, Optional } from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactMessageDto } from './contact.dto';
import { OptionalJwtAuthGuard } from '../../validators/auth.validator';

@Controller('contact')
export class ContactController {
    constructor(private readonly contactService: ContactService) { }

    @Post()
    @UseGuards(OptionalJwtAuthGuard)
    async createMessage(@Body() dto: CreateContactMessageDto, @Request() req) {
        return this.contactService.createMessage(dto, req.user);
    }
}
