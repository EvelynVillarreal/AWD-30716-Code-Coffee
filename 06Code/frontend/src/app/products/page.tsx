'use client';

import { useState, useEffect } from 'react';
import { productApi } from '@/services/api.client';
import { Product, Category } from '@/types';
import ProductCard from '@/components/product/ProductCard';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadProducts(selectedCategory);
  }, [selectedCategory]);

  async function loadCategories() {
    try {
      const data = await productApi.getCategories();
      setCategories(data);
    } catch {
      // Non-blocking — categories are optional filters
    }
  }

  async function loadProducts(categoryId?: number) {
    setIsLoading(true);
    setError(null);
    try {
      const data = await productApi.getAll(categoryId);
      const activeProducts = data.filter(p => p.status === 'active' && p.category?.isActive !== false);
      setProducts(activeProducts);
    } catch {
      setError('Error al cargar los productos. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container" style={{ padding: 'var(--space-12) var(--space-6)' }}>
      {/* Page Header */}
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 className="section-title">Nuestra Colección</h1>
        <p className="section-subtitle">
          Piezas hechas a mano con pasión — explora por categoría o mira todas
        </p>

        {/* Category Filter */}
        {categories.length > 0 && (
          <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
            <button
              id="filter-all"
              className={`btn btn-sm ${selectedCategory === undefined ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setSelectedCategory(undefined)}
            >
              Todos
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                id={`filter-category-${category.id}`}
                className={`btn btn-sm ${selectedCategory === category.id ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        )}

        {/* Search Bar */}
        <div style={{ marginTop: 'var(--space-4)', maxWidth: '400px' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Buscar por nombre o descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Error State */}
      {error && <div className="alert alert-error">{error}</div>}

      {/* Loading State */}
      {isLoading && (
        <div style={{ textAlign: 'center', padding: 'var(--space-16)' }}>
          <div className="spinner" style={{ margin: '0 auto', width: 40, height: 40 }} />
          <p style={{ marginTop: 'var(--space-4)', color: 'var(--color-text-muted)' }}>
            Cargando colección...
          </p>
        </div>
      )}

      {/* Product Grid */}
      {!isLoading && products.length > 0 && (
        <div className="product-grid animate-fade-in">
          {products.filter(p => 
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()))
          ).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && products.length === 0 && !error && (
        <div style={{ textAlign: 'center', padding: 'var(--space-16)' }}>
          <span style={{ fontSize: '4rem', display: 'block', marginBottom: 'var(--space-4)' }}>🏺</span>
          <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 'var(--space-2)' }}>
            No se encontraron productos
          </h3>
          <p style={{ color: 'var(--color-text-muted)' }}>
            Intenta con otra categoría o vuelve pronto.
          </p>
        </div>
      )}
    </div>
  );
}
