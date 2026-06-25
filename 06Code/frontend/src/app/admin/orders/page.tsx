'use client';

import { useState, useEffect } from 'react';
import { orderApi } from '@/services/api.client';
import { Order, OrderStatus } from '@/types';
import OrderStatusBadge from '@/components/order/OrderStatusBadge';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    setIsLoading(true);
    setError(null);
    try {
      const data = await orderApi.getAllOrders();
      setOrders(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al cargar pedidos');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleStatusChange(orderId: number, newStatus: OrderStatus) {
    try {
      await orderApi.changeStatus(orderId, newStatus);
      // Optimistic update
      setOrders((prev) => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error al actualizar el estado');
      // Reload on failure
      loadOrders();
    }
  }

  const filteredOrders = statusFilter === 'all' 
    ? orders 
    : orders.filter(o => o.status === statusFilter);

  return (
    <ProtectedRoute adminOnly>
      <div className="container" style={{ padding: 'var(--space-12) var(--space-6)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-8)', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <h1 className="section-title">Administración de Pedidos</h1>
            <p className="section-subtitle" style={{ margin: 0 }}>Revisa y procesa pedidos de clientes</p>
          </div>
          
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <select 
              className="form-select" 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ padding: 'var(--space-2) var(--space-4)', width: 'auto' }}
            >
              <option value="all">Todos los Estados</option>
              <option value="pending">Pendiente</option>
              <option value="processing">Procesando</option>
              <option value="shipped">Enviado</option>
              <option value="delivered">Entregado</option>
              <option value="cancelled">Cancelado</option>
            </select>
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-20)' }}>
            <div className="spinner" style={{ margin: '0 auto', width: 40, height: 40 }} />
          </div>
        ) : (
          <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Ref de Pedido</th>
                  <th>Fecha</th>
                  <th>Cliente</th>
                  <th>Contacto</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
                      No se encontraron pedidos con esos criterios.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id}>
                      <td style={{ fontWeight: 600 }}>{order.referenceNumber}
                        {order.isCustomized && <span className="badge badge-active" style={{ fontSize: '10px', marginLeft: 'var(--space-2)' }}>Personalizado</span>}
                      </td>
                      <td>{formatDate(order.createdAt)}</td>
                      <td>{order.contactName}</td>
                      <td>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                          {order.email}<br/>
                          {order.phone}
                        </div>
                      </td>
                      <td style={{ fontWeight: 600, color: 'var(--color-honey)' }}>{formatPrice(order.total)}</td>
                      <td><OrderStatusBadge status={order.status} /></td>
                      <td>
                        <select
                          className="form-select"
                          style={{ padding: 'var(--space-1) var(--space-2)', fontSize: 'var(--text-xs)', minWidth: '120px' }}
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                        >
                          <option value="pending">Pendiente</option>
                          <option value="processing">Procesando</option>
                          <option value="shipped">Enviado</option>
                          <option value="delivered">Entregado</option>
                          <option value="cancelled">Cancelado</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
