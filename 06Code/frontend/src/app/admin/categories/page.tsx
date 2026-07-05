'use client';

import { useState, useEffect } from 'react';
import { productApi } from '@/services/api.client';
import { Category } from '@/types';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Link from 'next/link';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [newName, setNewName] = useState('');

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    setIsLoading(true);
    try {
      const data = await productApi.getCategories(true);
      setCategories(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    setIsSaving(true);
    try {
      // @ts-ignore
      await productApi.createCategory({ name: newName, isActive: true });
      setNewName('');
      loadCategories();
    } catch (err: any) {
      alert(err.message || 'Error al crear la categoría');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleUpdate(id: number) {
    if (!editName.trim()) return;
    setIsSaving(true);
    try {
      // @ts-ignore
      await productApi.updateCategory(id, { name: editName });
      setIsEditing(null);
      loadCategories();
    } catch (err: any) {
      alert(err.message || 'Error al actualizar');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleToggleStatus(id: number, currentStatus: boolean) {
    setIsSaving(true);
    try {
      // @ts-ignore
      await productApi.updateCategory(id, { isActive: !currentStatus });
      loadCategories();
    } catch (err: any) {
      alert(err.message || 'Error al cambiar estado');
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
      <div className="container" style={{ padding: 'var(--space-8) var(--space-6)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-8)' }}>
          <div>
            <h1 className="section-title">Categorías</h1>
            <p style={{ color: 'var(--color-text-muted)' }}>Administra las categorías de tus productos</p>
          </div>
          <Link href="/admin/dashboard" className="btn btn-ghost">Volver al Panel</Link>
        </div>

        <div className="card" style={{ marginBottom: 'var(--space-8)' }}>
          <h2 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-4)' }}>Agregar Nueva Categoría</h2>
          <form onSubmit={handleCreate} style={{ display: 'flex', gap: 'var(--space-4)' }}>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Nombre de la categoría" 
              value={newName} 
              onChange={e => setNewName(e.target.value)}
              required
              style={{ flex: 1 }}
            />
            <button type="submit" disabled={isSaving} className="btn btn-primary">
              Agregar
            </button>
          </form>
        </div>

        <div className="card">
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.id} style={{ opacity: category.isActive ? 1 : 0.6 }}>
                    <td>{category.id}</td>
                    <td>
                      {isEditing === category.id ? (
                        <input 
                          type="text"
                          className="form-input"
                          value={editName}
                          onChange={e => setEditName(e.target.value)}
                          style={{ padding: 'var(--space-1) var(--space-2)' }}
                          autoFocus
                        />
                      ) : (
                        <strong>{category.name}</strong>
                      )}
                    </td>
                    <td>
                      <span style={{ 
                        padding: '2px 8px', 
                        borderRadius: '12px', 
                        fontSize: '0.8rem',
                        background: category.isActive ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
                        color: category.isActive ? '#2e7d32' : '#c62828'
                      }}>
                        {category.isActive ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                        {isEditing === category.id ? (
                          <>
                            <button onClick={() => handleUpdate(category.id)} className="btn btn-primary btn-sm" disabled={isSaving}>Guardar</button>
                            <button onClick={() => setIsEditing(null)} className="btn btn-ghost btn-sm">Cancelar</button>
                          </>
                        ) : (
                          <>
                            <button 
                              onClick={() => { setIsEditing(category.id); setEditName(category.name); }} 
                              className="btn btn-ghost btn-sm"
                            >
                              Editar
                            </button>
                            <button 
                              onClick={() => handleToggleStatus(category.id, category.isActive)} 
                              className="btn btn-ghost btn-sm"
                              disabled={isSaving}
                            >
                              {category.isActive ? 'Deshabilitar' : 'Habilitar'}
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {categories.length === 0 && (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
                      No hay categorías registradas.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
