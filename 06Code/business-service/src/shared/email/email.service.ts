import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);
const DESTINATION_EMAIL = 'ehvillarreal@espe.edu.ec';
const SENDER_EMAIL = 'onboarding@resend.dev';

export const emailService = {
  sendWelcomeEmail: async (destination: string, name: string) => {
    try {
      const { data, error } = await resend.emails.send({
        from: `Artisan Shop <${SENDER_EMAIL}>`,
        to: [DESTINATION_EMAIL],
        subject: '¡Bienvenido a Artisan Shop!',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>¡Hola ${name}!</h2>
            <p>Bienvenido a Artisan Shop. Tu cuenta ha sido creada exitosamente.</p>
            <p>Empieza a explorar nuestros productos artesanales hoy mismo.</p>
          </div>
        `,
      });

      if (error) console.error('Error sending welcome email:', error);
      return data;
    } catch (err) {
      console.error('Exception sending welcome email:', err);
    }
  },

  sendOrderConfirmation: async (destination: string, name: string, referenceNumber: string, total: number) => {
    try {
      const { data, error } = await resend.emails.send({
        from: `Artisan Shop <${SENDER_EMAIL}>`,
        to: [DESTINATION_EMAIL],
        subject: `Confirmación de Pedido ${referenceNumber} - Artisan Shop`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>¡Gracias por tu compra, ${name}!</h2>
            <p>Tu pedido con referencia <strong>${referenceNumber}</strong> ha sido recibido y está siendo procesado.</p>
            <p>El total de tu compra es: <strong>$${total.toFixed(2)}</strong></p>
            <p>Te notificaremos cuando el estado de tu pedido cambie a enviado.</p>
          </div>
        `,
      });

      if (error) console.error('Error sending order confirmation:', error);
      return data;
    } catch (err) {
      console.error('Exception sending order confirmation email:', err);
    }
  }
};
