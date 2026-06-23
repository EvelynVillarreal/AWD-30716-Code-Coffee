'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { orderApi } from '@/services/api.client';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalItems, clearCart } = useCart();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    contactName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    province: user?.province || '',
  });

  const cartTotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  function updateField(field: string, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) return;

    setIsLoading(true);
    setError(null);

    try {
      const orderData = {
        ...formData,
        items: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          unitPrice: item.product.price,
          customizationDetails: item.customizationDetails,
        })),
      };

      await orderApi.placeOrder(orderData);
      clearCart();
      router.push('/orders');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to place order');
    } finally {
      setIsLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="container" style={{ padding: 'var(--space-20) var(--space-6)', textAlign: 'center' }}>
        <span style={{ fontSize: '4rem', display: 'block', marginBottom: 'var(--space-4)' }}>🛒</span>
        <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: 'var(--space-4)' }}>Your cart is empty</h2>
        <button onClick={() => router.push('/products')} className="btn btn-primary">
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="container" style={{ padding: 'var(--space-12) var(--space-6)' }}>
        <h1 className="section-title">Checkout</h1>
        <p className="section-subtitle">Complete your order securely</p>

        {error && <div className="alert alert-error">{error}</div>}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 'var(--space-8)', alignItems: 'start' }} className="checkout-grid">
          {/* Form Section */}
          <div className="card">
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', marginBottom: 'var(--space-6)' }}>
              Shipping & Contact Info
            </h2>
            <form id="checkout-form" onSubmit={handleCheckout}>
              <div className="form-group">
                <label htmlFor="contactName" className="form-label">Full Name</label>
                <input id="contactName" type="text" className="form-input" required
                  value={formData.contactName} onChange={(e) => updateField('contactName', e.target.value)} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                <div className="form-group">
                  <label htmlFor="email" className="form-label">Email Address</label>
                  <input id="email" type="email" className="form-input" required
                    value={formData.email} onChange={(e) => updateField('email', e.target.value)} />
                </div>
                <div className="form-group">
                  <label htmlFor="phone" className="form-label">Phone Number (Optional)</label>
                  <input id="phone" type="tel" className="form-input"
                    value={formData.phone} onChange={(e) => updateField('phone', e.target.value)} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-4)' }}>
                <div className="form-group">
                  <label htmlFor="address" className="form-label">Shipping Address</label>
                  <input id="address" type="text" className="form-input" required
                    value={formData.address} onChange={(e) => updateField('address', e.target.value)} />
                </div>
                <div className="form-group">
                  <label htmlFor="province" className="form-label">Province</label>
                  <input id="province" type="text" className="form-input" required
                    value={formData.province} onChange={(e) => updateField('province', e.target.value)} />
                </div>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="glass-card" style={{ position: 'sticky', top: '80px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', marginBottom: 'var(--space-4)' }}>
              Order Summary
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
              {items.map((item) => (
                <div key={item.product.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)' }}>
                  <div style={{ flex: 1, paddingRight: 'var(--space-2)' }}>
                    <span style={{ fontWeight: 600 }}>{item.quantity}x</span> {item.product.name}
                    {item.customizationDetails && (
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                        Custom: {item.customizationDetails}
                      </div>
                    )}
                  </div>
                  <div style={{ fontWeight: 600 }}>
                    {formatPrice(item.product.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            <hr className="divider" style={{ margin: 'var(--space-4) 0' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-6)' }}>
              <span style={{ fontSize: 'var(--text-lg)', fontWeight: 600 }}>Total</span>
              <span style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--color-honey)', fontFamily: 'var(--font-display)' }}>
                {formatPrice(cartTotal)}
              </span>
            </div>

            <button
              form="checkout-form"
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: '100%', justifyContent: 'center' }}
              disabled={isLoading}
            >
              {isLoading ? <><span className="spinner" />Processing...</> : `Place Order (${totalItems} items)`}
            </button>
          </div>
        </div>

        <style dangerouslySetInnerHTML={{ __html: `
          @media (max-width: 768px) {
            .checkout-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}} />
      </div>
    </ProtectedRoute>
  );
}
