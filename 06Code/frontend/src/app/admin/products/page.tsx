'use client';

import { useState, useEffect } from 'react';
import { productApi } from '@/services/api.client';
import { Product } from '@/types';
import Link from 'next/link';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    setIsLoading(true);
    setError(null);
    try {
      const data = await productApi.getAll();
      setProducts(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al cargar los productos');
    } finally {
      setIsLoading(false);
    }
  }

  async function toggleProductStatus(id: number, currentStatus: 'active' | 'inactive') {
    try {
      // Optimistic update
      const newStatus: 'active' | 'inactive' = currentStatus === 'active' ? 'inactive' : 'active';
      setProducts(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
      // await productApi.updateProduct(id, { status: newStatus });
    } catch (err) {
      // Revert if API fails
      setProducts(prev => prev.map(p => p.id === id ? { ...p, status: currentStatus } : p));
      alert('Error al actualizar el estado del producto');
    }
  }

  return (
    <ProtectedRoute adminOnly>
      <div className="container" style={{ padding: 'var(--space-12) var(--space-6)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-8)', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <h1 className="section-title">Administración de Productos</h1>
            <p className="section-subtitle" style={{ margin: 0 }}>Administra catálogo, precios e inventario</p>
          </div>
          
          <Link href="/admin/products/new" className="btn btn-primary">
            + Agregar Nuevo Producto
          </Link>
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
                  <th>Producto</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
                      No se encontraron productos. Empieza agregando uno.
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                          <div style={{ width: '40px', height: '40px', background: 'var(--color-bg-elevated)', borderRadius: 'var(--radius-sm)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {product.photos?.[0] ? (
                              <img src={product.photos[0].url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                              <span style={{ fontSize: '1rem', opacity: 0.5 }}>🏺</span>
                            )}
                          </div>
                          <span style={{ fontWeight: 600 }}>{product.name}</span>
                        </div>
                      </td>
                      <td>{product.category?.name || 'Sin categoría'}</td>
                      <td style={{ fontWeight: 600 }}>{formatPrice(product.price)}</td>
                      <td>
                        <span style={{ color: product.stock <= 5 ? 'var(--color-warning)' : 'inherit', fontWeight: product.stock <= 5 ? 700 : 400 }}>
                          {product.stock}
                        </span>
                      </td>
                      <td>
                        <button 
                          onClick={() => toggleProductStatus(product.id, product.status)}
                          className={`badge ${product.status === 'active' ? 'badge-active' : 'badge-inactive'}`}
                          style={{ border: 'none', cursor: 'pointer' }}
                        >
                          {product.status === 'active' ? 'Activo' : 'Borrador'}
                        </button>
                      </td>
                      <td>
                        <Link href={`/admin/products/${product.id}/edit`} className="btn btn-ghost btn-sm">
                          Editar
                        </Link>
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
