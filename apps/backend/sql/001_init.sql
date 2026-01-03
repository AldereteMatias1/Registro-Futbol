-- 001_init.sql

-- 1) UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2) Enums
DO $$ BEGIN
  CREATE TYPE "Equipo" AS ENUM ('A', 'B');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "EstadoParticipacion" AS ENUM ('ANOTADO', 'JUGO', 'BAJA');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "GanadorResultado" AS ENUM ('A', 'B', 'EMPATE');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 3) Tables
CREATE TABLE IF NOT EXISTS "Jugador" (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "apellidoNombre" varchar(80) NOT NULL,
  activo boolean NOT NULL DEFAULT true,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "idx_jugadores_activo" ON "Jugador"(activo);

CREATE TABLE IF NOT EXISTS "Partido" (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  fecha timestamptz NOT NULL,
  cancha varchar(80),
  notas text,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "idx_partidos_fecha" ON "Partido"(fecha);

CREATE TABLE IF NOT EXISTS "Participacion" (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "partidoId" uuid NOT NULL,
  "jugadorId" uuid NOT NULL,
  equipo "Equipo",
  estado "EstadoParticipacion" NOT NULL,
  "motivoBaja" varchar(120),
  comentarios text,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT "fk_participacion_partido"
    FOREIGN KEY ("partidoId") REFERENCES "Partido"(id) ON DELETE CASCADE,
  CONSTRAINT "fk_participacion_jugador"
    FOREIGN KEY ("jugadorId") REFERENCES "Jugador"(id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "uniq_participacion_partido_jugador"
  ON "Participacion"("partidoId", "jugadorId");

CREATE INDEX IF NOT EXISTS "idx_participaciones_partido"
  ON "Participacion"("partidoId");
CREATE INDEX IF NOT EXISTS "idx_participaciones_jugador"
  ON "Participacion"("jugadorId");
CREATE INDEX IF NOT EXISTS "idx_participaciones_estado"
  ON "Participacion"(estado);

CREATE TABLE IF NOT EXISTS "Gol" (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "partidoId" uuid NOT NULL,
  "jugadorId" uuid NOT NULL,
  goles int NOT NULL,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT "fk_gol_partido"
    FOREIGN KEY ("partidoId") REFERENCES "Partido"(id) ON DELETE CASCADE,
  CONSTRAINT "fk_gol_jugador"
    FOREIGN KEY ("jugadorId") REFERENCES "Jugador"(id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "uniq_goles_partido_jugador"
  ON "Gol"("partidoId", "jugadorId");

CREATE INDEX IF NOT EXISTS "idx_goles_partido"
  ON "Gol"("partidoId");
CREATE INDEX IF NOT EXISTS "idx_goles_jugador"
  ON "Gol"("jugadorId");

CREATE TABLE IF NOT EXISTS "Resultado" (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "partidoId" uuid NOT NULL UNIQUE,
  "golesA" int NOT NULL,
  "golesB" int NOT NULL,
  ganador "GanadorResultado" NOT NULL,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT "fk_resultado_partido"
    FOREIGN KEY ("partidoId") REFERENCES "Partido"(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "idx_resultados_partido"
  ON "Resultado"("partidoId");
