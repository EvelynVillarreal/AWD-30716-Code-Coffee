'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authApi } from '@/services/api.client';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    province: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateField(field: string, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  async function handleRegister(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const { user, token } = await authApi.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone || undefined,
        province: formData.province || undefined,
      });
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user_role', user.role);
      localStorage.setItem('user_name', user.name);
      router.push('/');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Registration failed';
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
      <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '480px' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
          <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: 'var(--space-3)' }}>🏺</span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', marginBottom: 'var(--space-2)' }}>
            Join the Community
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
            Create your Artisan Shop account
          </p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleRegister}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label htmlFor="register-name" className="form-label">Full Name</label>
              <input id="register-name" type="text" className="form-input" placeholder="Your name"
                value={formData.name} onChange={(e) => updateField('name', e.target.value)} required />
            </div>

            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label htmlFor="register-email" className="form-label">Email Address</label>
              <input id="register-email" type="email" className="form-input" placeholder="you@example.com"
                value={formData.email} onChange={(e) => updateField('email', e.target.value)} required />
            </div>

            <div className="form-group">
              <label htmlFor="register-password" className="form-label">Password</label>
              <input id="register-password" type="password" className="form-input" placeholder="Min. 8 characters"
                value={formData.password} onChange={(e) => updateField('password', e.target.value)} required minLength={8} />
            </div>

            <div className="form-group">
              <label htmlFor="register-confirm-password" className="form-label">Confirm Password</label>
              <input id="register-confirm-password" type="password" className="form-input" placeholder="Repeat password"
                value={formData.confirmPassword} onChange={(e) => updateField('confirmPassword', e.target.value)} required />
            </div>

            <div className="form-group">
              <label htmlFor="register-phone" className="form-label">Phone (Optional)</label>
              <input id="register-phone" type="tel" className="form-input" placeholder="+1 555 0100"
                value={formData.phone} onChange={(e) => updateField('phone', e.target.value)} />
            </div>

            <div className="form-group">
              <label htmlFor="register-province" className="form-label">Province (Optional)</label>
              <input id="register-province" type="text" className="form-input" placeholder="Your province"
                value={formData.province} onChange={(e) => updateField('province', e.target.value)} />
            </div>
          </div>

          <button id="register-submit-btn" type="submit" className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center' }} disabled={isLoading}>
            {isLoading ? <><span className="spinner" />Creating account...</> : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 'var(--space-6)', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
          Already have an account?{' '}
          <Link href="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
