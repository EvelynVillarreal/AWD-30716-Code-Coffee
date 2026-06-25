import type { Metadata } from 'next';
import '../styles/globals.css';
import Providers from './providers';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Artisan Shop — Hecho a Mano con Pasión',
  description: 'Descubre productos artesanales únicos. Explora nuestra colección, realiza pedidos personalizados y apoya a los artesanos locales.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>
        <Providers>
          <div className="page-wrapper">
            <Header />
            <main>{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
