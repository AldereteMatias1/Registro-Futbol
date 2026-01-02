import { useQuery } from '@tanstack/react-query';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { apiFetch } from '../lib/api';
import { Jugador, Partido, RankingGoleador, RankingGanador, RankingAsistencia, StatsJugador } from '../lib/types';

export default function DashboardPage() {
  const jugadoresQuery = useQuery({
    queryKey: ['jugadores-activos'],
    queryFn: () => apiFetch<Jugador[]>('/jugadores?activo=true'),
  });

  const partidosQuery = useQuery({
    queryKey: ['partidos'],
    queryFn: () => apiFetch<Partido[]>('/partidos'),
  });

  const statsQuery = useQuery({
    queryKey: ['stats'],
    queryFn: () => apiFetch<StatsJugador[]>('/stats/jugadores'),
  });

  const goleadoresQuery = useQuery({
    queryKey: ['rankings-goleadores'],
    queryFn: () => apiFetch<RankingGoleador[]>('/rankings/goleadores'),
  });

  const ganadoresQuery = useQuery({
    queryKey: ['rankings-ganadores'],
    queryFn: () => apiFetch<RankingGanador[]>('/rankings/ganadores'),
  });

  const asistenciaQuery = useQuery({
    queryKey: ['rankings-asistencia-mensual'],
    queryFn: () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      return apiFetch<RankingAsistencia[]>(`/rankings/asistencia/mensual?year=${year}&month=${month}`);
    },
  });

  const golesTotales = statsQuery.data?.reduce((acc, item) => acc + Number(item.golesTotales), 0) ?? 0;
  const asistenciasTotales = statsQuery.data?.reduce((acc, item) => acc + Number(item.asistencias), 0) ?? 0;

  return (
    <div className="space-y-8">
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Jugadores activos"
          value={jugadoresQuery.data?.length ?? 0}
          loading={jugadoresQuery.isLoading}
        />
        <MetricCard title="Partidos jugados" value={partidosQuery.data?.length ?? 0} loading={partidosQuery.isLoading} />
        <MetricCard title="Goles totales" value={golesTotales} loading={statsQuery.isLoading} />
        <MetricCard title="Asistencias totales" value={asistenciasTotales} loading={statsQuery.isLoading} />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Ranking goleadores">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={goleadoresQuery.data ?? []} margin={{ left: 16, right: 16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="apellidoNombre" tick={{ fill: '#cbd5f5', fontSize: 10 }} interval={0} angle={-20} height={60} />
              <YAxis tick={{ fill: '#cbd5f5', fontSize: 10 }} />
              <Tooltip />
              <Bar dataKey="golesTotales" fill="#38bdf8" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Asistencias del mes">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={asistenciaQuery.data ?? []} margin={{ left: 16, right: 16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="apellidoNombre" tick={{ fill: '#cbd5f5', fontSize: 10 }} interval={0} angle={-20} height={60} />
              <YAxis tick={{ fill: '#cbd5f5', fontSize: 10 }} />
              <Tooltip />
              <Bar dataKey="asistenciasMes" fill="#a78bfa" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Ranking ganadores">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={ganadoresQuery.data ?? []} margin={{ left: 16, right: 16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="apellidoNombre" tick={{ fill: '#cbd5f5', fontSize: 10 }} interval={0} angle={-20} height={60} />
              <YAxis tick={{ fill: '#cbd5f5', fontSize: 10 }} />
              <Tooltip />
              <Bar dataKey="puntos" fill="#34d399" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </section>
    </div>
  );
}

function MetricCard({ title, value, loading }: { title: string; value: number; loading?: boolean }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
      <div className="text-xs uppercase tracking-wide text-slate-400">{title}</div>
      <div className="mt-2 text-2xl font-semibold">{loading ? '...' : value}</div>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
      <div className="mb-2 text-sm font-semibold text-slate-200">{title}</div>
      {children}
    </div>
  );
}
