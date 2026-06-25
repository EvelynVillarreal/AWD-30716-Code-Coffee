'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { productApi } from '@/services/api.client';
import { Product, Category } from '@/types';
import ProductCard from '@/components/product/ProductCard';
import { useAuth } from '@/contexts/AuthContext';

export default function HomePage() {
  const { isLoggedIn } = useAuth();
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
      // Non-blocking
    }
  }

  async function loadProducts(categoryId?: number) {
    setIsLoading(true);
    setError(null);
    try {
      const data = await productApi.getAll(categoryId);
      setProducts(data);
    } catch {
      setError('Error al cargar los productos. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="page-wrapper">
      {/* Hero Section */}
      <section className="hero" style={{ padding: 'var(--space-20) var(--space-6)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div className="container">
          <span style={{ fontSize: '4rem', display: 'block', marginBottom: 'var(--space-4)' }}>🏺</span>
          <h1 className="hero-title animate-fade-in" style={{ fontSize: 'clamp(3rem, 8vw, 5.5rem)', maxWidth: '900px', margin: '0 auto var(--space-4)' }}>
            Hecho a Mano con Pasión
          </h1>
          <p className="hero-subtitle animate-fade-in" style={{ animationDelay: '0.1s', fontSize: 'var(--text-xl)', maxWidth: '700px', margin: '0 auto var(--space-8)' }}>
            Descubre piezas únicas creadas por artesanos locales. Cada artículo cuenta una historia de habilidad, dedicación y herencia cultural.
          </p>
          
          {/* Action Buttons based on Auth state */}
          {!isLoggedIn && (
            <div className="animate-fade-in" style={{ animationDelay: '0.2s', display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/login" className="btn btn-primary btn-lg">
                Iniciar Sesión
              </Link>
              <Link href="/register" className="btn btn-secondary btn-lg">
                Registrarse
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Catalog Section */}
      <section style={{ padding: 'var(--space-12) var(--space-6)', background: 'var(--color-bg-secondary)' }}>
        <div className="container">
          <h2 className="section-title" style={{ textAlign: 'center', marginBottom: 'var(--space-2)' }}>Catálogo de Productos</h2>
          <p className="section-subtitle" style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
            Explora nuestra colección de piezas artesanales
          </p>

          {/* Category Filter */}
          {categories.length > 0 && (
            <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', justifyContent: 'center', marginBottom: 'var(--space-8)' }}>
              <button
                className={`btn btn-sm ${selectedCategory === undefined ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setSelectedCategory(undefined)}
              >
                Todos
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  className={`btn btn-sm ${selectedCategory === category.id ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.name}
                </button>
              ))}
            </div>
          )}

          {/* Error State */}
          {error && <div className="alert alert-error">{error}</div>}

          {/* Loading State */}
          {isLoading && (
            <div style={{ textAlign: 'center', padding: 'var(--space-16)' }}>
              <div className="spinner" style={{ margin: '0 auto', width: 40, height: 40 }} />
              <p style={{ marginTop: 'var(--space-4)', color: 'var(--color-text-muted)' }}>
                Cargando catálogo...
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
                No se encontraron productos
              </h3>
              <p style={{ color: 'var(--color-text-muted)' }}>
                Intenta con otra categoría o vuelve más tarde.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
