import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { apiFetch } from '../lib/api';
import { RankingAsistencia, RankingGanador, RankingGoleador, StatsJugador } from '../lib/types';

export default function EstadisticasPage() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);

  const statsQuery = useQuery({
    queryKey: ['stats-jugadores'],
    queryFn: () => apiFetch<StatsJugador[]>('/stats/jugadores'),
  });

  const goleadoresQuery = useQuery({
    queryKey: ['rankings-goleadores'],
    queryFn: () => apiFetch<RankingGoleador[]>('/rankings/goleadores'),
  });

  const asistenciaMensualQuery = useQuery({
    queryKey: ['rankings-asistencia-mensual', year, month],
    queryFn: () => apiFetch<RankingAsistencia[]>(`/rankings/asistencia/mensual?year=${year}&month=${month}`),
  });

  const asistenciaAnualQuery = useQuery({
    queryKey: ['rankings-asistencia-anual', year],
    queryFn: () => apiFetch<RankingAsistencia[]>(`/rankings/asistencia/anual?year=${year}`),
  });

  const ganadoresQuery = useQuery({
    queryKey: ['rankings-ganadores'],
    queryFn: () => apiFetch<RankingGanador[]>('/rankings/ganadores'),
  });

  const promedioData = useMemo(() => {
    return (statsQuery.data ?? []).map((item) => ({
      apellidoNombre: item.apellidoNombre,
      promedio: item.promedioGolesPorJuego ?? 0,
    }));
  }, [statsQuery.data]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold">Estadísticas</h1>
        <p className="text-sm text-slate-400">Promedios, rankings y asistencia por período.</p>
      </div>

      <section className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Promedio de goles por jugador">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={promedioData} margin={{ left: 16, right: 16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="apellidoNombre" tick={{ fill: '#cbd5f5', fontSize: 10 }} interval={0} angle={-20} height={60} />
              <YAxis tick={{ fill: '#cbd5f5', fontSize: 10 }} />
              <Tooltip />
              <Line type="monotone" dataKey="promedio" stroke="#f472b6" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
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
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Asistencia mensual">
          <div className="mb-4 flex flex-wrap gap-2 text-xs">
            <input
              type="number"
              value={year}
              onChange={(event) => setYear(Number(event.target.value))}
              className="w-24 rounded border border-slate-700 bg-slate-800 px-2 py-1"
            />
            <input
              type="number"
              value={month}
              min={1}
              max={12}
              onChange={(event) => setMonth(Number(event.target.value))}
              className="w-20 rounded border border-slate-700 bg-slate-800 px-2 py-1"
            />
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={asistenciaMensualQuery.data ?? []} margin={{ left: 16, right: 16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="apellidoNombre" tick={{ fill: '#cbd5f5', fontSize: 10 }} interval={0} angle={-20} height={60} />
              <YAxis tick={{ fill: '#cbd5f5', fontSize: 10 }} />
              <Tooltip />
              <Bar dataKey="asistenciasMes" fill="#a78bfa" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Asistencia anual">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={asistenciaAnualQuery.data ?? []} margin={{ left: 16, right: 16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="apellidoNombre" tick={{ fill: '#cbd5f5', fontSize: 10 }} interval={0} angle={-20} height={60} />
              <YAxis tick={{ fill: '#cbd5f5', fontSize: 10 }} />
              <Tooltip />
              <Bar dataKey="asistenciasAnio" fill="#34d399" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </section>

      <ChartCard title="Ranking ganadores">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={ganadoresQuery.data ?? []} margin={{ left: 16, right: 16 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey="apellidoNombre" tick={{ fill: '#cbd5f5', fontSize: 10 }} interval={0} angle={-20} height={60} />
            <YAxis tick={{ fill: '#cbd5f5', fontSize: 10 }} />
            <Tooltip />
            <Bar dataKey="puntos" fill="#f59e0b" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <section className="rounded-lg border border-slate-800 bg-slate-900 p-4">
        <div className="mb-3 text-sm font-semibold text-slate-200">Tabla de promedios</div>
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase text-slate-400">
              <tr>
                <th className="px-3 py-2">Jugador</th>
                <th className="px-3 py-2">Promedio</th>
                <th className="px-3 py-2">Goles</th>
                <th className="px-3 py-2">Partidos</th>
              </tr>
            </thead>
            <tbody>
              {(statsQuery.data ?? []).map((item) => (
                <tr key={item.jugadorId} className="border-t border-slate-800">
                  <td className="px-3 py-2">{item.apellidoNombre}</td>
                  <td className="px-3 py-2">{item.promedioGolesPorJuego ?? 0}</td>
                  <td className="px-3 py-2">{item.golesTotales}</td>
                  <td className="px-3 py-2">{item.partidosJugados}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
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
