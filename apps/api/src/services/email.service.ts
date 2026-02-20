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

  async sendWelcomeEmail(to: string, username: string) {
    try {
      await this.resend.emails.send({
        from: 'Wheels House <noreply@wheelshouse.app>',
        to: to,
        subject: `¡Bienvenido a Wheels House, ${username}!`,
        html: `
            <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
                <p>Hola, <strong>${username}</strong>.</p>
                <p>¡Ya sos parte de Wheels House, el hogar digital de los coleccionistas de vehículos a escala!</p>
                <p>Esto es lo que podés hacer desde hoy:</p>
                <ul>
                    <li>Agregá tus autos con fotos, marca, modelo, escala y todos los detalles que quieras documentar</li>
                    <li>Organizá tu colección en grupos por serie, color, o cualquier criterio que imagines</li>
                    <li>Descubrí las colecciones de otros coleccionistas y dejá tu like en los autos que te gusten</li>
                    <li>Jugá WheelWord, el juego diario de Wheels House</li>
                </ul>
                <p>Si tenés alguna duda, sugerencia o simplemente querés saludar, escribinos desde <a href="https://wheelshouse.app/contact" style="color: #D9731A;">wheelshouse.app/contact</a>. Nos encanta leer los mensajes.</p>
                <p>¡Que disfrutes coleccionar!</p>
                <p>El equipo de Wheels House.</p>
            </div>
        `,
      });
    } catch (error) {
      console.error(`Error while sending welcome email: ${error.message}`);
    }
  }
}