'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authApi } from '@/services/api.client';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { user, token } = await authApi.login(email, password);
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user_role', user.role);
      localStorage.setItem('user_name', user.name);
      router.push(user.role === 'admin' ? '/admin/dashboard' : '/');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--space-8)',
    }}>
      <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '440px' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
          <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: 'var(--space-3)' }}>☕</span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', marginBottom: 'var(--space-2)' }}>
            Welcome Back
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
            Sign in to your Artisan Shop account
          </p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="login-email" className="form-label">Email Address</label>
            <input
              id="login-email"
              type="email"
              className="form-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="login-password" className="form-label">Password</label>
            <input
              id="login-password"
              type="password"
              className="form-input"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <button
            id="login-submit-btn"
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center' }}
            disabled={isLoading}
          >
            {isLoading ? <><span className="spinner" />Signing in...</> : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 'var(--space-6)', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
          Don&apos;t have an account?{' '}
          <Link href="/register">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
