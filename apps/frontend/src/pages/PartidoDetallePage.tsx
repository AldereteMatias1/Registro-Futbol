import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '../lib/api';
import { Gol, Jugador, Partido, Participacion, Resultado } from '../lib/types';

export default function PartidoDetallePage() {
  const { id } = useParams();

  const partidosQuery = useQuery({
    queryKey: ['partidos'],
    queryFn: () => apiFetch<Partido[]>('/partidos'),
  });

  const jugadoresQuery = useQuery({
    queryKey: ['jugadores'],
    queryFn: () => apiFetch<Jugador[]>('/jugadores'),
  });

  const participacionesQuery = useQuery({
    queryKey: ['participaciones', id],
    queryFn: () => apiFetch<Participacion[]>(`/partidos/${id}/participaciones`),
    enabled: Boolean(id),
  });

  const golesQuery = useQuery({
    queryKey: ['goles', id],
    queryFn: () => apiFetch<Gol[]>(`/partidos/${id}/goles`),
    enabled: Boolean(id),
  });

  const resultadoQuery = useQuery({
    queryKey: ['resultado', id],
    queryFn: () => apiFetch<Resultado | null>(`/partidos/${id}/resultado`),
    enabled: Boolean(id),
  });

  const partido = partidosQuery.data?.find((item) => item.id === id);

  const nombreJugador = useMemo(() => {
    const map = new Map<string, string>();
    jugadoresQuery.data?.forEach((jugador) => map.set(jugador.id, jugador.apellidoNombre));
    return (jugadorId: string) => map.get(jugadorId) ?? 'Desconocido';
  }, [jugadoresQuery.data]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Detalle del partido</h1>
        {partido && (
          <p className="text-sm text-slate-400">
            {new Date(partido.fecha).toLocaleString()} · {partido.cancha || 'Sin cancha'}
          </p>
        )}
      </div>

      <section className="grid gap-4 lg:grid-cols-2">
        <InfoCard title="Participaciones">
          <ul className="space-y-2 text-sm">
            {(participacionesQuery.data ?? []).map((item) => (
              <li key={item.id} className="flex justify-between border-b border-slate-800 pb-2">
                <span>{nombreJugador(item.jugadorId)}</span>
                <span className="text-slate-400">{item.estado} {item.equipo ? `(${item.equipo})` : ''}</span>
              </li>
            ))}
          </ul>
        </InfoCard>
        <InfoCard title="Goles">
          <ul className="space-y-2 text-sm">
            {(golesQuery.data ?? []).map((item) => (
              <li key={item.id} className="flex justify-between border-b border-slate-800 pb-2">
                <span>{nombreJugador(item.jugadorId)}</span>
                <span className="text-slate-400">{item.goles} goles</span>
              </li>
            ))}
          </ul>
        </InfoCard>
      </section>

      <InfoCard title="Resultado">
        {resultadoQuery.data ? (
          <div className="text-sm">
            <div>Goles A: {resultadoQuery.data.golesA}</div>
            <div>Goles B: {resultadoQuery.data.golesB}</div>
            <div className="mt-2 font-semibold">Ganador: {resultadoQuery.data.ganador}</div>
          </div>
        ) : (
          <div className="text-sm text-slate-400">Sin resultado registrado.</div>
        )}
      </InfoCard>
    </div>
  );
}

function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
      <div className="mb-3 text-sm font-semibold text-slate-200">{title}</div>
      {children}
    </div>
  );
}
