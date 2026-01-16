import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private resend: Resend;

  constructor(configService: ConfigService) {
    // Initialize Resend with your API key
    this.resend = new Resend(configService.get<string>('RESEND_API_KEY'));
  }

  async sendForgotPasswordEmail(to: string, username: string, url: string) {
    try {
        const data = await this.resend.emails.send({
            from: 'No Reply <noreply@wheelshouse.app>',
            to: to,
            subject: 'Wheels House - Recuperación de contraseña',
            html: `
                <p>Hola, ${username}.</p>
                <p>Ingresá al link a continuación para cambiar tu contraseña: <a href=${url}>${url}</a>.</p>
                <p>Si no solicitaste este cambio, ignorá este correo.</p>
                <p>El equipo de Wheels House.</p>
            `,
        });

      return data;
    } catch (error) {
      throw new Error(`Error while sending email: ${error.message}`);
    }
  }
}