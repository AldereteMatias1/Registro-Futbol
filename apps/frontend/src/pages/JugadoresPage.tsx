import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch, getAdminAuth } from '../lib/api';
import { Jugador } from '../lib/types';

export default function JugadoresPage() {
  const [search, setSearch] = useState('');
  const [nuevo, setNuevo] = useState('');
  const auth = getAdminAuth();
  const queryClient = useQueryClient();

  const jugadoresQuery = useQuery({
    queryKey: ['jugadores'],
    queryFn: () => apiFetch<Jugador[]>('/jugadores'),
  });

  const createMutation = useMutation({
    mutationFn: (apellidoNombre: string) =>
      apiFetch<Jugador>('/jugadores', {
        method: 'POST',
        body: { apellidoNombre },
        auth,
      }),
    onSuccess: () => {
      setNuevo('');
      queryClient.invalidateQueries({ queryKey: ['jugadores'] });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: (jugador: Jugador) =>
      apiFetch<Jugador>(`/jugadores/${jugador.id}`, {
        method: 'PATCH',
        body: { activo: !jugador.activo },
        auth,
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['jugadores'] }),
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) =>
      apiFetch(`/jugadores/${id}`, {
        method: 'DELETE',
        auth,
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['jugadores'] }),
  });

  const filtered = useMemo(() => {
    if (!jugadoresQuery.data) {
      return [];
    }
    return jugadoresQuery.data.filter((jugador) =>
      jugador.apellidoNombre.toLowerCase().includes(search.toLowerCase()),
    );
  }, [jugadoresQuery.data, search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold">Jugadores</h1>
          <p className="text-sm text-slate-400">Búsqueda y gestión de jugadores registrados.</p>
        </div>
        <input
          type="search"
          placeholder="Buscar..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="w-full rounded border border-slate-700 bg-slate-800 px-3 py-2 text-sm sm:max-w-xs"
        />
      </div>

      {auth && (
        <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <input
              type="text"
              placeholder="Apellido y nombre"
              value={nuevo}
              onChange={(event) => setNuevo(event.target.value)}
              className="flex-1 rounded border border-slate-700 bg-slate-800 px-3 py-2 text-sm"
            />
            <button
              type="button"
              onClick={() => createMutation.mutate(nuevo)}
              disabled={!nuevo || createMutation.isPending}
              className="rounded bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-900 disabled:opacity-50"
            >
              Agregar jugador
            </button>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-lg border border-slate-800">
        <table className="w-full text-sm">
          <thead className="bg-slate-900 text-left text-xs uppercase text-slate-400">
            <tr>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((jugador) => (
              <tr key={jugador.id} className="border-t border-slate-800">
                <td className="px-4 py-3 font-medium text-slate-100">{jugador.apellidoNombre}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded px-2 py-1 text-xs ${
                      jugador.activo ? 'bg-emerald-500/20 text-emerald-200' : 'bg-rose-500/20 text-rose-200'
                    }`}
                  >
                    {jugador.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  {auth ? (
                    <div className="flex flex-wrap justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => toggleMutation.mutate(jugador)}
                        className="rounded border border-slate-700 px-3 py-1 text-xs"
                      >
                        {jugador.activo ? 'Desactivar' : 'Activar'}
                      </button>
                      <button
                        type="button"
                        onClick={() => removeMutation.mutate(jugador.id)}
                        className="rounded border border-rose-500 px-3 py-1 text-xs text-rose-300"
                      >
                        Borrar
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-500">Solo lectura</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {jugadoresQuery.isLoading && <div className="p-4 text-sm text-slate-400">Cargando...</div>}
      </div>
    </div>
  );
}
