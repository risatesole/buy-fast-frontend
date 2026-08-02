'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import type { UserDetails } from '@/services/user/getUserDetails';
import { getUserDetails } from '@/services/user/getUserDetails';
import { SectionLabel } from '@/components/account/SectionLabel';
import { FieldRow } from '@/components/account/FieldRow';
import { SaveButton } from '@/components/account/SaveButton';

export default function AccountPage() {
  // Profile state
  const [user, setUser] = useState<UserDetails | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Account state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saved, setSaved] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  useEffect(() => {
    async function loadUser() {
      try {
        setLoading(true);
        const userData = await getUserDetails();

        if (userData) {
          setUser(userData);
          setFirstName(userData.firstName ?? '');
          setLastName(userData.lastName ?? '');
          setEmail(userData.email ?? '');
          setBio(userData.bio ?? '');
        } else {
          setError('User data not found');
        }
      } catch (err) {
        console.error('Failed to load user', err);
        setError('Failed to load user data');
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  function handleSave() {
    // TODO: wire to your API
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (loading) {
    return <p style={{ fontSize: '0.875rem', color: '#43474f' }}>Cargando…</p>;
  }

  if (error || !user) {
    return (
      <p style={{ fontSize: '0.875rem', color: '#cc3b3b' }}>
        {error || 'No se pudo cargar la información del usuario'}
      </p>
    );
  }

  return (
    <div>
      {/* Profile Section */}
      <SectionLabel>Perfil</SectionLabel>
      <FieldRow label="Nombre">
        <Input
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
          placeholder="Nombre"
        />
      </FieldRow>
      <FieldRow label="Apellido">
        <Input
          value={lastName}
          onChange={e => setLastName(e.target.value)}
          placeholder="Apellido"
        />
      </FieldRow>
      <FieldRow label="Correo Electrónico" hint="Dirección asociada a tu cuenta.">
        <Input
          value={email}
          onChange={e => setEmail(e.target.value)}
          type="email"
          placeholder="tu@correo.edu.do"
        />
      </FieldRow>
      <FieldRow label="Biografía" hint="Una breve descripción que se muestra en tu perfil público.">
        <textarea
          value={bio}
          onChange={e => setBio(e.target.value)}
          placeholder="Cuéntanos un poco sobre ti…"
          rows={3}
          style={{
            width: '100%',
            padding: '0.5rem 0.75rem',
            fontSize: '0.875rem',
            border: '1px solid #e0e3e5',
            borderRadius: 4,
            background: '#ffffff',
            color: '#191c1e',
            outline: 'none',
            resize: 'vertical',
            boxSizing: 'border-box',
            fontFamily: 'var(--font-geist-sans), sans-serif',
            lineHeight: 1.6,
          }}
          onFocus={e => (e.currentTarget.style.borderColor = '#115cb9')}
          onBlur={e => (e.currentTarget.style.borderColor = '#e0e3e5')}
        />
      </FieldRow>
      <div style={{ paddingTop: '1.5rem' }}>
        <SaveButton onClick={handleSave} saved={saved} />
      </div>

      {/* Account Section - Password */}
      <div style={{ marginTop: '3rem' }}>
        <SectionLabel>Seguridad</SectionLabel>
          <FieldRow label="Contraseña actual">
          <Input
            type="password"
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
          />
        </FieldRow>
          <FieldRow label="Nueva contraseña" hint="Mínimo 8 caracteres.">
          <Input
            type="password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
              placeholder="••••••••"
          />
        </FieldRow>
          <FieldRow label="Confirmar nueva contraseña">
          <Input
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
          />
        </FieldRow>
        <div style={{ paddingTop: '1.5rem' }}>
          <SaveButton onClick={handleSave} saved={saved} />
        </div>
      </div>

      {/* Danger Zone */}
      <div
        style={{
          marginTop: '3rem',
          paddingTop: '2rem',
          borderTop: '1px solid #e0e3e5',
        }}
      >
        <p
          style={{
            fontSize: '0.68rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#cc3b3b',
            marginBottom: '1rem',
          }}
        >
          Zona peligrosa
        </p>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem',
            border: '1px solid oklch(0.922 0 0)',
            borderRadius: 4,
          }}
        >
          <div>
            <p
              style={{
                fontSize: '0.875rem',
                fontWeight: 500,
                marginBottom: '0.25rem',
              }}
            >
              Eliminar cuenta
            </p>
            <p style={{ fontSize: '0.75rem', color: '#747781' }}>
              Eliminar permanentemente tu cuenta y todos los datos.
            </p>
          </div>
          {deleteConfirm ? (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                onClick={() => setDeleteConfirm(false)}
                style={{
                  padding: '0.4rem 0.9rem',
                  fontSize: '0.75rem',
                  border: '1px solid #e0e3e5',
                  borderRadius: 4,
                  background: 'white',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-geist-sans), sans-serif',
                }}
              >
                Cancelar
              </button>
              <button
                style={{
                  padding: '0.4rem 0.9rem',
                  fontSize: '0.75rem',
                  border: 'none',
                  borderRadius: 4,
                  background: '#cc3b3b',
                  color: 'white',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-geist-sans), sans-serif',
                }}
              >
                Confirmar eliminación
              </button>
            </div>
          ) : (
            <button
              onClick={() => setDeleteConfirm(true)}
              style={{
                padding: '0.4rem 0.9rem',
                fontSize: '0.75rem',
                border: '1px solid #e0e3e5',
                borderRadius: 4,
                background: 'white',
                color: '#cc3b3b',
                cursor: 'pointer',
                fontFamily: 'var(--font-geist-sans), sans-serif',
              }}
            >
              Eliminar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
