'use client';

import { useState, useEffect } from 'react';
import { reportApi } from '@/services/api.client';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

export default function AdminReportsPage() {
  const [report, setReport] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Default to current month
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(firstDay);
  const [endDate, setEndDate] = useState(lastDay);

  useEffect(() => {
    loadReport();
  }, [startDate, endDate]);

  async function loadReport() {
    setIsLoading(true);
    try {
      // Need to add T00:00:00 to start date and T23:59:59 to end date for full coverage
      const start = startDate ? `${startDate}T00:00:00.000Z` : undefined;
      const end = endDate ? `${endDate}T23:59:59.999Z` : undefined;
      const data = await reportApi.getSalesReport(start, end);
      setReport(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  function downloadCSV() {
    if (!report || !report.orders) return;
    
    const headers = ['ID Pedido', 'Fecha', 'Cliente', 'Email', 'Estado', 'Total'];
    const rows = report.orders.map((o: any) => [
      o.referenceNumber || o.id,
      new Date(o.createdAt).toLocaleDateString(),
      `"${o.contactName}"`,
      o.email,
      o.status,
      o.total
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row: any) => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `reporte_ventas_${startDate}_al_${endDate}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <ProtectedRoute adminOnly>
      <div className="container" style={{ padding: 'var(--space-8) var(--space-6)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-8)', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <h1 className="section-title">Reportes de Ventas</h1>
            <p style={{ color: 'var(--color-text-muted)' }}>Analiza el rendimiento de tu tienda</p>
          </div>
          
          <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-end' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: 'var(--text-xs)' }}>Fecha Inicio</label>
              <input type="date" className="form-input" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: 'var(--text-xs)' }}>Fecha Fin</label>
              <input type="date" className="form-input" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
            <button onClick={downloadCSV} className="btn btn-outline" disabled={isLoading || !report}>
              ⬇️ Descargar CSV
            </button>
          </div>
        </div>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-20)' }}>
            <div className="spinner" style={{ margin: '0 auto', width: 50, height: 50 }} />
          </div>
        ) : !report ? (
           <div className="alert alert-error">Error al cargar los reportes.</div>
        ) : (
          <>
            {/* KPI Cards */}
            <div className="admin-grid" style={{ marginBottom: 'var(--space-8)' }}>
              <div className="glass-card" style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '1.8rem', display: 'block', marginBottom: 'var(--space-2)' }}>💰</span>
                <p style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-honey)', fontFamily: 'var(--font-display)' }}>
                  {formatPrice(report.summary.totalRevenue)}
                </p>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 'var(--space-1)' }}>Ingresos</p>
              </div>
              <div className="glass-card" style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '1.8rem', display: 'block', marginBottom: 'var(--space-2)' }}>📦</span>
                <p style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-honey)', fontFamily: 'var(--font-display)' }}>
                  {report.summary.totalOrders}
                </p>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 'var(--space-1)' }}>Pedidos</p>
              </div>
              <div className="glass-card" style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '1.8rem', display: 'block', marginBottom: 'var(--space-2)' }}>📈</span>
                <p style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-honey)', fontFamily: 'var(--font-display)' }}>
                  {formatPrice(report.summary.averageOrderValue)}
                </p>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 'var(--space-1)' }}>Ticket Promedio</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
              {/* Top Products */}
              <div className="card">
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', marginBottom: 'var(--space-4)' }}>⭐ Productos Más Vendidos</h2>
                {report.summary.topProducts && report.summary.topProducts.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                    {report.summary.topProducts.map((p: any, idx: number) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 'var(--space-2)', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                        <div>
                          <span style={{ fontWeight: 600 }}>{idx + 1}.</span> {p.name}
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontWeight: 600 }}>{p.quantity} unid.</div>
                          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-honey)' }}>{formatPrice(p.revenue)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: 'var(--color-text-muted)' }}>No hay suficientes datos de ventas.</p>
                )}
              </div>

              {/* Top Customers */}
              <div className="card">
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', marginBottom: 'var(--space-4)' }}>🏆 Mejores Clientes</h2>
                {report.summary.topCustomers && report.summary.topCustomers.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                    {report.summary.topCustomers.map((c: any, idx: number) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 'var(--space-2)', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                        <div>
                          <div style={{ fontWeight: 600 }}>{c.name}</div>
                          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{c.email}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontWeight: 600, color: 'var(--color-honey)' }}>{formatPrice(c.totalSpent)}</div>
                          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{c.ordersCount} pedidos</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: 'var(--color-text-muted)' }}>No hay suficientes datos de clientes.</p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </ProtectedRoute>
  );
}
