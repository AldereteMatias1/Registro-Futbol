-- 002_views_reporting.sql

CREATE OR REPLACE VIEW v_stats_jugadores AS
SELECT
  j.id AS "jugadorId",
  j."apellidoNombre" AS "apellidoNombre",
  COALESCE(SUM(g.goles), 0)::int AS "golesTotales",
  COUNT(*) FILTER (WHERE p.estado = 'JUGO'::"EstadoParticipacion")::int AS "partidosJugados",
  CASE
    WHEN COUNT(*) FILTER (WHERE p.estado = 'JUGO'::"EstadoParticipacion") = 0 THEN NULL
    ELSE (COALESCE(SUM(g.goles), 0)::decimal
      / COUNT(*) FILTER (WHERE p.estado = 'JUGO'::"EstadoParticipacion"))::double precision
  END AS "promedioGolesPorJuego",
  COUNT(*) FILTER (WHERE p.estado = 'JUGO'::"EstadoParticipacion")::int AS "asistencias",
  COUNT(*) FILTER (WHERE p.estado = 'BAJA'::"EstadoParticipacion")::int AS "bajas",
  COUNT(*) FILTER (WHERE p.estado = 'ANOTADO'::"EstadoParticipacion")::int AS "anotado",
  COUNT(*) FILTER (
    WHERE p.estado = 'JUGO'::"EstadoParticipacion"
      AND (
        (r.ganador = 'A'::"GanadorResultado" AND p.equipo = 'A'::"Equipo")
        OR (r.ganador = 'B'::"GanadorResultado" AND p.equipo = 'B'::"Equipo")
      )
  )::int AS "victorias",
  COUNT(*) FILTER (
    WHERE p.estado = 'JUGO'::"EstadoParticipacion"
      AND r.ganador = 'EMPATE'::"GanadorResultado"
  )::int AS "empates",
  COUNT(*) FILTER (
    WHERE p.estado = 'JUGO'::"EstadoParticipacion"
      AND (
        (r.ganador = 'A'::"GanadorResultado" AND p.equipo = 'B'::"Equipo")
        OR (r.ganador = 'B'::"GanadorResultado" AND p.equipo = 'A'::"Equipo")
      )
  )::int AS "derrotas",
  (
    COUNT(*) FILTER (
      WHERE p.estado = 'JUGO'::"EstadoParticipacion"
        AND (
          (r.ganador = 'A'::"GanadorResultado" AND p.equipo = 'A'::"Equipo")
          OR (r.ganador = 'B'::"GanadorResultado" AND p.equipo = 'B'::"Equipo")
        )
    ) * 3
    + COUNT(*) FILTER (
      WHERE p.estado = 'JUGO'::"EstadoParticipacion"
        AND r.ganador = 'EMPATE'::"GanadorResultado"
    )
  )::int AS "puntos"
FROM "Jugador" j
LEFT JOIN "Participacion" p ON p."jugadorId" = j.id
LEFT JOIN "Gol" g ON g."jugadorId" = j.id AND g."partidoId" = p."partidoId"
LEFT JOIN "Resultado" r ON r."partidoId" = p."partidoId"
GROUP BY j.id, j."apellidoNombre";

CREATE OR REPLACE VIEW v_ranking_goleadores AS
SELECT
  j.id AS "jugadorId",
  j."apellidoNombre" AS "apellidoNombre",
  COALESCE(SUM(g.goles), 0)::int AS "golesTotales",
  COUNT(*) FILTER (WHERE p.estado = 'JUGO'::"EstadoParticipacion")::int AS "partidosJugados",
  CASE
    WHEN COUNT(*) FILTER (WHERE p.estado = 'JUGO'::"EstadoParticipacion") = 0 THEN NULL
    ELSE (COALESCE(SUM(g.goles), 0)::decimal
      / COUNT(*) FILTER (WHERE p.estado = 'JUGO'::"EstadoParticipacion"))::double precision
  END AS "promedioGolesPorJuego"
FROM "Jugador" j
LEFT JOIN "Participacion" p ON p."jugadorId" = j.id
LEFT JOIN "Gol" g ON g."jugadorId" = j.id AND g."partidoId" = p."partidoId"
GROUP BY j.id, j."apellidoNombre";

CREATE OR REPLACE VIEW v_ranking_ganadores AS
SELECT
  "jugadorId",
  "apellidoNombre",
  "victorias",
  "empates",
  "derrotas",
  "puntos"
FROM v_stats_jugadores;
