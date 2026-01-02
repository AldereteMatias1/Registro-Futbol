import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '../lib/api';
import { Partido } from '../lib/types';

export default function PartidosPage() {
  const partidosQuery = useQuery({
    queryKey: ['partidos'],
    queryFn: () => apiFetch<Partido[]>('/partidos'),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Partidos</h1>
        <p className="text-sm text-slate-400">Listado de partidos y acceso a detalles.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(partidosQuery.data ?? []).map((partido) => (
          <Link
            key={partido.id}
            to={`/partidos/${partido.id}`}
            className="rounded-lg border border-slate-800 bg-slate-900 p-4 hover:border-slate-600"
          >
            <div className="text-sm text-slate-400">{new Date(partido.fecha).toLocaleString()}</div>
            <div className="mt-2 text-lg font-semibold">{partido.cancha || 'Sin cancha definida'}</div>
            <div className="mt-1 text-xs text-slate-500">{partido.notas || 'Sin notas'}</div>
          </Link>
        ))}
      </div>
      {partidosQuery.isLoading && <div className="text-sm text-slate-400">Cargando...</div>}
    </div>
  );
}
