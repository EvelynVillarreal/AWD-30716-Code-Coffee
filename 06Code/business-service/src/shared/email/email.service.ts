import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const emailService = {
  sendWelcomeEmail: async (destination: string, name: string) => {
    try {
      const info = await transporter.sendMail({
        from: `"Artisan Shop" <${process.env.SMTP_USER}>`,
        to: destination,
        subject: '¡Bienvenido a Artisan Shop!',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>¡Hola ${name}!</h2>
            <p>Bienvenido a Artisan Shop. Tu cuenta ha sido creada exitosamente.</p>
            <p>Empieza a explorar nuestros productos artesanales hoy mismo.</p>
          </div>
        `,
      });
      return info;
    } catch (err) {
      console.error('Exception sending welcome email:', err);
    }
  },

  sendOrderConfirmation: async (destination: string, name: string, referenceNumber: string, total: number) => {
    try {
      const info = await transporter.sendMail({
        from: `"Artisan Shop" <${process.env.SMTP_USER}>`,
        to: destination,
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
      return info;
    } catch (err) {
      console.error('Exception sending order confirmation email:', err);
    }
  },

  sendOrderStatusUpdate: async (destination: string, name: string, referenceNumber: string, newStatus: string) => {
    try {
      const statusMap: Record<string, string> = {
        'processing': 'Procesando',
        'shipped': 'Enviado',
        'delivered': 'Entregado',
        'cancelled': 'Cancelado'
      };
      const translatedStatus = statusMap[newStatus] || newStatus;
      
      const info = await transporter.sendMail({
        from: `"Artisan Shop" <${process.env.SMTP_USER}>`,
        to: destination,
        subject: `Actualización de Pedido ${referenceNumber} - Artisan Shop`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Hola, ${name}</h2>
            <p>Te informamos que el estado de tu pedido con referencia <strong>${referenceNumber}</strong> ha cambiado a: <strong>${translatedStatus}</strong>.</p>
            <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
          </div>
        `,
      });
      return info;
    } catch (err) {
      console.error('Exception sending order status update email:', err);
    }
  }
};

