'use client';

import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

export default function CartPage() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const { items, totalItems, updateQuantity, removeItem } = useCart();

  const cartTotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="container" style={{ padding: 'var(--space-20) var(--space-6)', textAlign: 'center' }}>
        <span style={{ fontSize: '4rem', display: 'block', marginBottom: 'var(--space-4)' }}>🛒</span>
        <h1 style={{ fontFamily: 'var(--font-display)', marginBottom: 'var(--space-4)' }}>Your Cart is Empty</h1>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-8)' }}>
          Looks like you haven&apos;t added any items to your cart yet.
        </p>
        <Link href="/products" className="btn btn-primary btn-lg">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: 'var(--space-12) var(--space-6)' }}>
      <h1 className="section-title">Shopping Cart</h1>
      <p className="section-subtitle">You have {totalItems} items in your cart</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 'var(--space-8)', alignItems: 'start' }} className="cart-grid">
        {/* Cart Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {items.map((item) => (
            <div key={item.product.id} className="card" style={{ display: 'flex', gap: 'var(--space-4)', padding: 'var(--space-4)' }}>
              <div style={{ width: '100px', height: '100px', background: 'var(--color-bg-elevated)', borderRadius: 'var(--radius-md)', overflow: 'hidden', flexShrink: 0 }}>
                {item.product.photos?.[0] ? (
                  <img src={item.product.photos[0].url} alt={item.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', opacity: 0.3 }}>🏺</div>
                )}
              </div>
              
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', margin: 0 }}>{item.product.name}</h3>
                    {item.customizationDetails && (
                      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 'var(--space-1)' }}>
                        <strong style={{ color: 'var(--color-text-secondary)' }}>Custom:</strong> {item.customizationDetails}
                      </p>
                    )}
                  </div>
                  <button onClick={() => removeItem(item.product.id)} className="btn btn-ghost btn-sm" style={{ padding: 'var(--space-1) var(--space-2)' }} aria-label="Remove item">
                    🗑️
                  </button>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--space-2)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }}>
                    <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="btn btn-ghost btn-sm" style={{ padding: 'var(--space-1) var(--space-2)' }}>-</button>
                    <span style={{ padding: '0 var(--space-3)', fontSize: 'var(--text-sm)' }}>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product.id, Math.min(item.product.stock, item.quantity + 1))} className="btn btn-ghost btn-sm" style={{ padding: 'var(--space-1) var(--space-2)' }}>+</button>
                  </div>
                  <span style={{ fontWeight: 600, color: 'var(--color-honey)' }}>
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="glass-card" style={{ position: 'sticky', top: '80px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', marginBottom: 'var(--space-6)' }}>
            Summary
          </h2>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-4)', color: 'var(--color-text-secondary)' }}>
            <span>Subtotal</span>
            <span>{formatPrice(cartTotal)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-6)', color: 'var(--color-text-secondary)' }}>
            <span>Shipping</span>
            <span>Calculated at checkout</span>
          </div>

          <hr className="divider" style={{ margin: 'var(--space-4) 0' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-6)' }}>
            <span style={{ fontSize: 'var(--text-lg)', fontWeight: 600 }}>Total Estimate</span>
            <span style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--color-honey)', fontFamily: 'var(--font-display)' }}>
              {formatPrice(cartTotal)}
            </span>
          </div>

          <button 
            onClick={() => {
              if (!isLoggedIn) {
                alert("Debes estar registrado e iniciar sesión para poder realizar una compra.");
                router.push('/login');
                return;
              }
              router.push('/checkout');
            }} 
            className="btn btn-primary btn-lg" 
            style={{ width: '100%', justifyContent: 'center' }}
          >
            Proceder al Checkout
          </button>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 768px) {
          .cart-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}} />
    </div>
  );
}
