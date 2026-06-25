'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useCart } from '@/contexts/CartContext';

export default function Header() {
  const { isLoggedIn, isAdmin, logout, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { totalItems } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  function handleMobileMenuToggle() {
    setIsMobileMenuOpen((prev) => !prev);
  }

  function handleLogout() {
    logout();
    setIsMobileMenuOpen(false);
  }

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'var(--header-bg)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--color-border)',
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '64px',
      }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <span style={{ fontSize: '1.5rem' }}>☕</span>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-xl)',
            fontWeight: 700,
            color: 'var(--color-text-primary)',
          }}>
            Artisan Shop
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)' }} className="desktop-nav">
          <Link href="/products" style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', fontWeight: 500 }}>
            Productos
          </Link>
          {isLoggedIn && (
            <Link href="/orders" style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', fontWeight: 500 }}>
              Mis Pedidos
            </Link>
          )}
          {isAdmin && (
            <Link href="/admin/dashboard" style={{ color: 'var(--color-text-accent)', fontSize: 'var(--text-sm)', fontWeight: 600 }}>
              Panel de Administración
            </Link>
          )}
        </nav>

        {/* Desktop Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          {isMounted && (
            <button
              onClick={toggleTheme}
              className="btn btn-ghost btn-sm"
              style={{ fontSize: '1.2rem', padding: 'var(--space-1) var(--space-2)' }}
              title={theme === 'dark' ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          )}

          <Link href="/cart" className="btn btn-ghost btn-sm">
            🛒 Carrito {isMounted && totalItems > 0 && `(${totalItems})`}
          </Link>

          {isMounted && isLoggedIn ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', display: 'none' }}>
                Hola, {user?.name.split(' ')[0]}
              </span>
              <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                Cerrar Sesión
              </button>
            </div>
          ) : isMounted ? (
            <>
              <Link href="/login" className="btn btn-ghost btn-sm">
                Iniciar Sesión
              </Link>
              <Link href="/register" className="btn btn-primary btn-sm">
                Registrarse
              </Link>
            </>
          ) : null}
        </div>
      </div>
    </header>
  );
}
