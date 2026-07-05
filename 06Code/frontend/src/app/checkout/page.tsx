'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { orderApi, shippingApi } from '@/services/api.client';
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
  const [shippingCost, setShippingCost] = useState(0);
  const [calculatingShipping, setCalculatingShipping] = useState(false);

  const [formData, setFormData] = useState({
    contactName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    province: user?.province || '',
  });

  const cartSubtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartTotal = cartSubtotal + shippingCost;

  useEffect(() => {
    if (!formData.province) {
      setShippingCost(0);
      return;
    }
    const timeout = setTimeout(async () => {
      setCalculatingShipping(true);
      try {
        const cost = await shippingApi.calculateCost(formData.province);
        setShippingCost(cost);
      } catch {
        setShippingCost(0);
      } finally {
        setCalculatingShipping(false);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [formData.province]);

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
      setError(err instanceof Error ? err.message : 'Error al realizar el pedido');
    } finally {
      setIsLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="container" style={{ padding: 'var(--space-20) var(--space-6)', textAlign: 'center' }}>
        <span style={{ fontSize: '4rem', display: 'block', marginBottom: 'var(--space-4)' }}>🛒</span>
        <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: 'var(--space-4)' }}>Tu carrito está vacío</h2>
        <button onClick={() => router.push('/products')} className="btn btn-primary">
          Explorar Productos
        </button>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="container" style={{ padding: 'var(--space-12) var(--space-6)' }}>
        <h1 className="section-title">Finalizar Compra</h1>
        <p className="section-subtitle">Completa tu pedido de forma segura</p>

        {error && <div className="alert alert-error">{error}</div>}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 'var(--space-8)', alignItems: 'start' }} className="checkout-grid">
          {/* Form Section */}
          <div className="card">
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', marginBottom: 'var(--space-6)' }}>
              Información de Envío y Contacto
            </h2>
            <form id="checkout-form" onSubmit={handleCheckout}>
              <div className="form-group">
                <label htmlFor="contactName" className="form-label">Nombre Completo</label>
                <input id="contactName" type="text" className="form-input" required
                  value={formData.contactName} onChange={(e) => updateField('contactName', e.target.value)} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                <div className="form-group">
                  <label htmlFor="email" className="form-label">Correo Electrónico</label>
                  <input id="email" type="email" className="form-input" required
                    value={formData.email} onChange={(e) => updateField('email', e.target.value)} />
                </div>
                <div className="form-group">
                  <label htmlFor="phone" className="form-label">Número de Teléfono</label>
                  <input id="phone" type="tel" className="form-input" required
                    value={formData.phone} onChange={(e) => updateField('phone', e.target.value)} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-4)' }}>
                <div className="form-group">
                  <label htmlFor="address" className="form-label">Dirección de Envío</label>
                  <input id="address" type="text" className="form-input" required
                    value={formData.address} onChange={(e) => updateField('address', e.target.value)} />
                </div>
                <div className="form-group">
                  <label htmlFor="province" className="form-label">Provincia (Destino)</label>
                  <input id="province" type="text" className="form-input" required
                    value={formData.province} onChange={(e) => updateField('province', e.target.value)} />
                </div>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="glass-card" style={{ position: 'sticky', top: '80px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', marginBottom: 'var(--space-4)' }}>
              Resumen del Pedido
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
              {items.map((item) => (
                <div key={item.product.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)' }}>
                  <div style={{ flex: 1, paddingRight: 'var(--space-2)' }}>
                    <span style={{ fontWeight: 600 }}>{item.quantity}x</span> {item.product.name}
                    {item.customizationDetails && (
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                        Personalizado: {item.customizationDetails}
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

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
              <span style={{ fontSize: 'var(--text-sm)' }}>Subtotal</span>
              <span style={{ fontWeight: 600 }}>{formatPrice(cartSubtotal)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-6)' }}>
              <span style={{ fontSize: 'var(--text-sm)' }}>Envío</span>
              <span style={{ fontWeight: 600 }}>
                {calculatingShipping ? 'Calculando...' : (shippingCost === 0 ? 'Gratis o No Disponible' : formatPrice(shippingCost))}
              </span>
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
              disabled={isLoading || calculatingShipping}
            >
              {isLoading ? <><span className="spinner" />Procesando...</> : `Realizar Pedido (${totalItems} artículos)`}
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
