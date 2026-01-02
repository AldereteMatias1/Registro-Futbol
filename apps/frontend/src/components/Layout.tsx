import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { getAdminAuth, setAdminAuth } from '../lib/api';

const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/jugadores', label: 'Jugadores' },
  { to: '/partidos', label: 'Partidos' },
  { to: '/estadisticas', label: 'Estadísticas' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [adminAuth, setAuthState] = useState<string | null>(getAdminAuth());
  const [form, setForm] = useState({ user: '', pass: '' });

  const toggleAdmin = () => {
    if (adminAuth) {
      setAdminAuth(null);
      setAuthState(null);
      return;
    }
    const encoded = btoa(`${form.user}:${form.pass}`);
    setAdminAuth(encoded);
    setAuthState(encoded);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <nav className="border-b border-slate-800 bg-slate-900/70">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-4 py-4">
          <div className="text-lg font-semibold">Registro Futbol</div>
          <div className="flex flex-1 flex-wrap gap-2 text-sm">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `rounded px-3 py-1 ${isActive ? 'bg-slate-700 text-white' : 'text-slate-300'}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <input
              type="text"
              placeholder="Admin user"
              value={form.user}
              onChange={(event) => setForm((prev) => ({ ...prev, user: event.target.value }))}
              className="rounded border border-slate-700 bg-slate-800 px-2 py-1 text-slate-100"
              disabled={Boolean(adminAuth)}
            />
            <input
              type="password"
              placeholder="Admin pass"
              value={form.pass}
              onChange={(event) => setForm((prev) => ({ ...prev, pass: event.target.value }))}
              className="rounded border border-slate-700 bg-slate-800 px-2 py-1 text-slate-100"
              disabled={Boolean(adminAuth)}
            />
            <button
              type="button"
              onClick={toggleAdmin}
              className={`rounded px-3 py-1 text-xs font-semibold ${
                adminAuth ? 'bg-emerald-500 text-slate-900' : 'bg-slate-700 text-white'
              }`}
            >
              {adminAuth ? 'Admin activo' : 'Activar admin'}
            </button>
          </div>
        </div>
      </nav>
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
}
