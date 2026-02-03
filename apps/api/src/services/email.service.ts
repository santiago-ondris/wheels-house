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

  async sendWelcomeEmail(to: string, username: string, founderNumber: number) {
    try {
      await this.resend.emails.send({
        from: 'Wheels House <noreply@wheelshouse.app>',
        to: to,
        subject: `🎉 ¡Bienvenido, Miembro Fundador #${founderNumber}!`,
        html: `
            <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
                <p>Hola, <strong>${username}</strong>.</p>
                <p>Acabas de convertirte en el <strong>Miembro Fundador #${founderNumber}</strong> de Wheels House.</p>
                <p>¿Qué significa esto?</p>
                <ul>
                    <li>✅ <strong>Acceso GRATUITO para siempre</strong> (sí, para siempre)</li>
                    <li>✅ <strong>Influencia directa en el desarrollo</strong> (tu feedback importa)</li>
                    <li>✅ <strong>Badge exclusivo</strong> de "Founding Member"</li>
                </ul>
                <p>Una vez lleguemos a 100 miembros fundadores, Wheels House será de pago para nuevos usuarios (~$3 USD/mes - ARS 2000). Pero vos ya estás dentro.</p>
                <p><strong>Recordá cargar tu primer auto para oficializar tu lugar y confirmar así el acceso!</strong></p>
                <p>¿Cómo podés ayudar?</p>
                <ul>
                    <li>Compartí con amigos coleccionistas</li>
                    <li>Reportá bugs o sugerí features, ¡nos encantamos!</li>
                    <li>Úsalo y disfrútalo 🚗</li>
                </ul>
                <p>¡Gracias por confiar en nosotros desde el inicio!</p>
                <p>El equipo de Wheels House.</p>
            </div>
        `,
      });
    } catch (error) {
      console.error(`Error while sending welcome email: ${error.message}`);
    }
  }
}