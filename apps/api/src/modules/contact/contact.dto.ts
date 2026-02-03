import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength, MaxLength } from 'class-validator';

export enum ContactReason {
    BUG = 'BUG',
    SUGGESTION = 'SUGGESTION',
    GENERAL = 'GENERAL',
}

export class CreateContactMessageDto {
    @IsString()
    @IsNotEmpty({ message: 'El nombre es obligatorio' })
    name: string;

    @IsEmail({}, { message: 'Email inválido' })
    email: string;

    @IsEnum(ContactReason, { message: 'Motivo inválido' })
    reason: ContactReason;

    @IsString()
    @MinLength(10, { message: 'El mensaje debe tener al menos 10 caracteres' })
    @MaxLength(2000, { message: 'El mensaje es demasiado largo' })
    message: string;

    @IsString()
    @IsOptional()
    honeypot?: string;
}

export class UpdateContactStatusDto {
    @IsString()
    @IsNotEmpty()
    status: string;

    @IsString()
    @IsOptional()
    adminNotes?: string;
}
