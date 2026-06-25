'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authApi } from '@/services/api.client';
import { useAuth } from '@/contexts/AuthContext';

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
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
      setError('Las contraseñas no coinciden');
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
        // The API register interface in api.client.ts might not have address yet, we pass it anyway 
        // if the API is updated later, it will accept it.
      });
      login(user, token);
      router.push('/products');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al registrarse';
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
            Únete a la Comunidad
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
            Crea tu cuenta de Artisan Shop
          </p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleRegister}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label htmlFor="register-name" className="form-label">Nombre Completo</label>
              <input id="register-name" type="text" className="form-input" placeholder="Tu nombre"
                value={formData.name} onChange={(e) => updateField('name', e.target.value)} required />
            </div>

            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label htmlFor="register-email" className="form-label">Correo Electrónico</label>
              <input id="register-email" type="email" className="form-input" placeholder="tu@ejemplo.com"
                value={formData.email} onChange={(e) => updateField('email', e.target.value)} required />
            </div>

            <div className="form-group">
              <label htmlFor="register-password" className="form-label">Contraseña</label>
              <input id="register-password" type="password" className="form-input" placeholder="Mín. 8 caracteres"
                value={formData.password} onChange={(e) => updateField('password', e.target.value)} required minLength={8} />
            </div>

            <div className="form-group">
              <label htmlFor="register-confirm-password" className="form-label">Confirmar Contraseña</label>
              <input id="register-confirm-password" type="password" className="form-input" placeholder="Repetir contraseña"
                value={formData.confirmPassword} onChange={(e) => updateField('confirmPassword', e.target.value)} required />
            </div>

            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label htmlFor="register-address" className="form-label">Dirección (Opcional)</label>
              <input id="register-address" type="text" className="form-input" placeholder="Dirección de tu calle"
                value={formData.address} onChange={(e) => updateField('address', e.target.value)} />
            </div>

            <div className="form-group">
              <label htmlFor="register-phone" className="form-label">Teléfono (Opcional)</label>
              <input id="register-phone" type="tel" className="form-input" placeholder="+1 555 0100"
                value={formData.phone} onChange={(e) => updateField('phone', e.target.value)} />
            </div>

            <div className="form-group">
              <label htmlFor="register-province" className="form-label">Provincia (Opcional)</label>
              <input id="register-province" type="text" className="form-input" placeholder="Tu provincia"
                value={formData.province} onChange={(e) => updateField('province', e.target.value)} />
            </div>
          </div>

          <button id="register-submit-btn" type="submit" className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center' }} disabled={isLoading}>
            {isLoading ? <><span className="spinner" />Creando cuenta...</> : 'Crear Cuenta'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 'var(--space-6)', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
          ¿Ya tienes una cuenta?{' '}
          <Link href="/login">Iniciar sesión</Link>
        </p>
      </div>
    </div>
  );
}
