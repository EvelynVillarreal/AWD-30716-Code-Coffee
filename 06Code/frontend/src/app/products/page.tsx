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
      setProducts(data);
    } catch {
      setError('Failed to load products. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container" style={{ padding: 'var(--space-12) var(--space-6)' }}>
      {/* Page Header */}
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 className="section-title">Our Collection</h1>
        <p className="section-subtitle">
          Handcrafted pieces made with passion — browse by category or explore all
        </p>

        {/* Category Filter */}
        {categories.length > 0 && (
          <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
            <button
              id="filter-all"
              className={`btn btn-sm ${selectedCategory === undefined ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setSelectedCategory(undefined)}
            >
              All
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
      </div>

      {/* Error State */}
      {error && <div className="alert alert-error">{error}</div>}

      {/* Loading State */}
      {isLoading && (
        <div style={{ textAlign: 'center', padding: 'var(--space-16)' }}>
          <div className="spinner" style={{ margin: '0 auto', width: 40, height: 40 }} />
          <p style={{ marginTop: 'var(--space-4)', color: 'var(--color-text-muted)' }}>
            Loading collection...
          </p>
        </div>
      )}

      {/* Product Grid */}
      {!isLoading && products.length > 0 && (
        <div className="product-grid animate-fade-in">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && products.length === 0 && !error && (
        <div style={{ textAlign: 'center', padding: 'var(--space-16)' }}>
          <span style={{ fontSize: '4rem', display: 'block', marginBottom: 'var(--space-4)' }}>🏺</span>
          <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 'var(--space-2)' }}>
            No products found
          </h3>
          <p style={{ color: 'var(--color-text-muted)' }}>
            Try a different category or check back soon.
          </p>
        </div>
      )}
    </div>
  );
}
