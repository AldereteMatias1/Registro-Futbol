export type Jugador = {
  id: string;
  apellidoNombre: string;
  activo: boolean;
};

export type Partido = {
  id: string;
  fecha: string;
  cancha?: string | null;
  notas?: string | null;
};

export type Participacion = {
  id: string;
  partidoId: string;
  jugadorId: string;
  equipo?: 'A' | 'B' | null;
  estado: 'ANOTADO' | 'JUGO' | 'BAJA';
  motivoBaja?: string | null;
  comentarios?: string | null;
};

export type Gol = {
  id: string;
  partidoId: string;
  jugadorId: string;
  goles: number;
};

export type Resultado = {
  id: string;
  partidoId: string;
  golesA: number;
  golesB: number;
  ganador: 'A' | 'B' | 'EMPATE';
};

export type StatsJugador = {
  jugadorId: string;
  apellidoNombre: string;
  golesTotales: number;
  partidosJugados: number;
  promedioGolesPorJuego: number | null;
  asistencias: number;
  bajas: number;
  anotado: number;
  victorias: number;
  empates: number;
  derrotas: number;
  puntos: number;
};

export type RankingGoleador = {
  jugadorId: string;
  apellidoNombre: string;
  golesTotales: number;
  partidosJugados: number;
  promedioGolesPorJuego: number | null;
};

export type RankingAsistencia = {
  jugadorId: string;
  apellidoNombre: string;
  asistenciasMes?: number;
  asistenciasAnio?: number;
};

export type RankingGanador = {
  jugadorId: string;
  apellidoNombre: string;
  victorias: number;
  empates: number;
  derrotas: number;
  puntos: number;
};
