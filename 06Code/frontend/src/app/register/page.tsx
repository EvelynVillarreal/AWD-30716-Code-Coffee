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

    if (!formData.address || !formData.province || !formData.phone) {
      setError('Por favor completa los datos de envío (Dirección, Provincia y Teléfono)');
      return;
    }

    const ecuadorPhoneRegex = /^(\+593|0)[2-9]\d{7,8}$/;
    if (!ecuadorPhoneRegex.test(formData.phone)) {
      setError('El número de teléfono debe ser válido para Ecuador (Ej: 0987654321 o 022123456)');
      return;
    }

    setIsLoading(true);

    try {
      const { user, token } = await authApi.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        address: formData.address,
        province: formData.province,
      });
      router.push('/login');
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

        <div className="alert alert-info" style={{ marginBottom: 'var(--space-4)' }}>
          <span style={{ marginRight: '8px' }}>🚚</span>
          <strong>Nota importante:</strong> Actualmente solo realizamos envíos dentro de Ecuador. Por favor, asegúrate de proveer una dirección, provincia y teléfono válidos.
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
              <label htmlFor="register-address" className="form-label">Dirección de Envío</label>
              <input id="register-address" type="text" className="form-input" placeholder="Dirección completa"
                value={formData.address} onChange={(e) => updateField('address', e.target.value)} required />
            </div>

            <div className="form-group">
              <label htmlFor="register-phone" className="form-label">Teléfono (Ecuador)</label>
              <input id="register-phone" type="tel" className="form-input" placeholder="0987654321"
                value={formData.phone} onChange={(e) => updateField('phone', e.target.value)} required />
            </div>

            <div className="form-group">
              <label htmlFor="register-province" className="form-label">Provincia</label>
              <select id="register-province" className="form-input" value={formData.province} onChange={(e) => updateField('province', e.target.value)} required>
                <option value="" disabled>Selecciona tu provincia</option>
                <option value="Azuay">Azuay</option>
                <option value="Bolívar">Bolívar</option>
                <option value="Cañar">Cañar</option>
                <option value="Carchi">Carchi</option>
                <option value="Chimborazo">Chimborazo</option>
                <option value="Cotopaxi">Cotopaxi</option>
                <option value="El Oro">El Oro</option>
                <option value="Esmeraldas">Esmeraldas</option>
                <option value="Galápagos">Galápagos</option>
                <option value="Guayas">Guayas</option>
                <option value="Imbabura">Imbabura</option>
                <option value="Loja">Loja</option>
                <option value="Los Ríos">Los Ríos</option>
                <option value="Manabí">Manabí</option>
                <option value="Morona Santiago">Morona Santiago</option>
                <option value="Napo">Napo</option>
                <option value="Orellana">Orellana</option>
                <option value="Pastaza">Pastaza</option>
                <option value="Pichincha">Pichincha</option>
                <option value="Santa Elena">Santa Elena</option>
                <option value="Santo Domingo de los Tsáchilas">Santo Domingo de los Tsáchilas</option>
                <option value="Sucumbíos">Sucumbíos</option>
                <option value="Tungurahua">Tungurahua</option>
                <option value="Zamora Chinchipe">Zamora Chinchipe</option>
              </select>
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
