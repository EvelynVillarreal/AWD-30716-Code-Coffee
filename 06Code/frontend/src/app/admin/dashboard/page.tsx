'use client';

import { useState, useEffect } from 'react';
import { orderApi, productApi, reportApi } from '@/services/api.client';
import { Order, Product } from '@/types';
import OrderStatusBadge from '@/components/order/OrderStatusBadge';
import Link from 'next/link';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [reportSummary, setReportSummary] = useState<{
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    setIsLoading(true);
    try {
      const [ordersData, productsData, reportData] = await Promise.all([
        orderApi.getAllOrders(),
        productApi.getAll(),
        reportApi.getSalesReport(),
      ]);
      setOrders(ordersData.slice(0, 5)); // Show latest 5
      setProducts(productsData.filter((p: Product) => p.stock <= 5)); // Low stock
      setReportSummary(reportData.summary);
    } catch {
      // Dashboard handles partial failures silently
    } finally {
      setIsLoading(false);
    }
  }

  async function handleStatusChange(orderId: number, newStatus: string) {
    try {
      await orderApi.changeStatus(orderId, newStatus);
      loadDashboardData();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error al actualizar el estado');
    }
  }

  if (isLoading) {
    return (
      <ProtectedRoute adminOnly>
        <div style={{ textAlign: 'center', padding: 'var(--space-20)' }}>
          <div className="spinner" style={{ margin: '0 auto', width: 40, height: 40 }} />
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute adminOnly>
      <div className="container" style={{ padding: 'var(--space-8) var(--space-6)' }}>
        <div style={{ marginBottom: 'var(--space-8)' }}>
          <h1 className="section-title">Panel de Administración</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>Administra tu Tienda de Artesanía</p>
        </div>

        {/* Quick Nav */}
        <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-8)', flexWrap: 'wrap' }}>
          {[
            { label: '📦 Todos los Pedidos', href: '/admin/orders' },
            { label: '🏺 Productos', href: '/admin/products' },
            { label: '🚚 Envío', href: '/admin/shipping' },
            { label: '📊 Reportes', href: '/admin/reports' },
          ].map((item) => (
            <Link key={item.href} href={item.href} className="btn btn-ghost btn-sm">
              {item.label}
            </Link>
          ))}
        </div>

        {/* Stats */}
        {reportSummary && (
          <div className="admin-grid" style={{ marginBottom: 'var(--space-8)' }}>
            {[
              { label: 'Ingresos Totales', value: formatPrice(reportSummary.totalRevenue), icon: '💰' },
              { label: 'Pedidos Totales', value: reportSummary.totalOrders, icon: '📦' },
              { label: 'Valor Promedio del Pedido', value: formatPrice(reportSummary.averageOrderValue), icon: '📈' },
              { label: 'Artículos con Bajo Stock', value: products.length, icon: '⚠️' },
            ].map((stat) => (
              <div key={stat.label} className="glass-card" style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '1.8rem', display: 'block', marginBottom: 'var(--space-2)' }}>
                  {stat.icon}
                </span>
                <p style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-honey)', fontFamily: 'var(--font-display)' }}>
                  {stat.value}
                </p>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 'var(--space-1)' }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Recent Orders */}
        <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)' }}>Pedidos Recientes</h2>
            <Link href="/admin/orders" className="btn btn-ghost btn-sm">Ver Todos</Link>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Referencia</th>
                  <th>Cliente</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td style={{ fontWeight: 600 }}>{order.referenceNumber}</td>
                    <td>{order.contactName}</td>
                    <td style={{ color: 'var(--color-honey)', fontWeight: 600 }}>{formatPrice(order.total)}</td>
                    <td><OrderStatusBadge status={order.status} /></td>
                    <td>
                      <select
                        id={`status-select-${order.id}`}
                        className="form-select"
                        style={{ padding: 'var(--space-1) var(--space-2)', fontSize: 'var(--text-xs)' }}
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      >
                        <option value="pending">Pendiente</option>
                        <option value="processing">Procesando</option>
                        <option value="shipped">Enviado</option>
                        <option value="delivered">Entregado</option>
                        <option value="cancelled">Cancelado</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alert */}
        {products.length > 0 && (
          <div className="card">
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', marginBottom: 'var(--space-4)' }}>
              ⚠️ Alerta de Bajo Stock
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {products.map((product) => (
                <div key={product.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: 'var(--space-3)',
                  background: 'rgba(240, 165, 0, 0.08)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid rgba(240, 165, 0, 0.2)',
                }}>
                  <span style={{ fontSize: 'var(--text-sm)' }}>{product.name}</span>
                  <span style={{ color: 'var(--color-warning)', fontWeight: 700, fontSize: 'var(--text-sm)' }}>
                    {product.stock} restantes
                  </span>
                </div>
              ))}
            </div>
            <Link href="/admin/products" className="btn btn-ghost btn-sm" style={{ marginTop: 'var(--space-4)' }}>
              Administrar Stock →
            </Link>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
