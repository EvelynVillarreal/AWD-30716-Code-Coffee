'use client';

import { useState, useEffect } from 'react';
import { orderApi } from '@/services/api.client';
import { Order } from '@/types';
import OrderStatusBadge from '@/components/order/OrderStatusBadge';
import Link from 'next/link';

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
      const message = err instanceof Error ? err.message : 'Failed to load orders';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: 'var(--space-20)' }}>
        <div className="spinner" style={{ margin: '0 auto', width: 40, height: 40 }} />
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: 'var(--space-12) var(--space-6)' }}>
      <h1 className="section-title" style={{ marginBottom: 'var(--space-2)' }}>My Orders</h1>
      <p className="section-subtitle">Track your orders and view history</p>

      {error && <div className="alert alert-error">{error}</div>}

      {orders.length === 0 && !error && (
        <div style={{ textAlign: 'center', padding: 'var(--space-16)' }} className="glass-card">
          <span style={{ fontSize: '3rem', display: 'block', marginBottom: 'var(--space-4)' }}>📦</span>
          <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 'var(--space-2)' }}>
            No orders yet
          </h3>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-6)' }}>
            Start exploring our collection and place your first order.
          </p>
          <Link href="/products" className="btn btn-primary">Browse Products</Link>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {orders.map((order) => (
          <div key={order.id} className="card" id={`order-${order.id}`}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
              <div>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-1)' }}>
                  Reference
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
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-1)' }}>Date</p>
                <p style={{ fontSize: 'var(--text-sm)' }}>{formatDate(order.createdAt)}</p>
              </div>
              <div>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-1)' }}>Items</p>
                <p style={{ fontSize: 'var(--text-sm)' }}>{order.details?.length ?? 0} item(s)</p>
              </div>
              <div>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-1)' }}>Total</p>
                <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-honey)' }}>
                  {formatPrice(order.total)}
                </p>
              </div>
              {order.isCustomized && (
                <div>
                  <span className="badge badge-active">Custom Order</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
