'use client';

import { useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ShieldCheck,
  ShieldOff,
  UserCheck,
  UserX,
  BadgeCheck,
  BadgeX,
  Mail,
  Clock,
  KeyRound,
} from 'lucide-react';
import {
  User,
  getFullName,
  getInitials,
  getRoleLabel,
  getAppLabel,
  groupPermissionsByApp,
} from '@/lib/users';

const dateFormatter = new Intl.DateTimeFormat('es-DO', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

function formatDate(value: string | null): string {
  if (!value) return 'Nunca';
  try {
    return dateFormatter.format(new Date(value));
  } catch {
    return 'Nunca';
  }
}

type UserDetailsClientProps = {
  initialUser: User;
};

export default function UserDetailsClient({ initialUser }: UserDetailsClientProps) {
  const [user, setUser] = useState<User>(initialUser);
  const [updatingField, setUpdatingField] = useState<'is_active' | 'institution_member' | null>(
    null
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const permissionGroups = useMemo(
    () => groupPermissionsByApp(user.permissions),
    [user.permissions]
  );

  const updateUser = useCallback(
    async (field: 'is_active' | 'institution_member', value: boolean) => {
      setUpdatingField(field);
      setErrorMessage(null);

      try {
        const response = await fetch(`/api/v1/users/${user.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ [field]: value }),
        });

        const json = await response.json();

        if (!response.ok || !json.success) {
          throw new Error(json.message || 'No se pudo actualizar el usuario.');
        }

        setUser(json.data);
      } catch (err) {
        setErrorMessage(err instanceof Error ? err.message : 'No se pudo actualizar el usuario.');
      } finally {
        setUpdatingField(null);
      }
    },
    [user.id]
  );

  const toggleActive = useCallback(() => {
    updateUser('is_active', !user.is_active);
  }, [updateUser, user.is_active]);

  const toggleMember = useCallback(() => {
    updateUser('institution_member', !user.institutionMember);
  }, [updateUser, user.institutionMember]);

  return (
    <div className="flex flex-col h-full bg-[#f7f9fb]">
      <header className="flex items-center justify-between px-8 py-6 bg-white border-b border-[#e0e3e5]">
        <div>
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#747781] hover:text-[#002d62] transition-colors mb-2"
          >
            <ArrowLeft className="size-3.5" /> Volver a Panel admin
          </Link>
          <h1 className="text-2xl font-serif font-bold text-[#00193c] tracking-tight">
            {getFullName(user)}
          </h1>
          <p className="text-[13px] font-sans text-[#747781] mt-1">
            Detalles de la cuenta, estado y permisos asignados.
          </p>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto custom-scrollbar px-8 py-6">
        {errorMessage && (
          <div className="mb-6 px-4 py-3 rounded-md bg-[#ffdad6] border border-[#ffb4ab] text-[#93000a] text-[13px] font-medium">
            {errorMessage}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile card */}
          <section className="lg:col-span-1 bg-white border border-[#e0e3e5] rounded-lg p-6">
            <div className="flex flex-col items-center text-center">
              <div className="size-20 rounded-full bg-[#002d62] text-white flex items-center justify-center text-2xl font-serif font-bold">
                {getInitials(user)}
              </div>
              <h2 className="mt-4 text-[16px] font-bold text-[#191c1e]">{getFullName(user)}</h2>
              <span className="mt-1 text-[12px] font-medium text-[#43474f] bg-[#f2f4f6] px-2.5 py-1 rounded-md border border-[#e0e3e5]">
                {getRoleLabel(user.role)}
              </span>

              <div className="w-full mt-6 pt-6 border-t border-[#e0e3e5] space-y-3 text-left">
                <div className="flex items-center gap-2.5 text-[13px] text-[#43474f]">
                  <Mail className="size-4 text-[#747781] shrink-0" />
                  <span className="truncate">{user.email}</span>
                </div>
                <div className="flex items-center gap-2.5 text-[13px] text-[#43474f]">
                  <Clock className="size-4 text-[#747781] shrink-0" />
                  <span>Últ. acceso: {formatDate(user.lastLoggedIn)}</span>
                </div>
                <div className="flex items-center gap-2.5 text-[13px] text-[#43474f]">
                  <KeyRound className="size-4 text-[#747781] shrink-0" />
                  <span>ID de cuenta: #{user.id}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Account controls + permissions */}
          <section className="lg:col-span-2 flex flex-col gap-6">
            <div className="bg-white border border-[#e0e3e5] rounded-lg p-6">
              <h3 className="text-[14px] font-bold text-[#191c1e] mb-4">Estado de la Cuenta</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* is_active toggle */}
                <div className="flex items-center justify-between gap-3 px-4 py-3.5 rounded-md border border-[#e0e3e5] bg-[#f8fafd]">
                  <div className="flex items-center gap-3">
                    <div
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${
                        user.is_active
                          ? 'bg-[#e6f4ea] text-[#137333] border-[#ceead6]'
                          : 'bg-[#ffdad6] text-[#93000a] border-[#ffb4ab]'
                      }`}
                    >
                      <span
                        className={`size-1.5 rounded-full ${
                          user.is_active ? 'bg-[#1e8e3e]' : 'bg-[#ba1a1a]'
                        }`}
                        aria-hidden="true"
                      />
                      <span className="text-[11px] font-bold uppercase tracking-wider">
                        {user.is_active ? 'Activa' : 'Inactiva'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={toggleActive}
                    disabled={updatingField === 'is_active'}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#002d62] disabled:opacity-50 disabled:pointer-events-none ${
                      user.is_active
                        ? 'border border-[#c4c6d1] text-[#43474f] hover:bg-[#f2f4f6]'
                        : 'bg-[#002d62] text-white hover:bg-[#00193c]'
                    }`}
                  >
                    {user.is_active ? (
                      <>
                        <ShieldOff className="size-3.5" />
                        {updatingField === 'is_active' ? 'Desactivando...' : 'Desactivar'}
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="size-3.5" />
                        {updatingField === 'is_active' ? 'Activando...' : 'Activar'}
                      </>
                    )}
                  </button>
                </div>

                {/* institutionMember toggle */}
                <div className="flex items-center justify-between gap-3 px-4 py-3.5 rounded-md border border-[#e0e3e5] bg-[#f8fafd]">
                  <div className="flex items-center gap-3">
                    <div
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${
                        user.institutionMember
                          ? 'bg-[#e6f4ea] text-[#137333] border-[#ceead6]'
                          : 'bg-[#f2f4f6] text-[#747781] border-[#e0e3e5]'
                      }`}
                    >
                      <span
                        className={`size-1.5 rounded-full ${
                          user.institutionMember ? 'bg-[#1e8e3e]' : 'bg-[#c4c6d1]'
                        }`}
                        aria-hidden="true"
                      />
                      <span className="text-[11px] font-bold uppercase tracking-wider">
                        {user.institutionMember ? 'Miembro' : 'No Miembro'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={toggleMember}
                    disabled={updatingField === 'institution_member'}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#002d62] disabled:opacity-50 disabled:pointer-events-none ${
                      user.institutionMember
                        ? 'border border-[#c4c6d1] text-[#43474f] hover:bg-[#f2f4f6]'
                        : 'bg-[#002d62] text-white hover:bg-[#00193c]'
                    }`}
                  >
                    {user.institutionMember ? (
                      <>
                        <BadgeX className="size-3.5" />
                        {updatingField === 'institution_member'
                          ? 'Quitando...'
                          : 'Quitar Membresía'}
                      </>
                    ) : (
                      <>
                        <BadgeCheck className="size-3.5" />
                        {updatingField === 'institution_member'
                          ? 'Asignando...'
                          : 'Asignar Membresía'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#e0e3e5] rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[14px] font-bold text-[#191c1e]">Permisos Asignados</h3>
                <span className="text-[12px] font-medium text-[#747781]">
                  {user.permissions.length} en total
                </span>
              </div>

              {user.permissions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-[#747781]">
                  <UserX className="size-8 mb-2 text-[#c4c6d1]" />
                  <p className="text-[13px] font-medium">Esta cuenta no tiene permisos asignados</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(permissionGroups).map(([app, permissions]) => (
                    <div key={app} className="border border-[#e0e3e5] rounded-md overflow-hidden">
                      <div className="flex items-center gap-2 px-4 py-2.5 bg-[#f8fafd] border-b border-[#e0e3e5]">
                        <UserCheck className="size-3.5 text-[#747781]" />
                        <span className="text-[12px] font-bold text-[#43474f] uppercase tracking-wider">
                          {getAppLabel(app)}
                        </span>
                        <span className="text-[11px] font-medium text-[#747781]">
                          ({permissions.length})
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 p-4">
                        {permissions.map(permission => (
                          <span
                            key={permission}
                            className="text-[11px] font-mono font-medium text-[#43474f] bg-[#f2f4f6] px-2 py-1 rounded border border-[#e0e3e5]"
                          >
                            {permission}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
