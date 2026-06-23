import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="page-wrapper" style={{ minHeight: 'calc(100vh - 64px)' }}>
      <section className="hero" style={{ padding: 'var(--space-20) var(--space-6)', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div className="container">
          <span style={{ fontSize: '4rem', display: 'block', marginBottom: 'var(--space-4)' }}>🏺</span>
          <h1 className="hero-title animate-fade-in" style={{ fontSize: 'clamp(3rem, 8vw, 5.5rem)', maxWidth: '900px', margin: '0 auto var(--space-4)' }}>
            Handcrafted With Passion
          </h1>
          <p className="hero-subtitle animate-fade-in" style={{ animationDelay: '0.1s', fontSize: 'var(--text-xl)', maxWidth: '700px', margin: '0 auto var(--space-8)' }}>
            Discover unique pieces created by local artisans. Every item tells a story of skill, dedication, and cultural heritage.
          </p>
          
          <div className="animate-fade-in" style={{ animationDelay: '0.2s', display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/products" className="btn btn-primary btn-lg">
              Explore Collection
            </Link>
            <Link href="/register" className="btn btn-secondary btn-lg">
              Join Our Community
            </Link>
          </div>
        </div>
      </section>

      <section style={{ padding: 'var(--space-16) var(--space-6)', background: 'var(--color-bg-secondary)' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-8)' }}>
          <div className="card" style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: 'var(--space-3)' }}>🎨</span>
            <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 'var(--space-2)' }}>Unique Designs</h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>Each piece is distinct and carries the unique touch of its creator.</p>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: 'var(--space-3)' }}>🌿</span>
            <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 'var(--space-2)' }}>Sustainable</h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>We use ethically sourced materials that respect the environment.</p>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: 'var(--space-3)' }}>🤝</span>
            <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 'var(--space-2)' }}>Fair Trade</h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>Direct support to artisans, ensuring fair compensation for their art.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
