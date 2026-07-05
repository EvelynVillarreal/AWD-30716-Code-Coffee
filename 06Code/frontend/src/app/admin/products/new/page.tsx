'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { productApi } from '@/services/api.client';
import { Category } from '@/types';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function NewProductPage() {
  const router = useRouter();
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    categoryId: '',
    allowsCustomization: false,
    isActive: true,
    photoUrl: '',
  });

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      const data = await productApi.getCategories(true);
      setCategories(data);
    } catch {
      // Non-blocking
    }
  }

  function updateField(field: string, value: string | boolean) {
    setFormData(prev => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      await productApi.create({
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock, 10),
        categoryId: parseInt(formData.categoryId, 10),
        allowsCustomization: formData.allowsCustomization,
        status: formData.isActive ? 'active' : 'inactive',
        // Our updated business-service expects photoUrl to create the ProductPhoto
        ...(formData.photoUrl && { photoUrl: formData.photoUrl })
      });
      alert('¡Producto creado con éxito!');
      router.push('/admin/products');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al crear el producto');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <ProtectedRoute adminOnly>
      <div className="container" style={{ padding: 'var(--space-12) var(--space-6)' }}>
        <button onClick={() => router.back()} className="btn btn-ghost btn-sm" style={{ marginBottom: 'var(--space-6)' }}>
          ← Volver
        </button>

        <h1 className="section-title">Agregar Nuevo Producto</h1>
        <p className="section-subtitle">Completa los detalles del producto a continuación.</p>

        {error && <div className="alert alert-error">{error}</div>}

        <div className="card" style={{ maxWidth: '800px' }}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="name">Nombre del Producto</label>
              <input id="name" type="text" className="form-input" required
                value={formData.name} onChange={e => updateField('name', e.target.value)} />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="description">Descripción</label>
              <textarea id="description" className="form-textarea" required
                value={formData.description} onChange={e => updateField('description', e.target.value)} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="price">Precio (USD)</label>
                <input id="price" type="number" step="0.01" min="0" className="form-input" required
                  value={formData.price} onChange={e => updateField('price', e.target.value)} />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="stock">Cantidad en Stock</label>
                <input id="stock" type="number" min="0" className="form-input" required
                  value={formData.stock} onChange={e => updateField('stock', e.target.value)} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="category">Categoría</label>
              <select id="category" className="form-select" required
                value={formData.categoryId} onChange={e => updateField('categoryId', e.target.value)}>
                <option value="" disabled>Selecciona una categoría</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="photoUrl">URL de la Imagen del Producto</label>
              <input id="photoUrl" type="url" className="form-input" placeholder="https://..."
                value={formData.photoUrl} onChange={e => updateField('photoUrl', e.target.value)} />
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 'var(--space-1)' }}>
                <strong>Estrategia de Subida de Imágenes:</strong> Dado que enlaces externos como Pinterest bloquean la incrustación,
                recomendamos subir tus imágenes a un almacenamiento público (como Supabase Storage o Cloudinary)
                y pegar la URL pública directa aquí.
              </p>
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-4)', margin: 'var(--space-6) 0' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', cursor: 'pointer' }}>
                <input type="checkbox" checked={formData.isActive} onChange={e => updateField('isActive', e.target.checked)} />
                <span className="form-label" style={{ margin: 0 }}>Activo (Visible para los clientes)</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', cursor: 'pointer' }}>
                <input type="checkbox" checked={formData.allowsCustomization} onChange={e => updateField('allowsCustomization', e.target.checked)} />
                <span className="form-label" style={{ margin: 0 }}>Permite Personalización</span>
              </label>
            </div>

            <hr className="divider" />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
              <button type="button" onClick={() => router.back()} className="btn btn-ghost">Cancelar</button>
              <button type="submit" disabled={isSaving} className="btn btn-primary">
                {isSaving ? <><span className="spinner" /> Guardando...</> : 'Guardar Producto'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}
