'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { productApi } from '@/services/api.client';
import { Product } from '@/types';
import { useCart } from '@/contexts/CartContext';

function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [customization, setCustomization] = useState('');

  useEffect(() => {
    if (params.id) {
      loadProduct(Number(params.id));
    }
  }, [params.id]);

  async function loadProduct(id: number) {
    setIsLoading(true);
    setError(null);
    try {
      // Re-using getAll and finding by id since getById might not exist yet in api.client
      const allProducts = await productApi.getAll();
      const found = allProducts.find((p: Product) => p.id === id);
      if (!found) throw new Error('Product not found');
      setProduct(found);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load product details');
    } finally {
      setIsLoading(false);
    }
  }

  function handleAddToCart() {
    if (!product) return;
    addItem(product, quantity, product.allowsCustomization ? customization : undefined);
    alert('Added to cart!');
  }

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: 'var(--space-20)' }}>
        <div className="spinner" style={{ margin: '0 auto', width: 40, height: 40 }} />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container" style={{ padding: 'var(--space-12) var(--space-6)', textAlign: 'center' }}>
        <div className="alert alert-error" style={{ justifyContent: 'center' }}>
          {error || 'Product not found'}
        </div>
        <button onClick={() => router.push('/products')} className="btn btn-secondary" style={{ marginTop: 'var(--space-4)' }}>
          Back to Products
        </button>
      </div>
    );
  }

  const primaryPhoto = product.photos?.[0];

  return (
    <div className="container" style={{ padding: 'var(--space-12) var(--space-6)' }}>
      <button onClick={() => router.push('/products')} className="btn btn-ghost btn-sm" style={{ marginBottom: 'var(--space-6)' }}>
        ← Back to Products
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-12)' }}>
        {/* Product Image */}
        <div className="glass-card" style={{ padding: 0, overflow: 'hidden', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {primaryPhoto ? (
            <img src={primaryPhoto.url} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span style={{ fontSize: '8rem', opacity: 0.3 }}>🏺</span>
          )}
        </div>

        {/* Product Details */}
        <div>
          {product.category && (
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-accent)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
              {product.category.name}
            </span>
          )}
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-4xl)', margin: 'var(--space-2) 0', color: 'var(--color-text-primary)' }}>
            {product.name}
          </h1>
          <p style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, color: 'var(--color-honey)', fontFamily: 'var(--font-display)', marginBottom: 'var(--space-6)' }}>
            {formatPrice(product.price)}
          </p>

          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-base)', lineHeight: 1.8, marginBottom: 'var(--space-8)' }}>
            {product.description || 'No description available for this handcrafted item.'}
          </p>

          <hr className="divider" style={{ margin: 'var(--space-6) 0' }} />

          {product.stock > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <p style={{ color: product.stock <= 3 ? 'var(--color-warning)' : 'var(--color-success)', fontWeight: 600 }}>
                {product.stock <= 3 ? `Only ${product.stock} items left in stock!` : 'In Stock'}
              </p>

              <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="btn btn-ghost" style={{ padding: 'var(--space-2) var(--space-3)' }}>-</button>
                  <span style={{ padding: '0 var(--space-4)', fontWeight: 600 }}>{quantity}</span>
                  <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="btn btn-ghost" style={{ padding: 'var(--space-2) var(--space-3)' }}>+</button>
                </div>
              </div>

              {product.allowsCustomization && (
                <div className="form-group" style={{ marginTop: 'var(--space-4)' }}>
                  <label htmlFor="customization" className="form-label">Customization Details</label>
                  <textarea
                    id="customization"
                    className="form-textarea"
                    placeholder="Enter engraving text, color preferences, or special requests..."
                    value={customization}
                    onChange={(e) => setCustomization(e.target.value)}
                    style={{ minHeight: '80px' }}
                  />
                </div>
              )}

              <button onClick={handleAddToCart} className="btn btn-primary btn-lg" style={{ marginTop: 'var(--space-4)', width: '100%', justifyContent: 'center' }}>
                Add to Cart
              </button>
            </div>
          ) : (
            <div className="alert alert-error" style={{ justifyContent: 'center' }}>
              Currently Out of Stock
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
