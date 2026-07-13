'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { productApi } from '@/services/api.client';
import { Category, Product } from '@/types';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function ProductFormPage() {
  const params = useParams();
  const router = useRouter();
  
  const isEditing = params.id !== 'new';
  const productId = Number(params.id);

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(isEditing);
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

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);

  useEffect(() => {
    loadCategories();
    if (isEditing) {
      loadProduct();
    }
  }, [isEditing]);

  async function loadCategories() {
    try {
      const data = await productApi.getCategories(true);
      setCategories(data);
    } catch {
      // Non-blocking
    }
  }

  async function loadProduct() {
    try {
      const product = await productApi.getById(productId);
      
      if (product) {
        setFormData({
          name: product.name,
          description: product.description || '',
          price: product.price.toString(),
          stock: product.stock.toString(),
          categoryId: product.categoryId?.toString() || '',
          allowsCustomization: product.allowsCustomization,
          isActive: product.status === 'active',
          photoUrl: product.photos?.[0]?.url || '',
        });
        setImagePreview(product.photos?.[0]?.url || null);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al cargar el producto');
    } finally {
      setIsLoading(false);
    }
  }

  function updateField(field: string, value: string | boolean) {
    setFormData(prev => ({ ...prev, [field]: value }));
  }

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('La imagen no debe superar los 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target?.result as string;
      setImageBase64(base64String);
      setImagePreview(base64String);
      updateField('photoUrl', '');
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      if (isEditing) {
        await productApi.update(productId, {
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock, 10),
          categoryId: parseInt(formData.categoryId, 10),
          allowsCustomization: formData.allowsCustomization,
          status: formData.isActive ? 'active' : 'inactive',
          ...(imageBase64 ? { photoUrl: imageBase64 } : (formData.photoUrl && { photoUrl: formData.photoUrl }))
        });
      } else {
        await productApi.create({
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock, 10),
          categoryId: parseInt(formData.categoryId, 10),
          allowsCustomization: formData.allowsCustomization,
          status: formData.isActive ? 'active' : 'inactive',
          ...(imageBase64 ? { photoUrl: imageBase64 } : (formData.photoUrl && { photoUrl: formData.photoUrl }))
        });
      }
      alert('¡Producto guardado con éxito!');
      router.push('/admin/products');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al guardar el producto');
    } finally {
      setIsSaving(false);
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
      <div className="container" style={{ padding: 'var(--space-12) var(--space-6)' }}>
        <button onClick={() => router.back()} className="btn btn-ghost btn-sm" style={{ marginBottom: 'var(--space-6)' }}>
          ← Volver
        </button>

        <h1 className="section-title">{isEditing ? 'Editar Producto' : 'Agregar Nuevo Producto'}</h1>
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
              <label className="form-label">Imagen del Producto (Elige una opción)</label>
              
              <div style={{ padding: 'var(--space-4)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-4)' }}>
                <label className="form-label" style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)' }}>
                  Opción 1: Subir desde el dispositivo (Recomendado, Max 2MB)
                </label>
                <input 
                  type="file" 
                  accept="image/png, image/jpeg" 
                  className="form-input" 
                  onChange={handleImageUpload} 
                />
              </div>

              <div style={{ padding: 'var(--space-4)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
                <label className="form-label" htmlFor="photoUrl" style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)' }}>
                  Opción 2: Pegar URL externa
                </label>
                <input id="photoUrl" type="url" className="form-input" placeholder="https://..."
                  value={formData.photoUrl} onChange={e => {
                    updateField('photoUrl', e.target.value);
                    if (e.target.value) {
                      setImageBase64(null);
                      setImagePreview(e.target.value);
                    } else if (!imageBase64) {
                      setImagePreview(null);
                    }
                  }} />
              </div>

              {imagePreview && (
                <div style={{ marginTop: 'var(--space-4)' }}>
                  <label className="form-label">Previsualización:</label>
                  <div style={{ width: '150px', height: '150px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
                    <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                </div>
              )}
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
