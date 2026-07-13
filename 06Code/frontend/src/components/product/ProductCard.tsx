import Link from 'next/link';
import { Product } from '@/types';

type ProductCardProps = {
  product: Product;
};

function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
}

export default function ProductCard({ product }: ProductCardProps) {
  const primaryPhoto = product.photos?.[0];

  return (
    <article className="card" style={{ padding: 0, overflow: 'hidden' }}>
      {/* Product Image */}
      <div style={{
        aspectRatio: '4/3',
        background: 'var(--color-bg-elevated)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottom: '1px solid var(--color-border)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {primaryPhoto ? (
          <img
            src={primaryPhoto.url}
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <span style={{ fontSize: '4rem', opacity: 0.3 }}>🏺</span>
        )}

        {/* Stock badge */}
        {product.stock <= 3 && product.stock > 0 && (
          <span style={{
            position: 'absolute',
            top: 'var(--space-3)',
            right: 'var(--space-3)',
            background: 'rgba(240, 165, 0, 0.9)',
            color: '#1a0f07',
            fontSize: 'var(--text-xs)',
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: 'var(--radius-full)',
          }}>
            Solo quedan {product.stock}
          </span>
        )}

        {product.stock === 0 && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(15, 9, 6, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <span style={{ color: 'var(--color-text-muted)', fontWeight: 600, fontSize: 'var(--text-sm)' }}>
              Agotado
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div style={{ padding: 'var(--space-5)' }}>
        {product.category && (
          <span style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--color-text-accent)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            fontWeight: 600,
          }}>
            {product.category.name}
          </span>
        )}

        <h3 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--text-lg)',
          margin: 'var(--space-1) 0 var(--space-2)',
          color: 'var(--color-text-primary)',
        }}>
          {product.name}
        </h3>

        {product.description && (
          <p style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--color-text-muted)',
            marginBottom: 'var(--space-4)',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical' as const,
            overflow: 'hidden',
          }}>
            {product.description}
          </p>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{
            fontSize: 'var(--text-xl)',
            fontWeight: 700,
            color: 'var(--color-honey)',
            fontFamily: 'var(--font-display)',
          }}>
            {formatPrice(product.price)}
          </span>

          {product.allowsCustomization && (
            <span className="badge badge-active" style={{ fontSize: '10px' }}>
              Personalizable
            </span>
          )}
        </div>

        <Link
          href={`/products/${product.id}`}
          id={`product-card-${product.id}`}
          className="btn btn-primary"
          style={{ width: '100%', marginTop: 'var(--space-4)', justifyContent: 'center' }}
        >
          Ver Detalles
        </Link>
      </div>
    </article>
  );
}
