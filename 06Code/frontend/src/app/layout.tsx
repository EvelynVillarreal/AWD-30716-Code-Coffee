import type { Metadata } from 'next';
import '../styles/globals.css';
import Providers from './providers';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Artisan Shop — Handcrafted with Passion',
  description: 'Discover unique handcrafted artisan products. Browse our collection, place custom orders, and support local artisans.',
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
