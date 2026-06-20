'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const role = localStorage.getItem('user_role');
    setIsLoggedIn(!!token);
    setUserRole(role);
  }, []);

  function handleLogout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_name');
    setIsLoggedIn(false);
    setUserRole(null);
    window.location.href = '/';
  }

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(15, 9, 6, 0.85)',
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
            color: 'var(--color-cream)',
          }}>
            Artisan Shop
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)' }}
          className="desktop-nav">
          <Link href="/products" style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', fontWeight: 500 }}>
            Products
          </Link>
          <Link href="/gallery" style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', fontWeight: 500 }}>
            Gallery
          </Link>
          {isLoggedIn && (
            <Link href="/orders" style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', fontWeight: 500 }}>
              My Orders
            </Link>
          )}
          {userRole === 'admin' && (
            <Link href="/admin/dashboard" style={{ color: 'var(--color-text-accent)', fontSize: 'var(--text-sm)', fontWeight: 600 }}>
              Admin
            </Link>
          )}
        </nav>

        {/* Auth Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <Link href="/cart" className="btn btn-ghost btn-sm" id="header-cart-btn">
            🛒 Cart
          </Link>
          {isLoggedIn ? (
            <button onClick={handleLogout} className="btn btn-secondary btn-sm" id="header-logout-btn">
              Sign Out
            </button>
          ) : (
            <>
              <Link href="/login" className="btn btn-ghost btn-sm" id="header-login-btn">
                Sign In
              </Link>
              <Link href="/register" className="btn btn-primary btn-sm" id="header-register-btn">
                Join Us
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
