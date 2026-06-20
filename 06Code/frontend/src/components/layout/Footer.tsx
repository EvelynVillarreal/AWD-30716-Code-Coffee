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
              Handcrafted with passion. Every piece tells a story of skill and dedication.
            </p>
          </div>

          {/* Shop Links */}
          <div>
            <h6 style={{ color: 'var(--color-text-accent)', marginBottom: 'var(--space-4)', fontSize: 'var(--text-sm)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Shop
            </h6>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {[
                { label: 'All Products', href: '/products' },
                { label: 'Gallery', href: '/gallery' },
                { label: 'Custom Orders', href: '/products?custom=true' },
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
              Account
            </h6>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {[
                { label: 'Sign In', href: '/login' },
                { label: 'Register', href: '/register' },
                { label: 'My Orders', href: '/orders' },
                { label: 'Profile', href: '/profile' },
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
            © {currentYear} Artisan Shop. Handcrafted with ❤️
          </p>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
            AWD-30716 · Code &amp; Coffee
          </p>
        </div>
      </div>
    </footer>
  );
}
