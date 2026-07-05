'use client';

import { useState, useEffect } from 'react';
import { shippingApi } from '@/services/api.client';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

export default function AdminShippingPage() {
  const [configs, setConfigs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    baseProvince: 'Pichincha',
    destinationProvince: '',
    additionalCost: ''
  });

  useEffect(() => {
    loadConfigs();
  }, []);

  async function loadConfigs() {
    setIsLoading(true);
    try {
      const data = await shippingApi.getAll();
      setConfigs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await shippingApi.create({
        ...formData,
        additionalCost: parseFloat(formData.additionalCost)
      });
      setFormData({ baseProvince: 'Pichincha', destinationProvince: '', additionalCost: '' });
      setIsFormOpen(false);
      loadConfigs();
    } catch (err) {
      alert('Error al guardar la tarifa. Es posible que ya exista una regla para esa provincia.');
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('¿Estás seguro de eliminar esta tarifa?')) return;
    try {
      await shippingApi.remove(id);
      loadConfigs();
    } catch (err) {
      alert('Error al eliminar');
    }
  }

  return (
    <ProtectedRoute adminOnly>
      <div className="container" style={{ padding: 'var(--space-8) var(--space-6)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-8)' }}>
          <div>
            <h1 className="section-title">Envíos y Tarifas</h1>
            <p style={{ color: 'var(--color-text-muted)' }}>Configura los costos de envío por provincia</p>
          </div>
          <button onClick={() => setIsFormOpen(true)} className="btn btn-primary">
            + Nueva Tarifa
          </button>
        </div>

        {isFormOpen && (
          <div className="card" style={{ marginBottom: 'var(--space-8)' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', marginBottom: 'var(--space-4)' }}>Agregar Tarifa</h2>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 'var(--space-4)', alignItems: 'end' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Provincia Base (Origen)</label>
                <input type="text" className="form-input" disabled value={formData.baseProvince} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Provincia Destino</label>
                <input type="text" className="form-input" required 
                       value={formData.destinationProvince} 
                       onChange={(e) => setFormData({...formData, destinationProvince: e.target.value})} 
                       placeholder="Ej. Guayas" />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Costo de Envío ($)</label>
                <input type="number" step="0.01" className="form-input" required 
                       value={formData.additionalCost} 
                       onChange={(e) => setFormData({...formData, additionalCost: e.target.value})} 
                       placeholder="5.00" />
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                <button type="submit" className="btn btn-primary">Guardar</button>
                <button type="button" className="btn btn-outline" onClick={() => setIsFormOpen(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        )}

        <div className="card">
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
              <div className="spinner" style={{ margin: '0 auto', width: 40, height: 40 }} />
            </div>
          ) : configs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-text-muted)' }}>
              No hay tarifas configuradas. El envío por defecto será de $0.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Provincia Origen</th>
                    <th>Provincia Destino</th>
                    <th>Costo</th>
                    <th style={{ width: '100px' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {configs.map((config) => (
                    <tr key={config.id}>
                      <td>{config.baseProvince}</td>
                      <td style={{ fontWeight: 600 }}>{config.destinationProvince}</td>
                      <td style={{ color: 'var(--color-honey)', fontWeight: 600 }}>{formatPrice(config.additionalCost)}</td>
                      <td>
                        <button onClick={() => handleDelete(config.id)} className="btn btn-ghost btn-sm" style={{ color: 'var(--color-error)' }}>
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        <div style={{ marginTop: 'var(--space-8)' }}>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
            Nota: Para administrar el estado de los envíos de tus pedidos, ve a la sección <strong>Pedidos</strong>.
          </p>
        </div>
      </div>
    </ProtectedRoute>
  );
}
