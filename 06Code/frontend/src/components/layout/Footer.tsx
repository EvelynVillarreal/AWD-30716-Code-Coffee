import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{
      borderTop: '1px solid var(--color-border)',
      background: 'var(--color-bg-secondary)',
      padding: 'var(--space-12) 0 var(--space-8)',
      marginTop: 'auto',
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'var(--space-8)',
          marginBottom: 'var(--space-10)',
        }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
              <span style={{ fontSize: '1.5rem' }}>☕</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 700 }}>
                Artisan Shop
              </span>
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', lineHeight: 1.7 }}>
              Hecho a mano con pasión. Cada pieza cuenta una historia de habilidad y dedicación.
            </p>
          </div>

          {/* Shop Links */}
          <div>
            <h6 style={{ color: 'var(--color-text-accent)', marginBottom: 'var(--space-4)', fontSize: 'var(--text-sm)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Tienda
            </h6>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {[
                { label: 'Todos los Productos', href: '/products' },
                { label: 'Galería', href: '/gallery' },
                { label: 'Pedidos Personalizados', href: '/products?custom=true' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account Links */}
          <div>
            <h6 style={{ color: 'var(--color-text-accent)', marginBottom: 'var(--space-4)', fontSize: 'var(--text-sm)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Cuenta
            </h6>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {[
                { label: 'Iniciar Sesión', href: '/login' },
                { label: 'Registrarse', href: '/register' },
                { label: 'Mis Pedidos', href: '/orders' },
                { label: 'Perfil', href: '/profile' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid var(--color-border)',
          paddingTop: 'var(--space-6)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 'var(--space-4)',
        }}>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
            © {currentYear} Artisan Shop. Hecho a mano con ❤️
          </p>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
            AWD-30716 · Code &amp; Coffee
          </p>
        </div>
      </div>
    </footer>
  );
}
