'use client';

import { useState, useEffect } from 'react';
import { orderApi } from '@/services/api.client';
import { Order } from '@/types';
import OrderStatusBadge from '@/components/order/OrderStatusBadge';
import Link from 'next/link';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    setIsLoading(true);
    try {
      const data = await orderApi.getMyOrders();
      setOrders(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al cargar pedidos';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div style={{ textAlign: 'center', padding: 'var(--space-20)' }}>
          <div className="spinner" style={{ margin: '0 auto', width: 40, height: 40 }} />
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="container" style={{ padding: 'var(--space-12) var(--space-6)' }}>
        <h1 className="section-title" style={{ marginBottom: 'var(--space-2)' }}>Mis Pedidos</h1>
        <p className="section-subtitle">Rastrea tus pedidos y mira tu historial</p>

        {error && <div className="alert alert-error">{error}</div>}

        {orders.length === 0 && !error && (
          <div style={{ textAlign: 'center', padding: 'var(--space-16)' }} className="glass-card">
            <span style={{ fontSize: '3rem', display: 'block', marginBottom: 'var(--space-4)' }}>📦</span>
            <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 'var(--space-2)' }}>
              Aún no hay pedidos
            </h3>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-6)' }}>
              Comienza a explorar nuestra colección y haz tu primer pedido.
            </p>
            <Link href="/products" className="btn btn-primary">Explorar Productos</Link>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {orders.map((order) => (
            <div key={order.id} className="card" id={`order-${order.id}`}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
                <div>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-1)' }}>
                    Referencia
                  </p>
                  <p style={{ fontWeight: 600, fontFamily: 'var(--font-display)' }}>
                    {order.referenceNumber}
                  </p>
                </div>
                <OrderStatusBadge status={order.status} />
              </div>

              <hr className="divider" style={{ margin: 'var(--space-4) 0' }} />

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 'var(--space-4)' }}>
                <div>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-1)' }}>Fecha</p>
                  <p style={{ fontSize: 'var(--text-sm)' }}>{formatDate(order.createdAt)}</p>
                </div>
                <div>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-1)' }}>Artículos</p>
                  <p style={{ fontSize: 'var(--text-sm)' }}>{order.details?.length ?? 0} artículo(s)</p>
                </div>
                <div>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-1)' }}>Total</p>
                  <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-honey)' }}>
                    {formatPrice(order.total)}
                  </p>
                </div>
                {order.isCustomized && (
                  <div>
                    <span className="badge badge-active">Pedido Personalizado</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </ProtectedRoute>
  );
}
