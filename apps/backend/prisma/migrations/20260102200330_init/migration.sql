-- CreateEnum
CREATE TYPE "Equipo" AS ENUM ('A', 'B');

-- CreateEnum
CREATE TYPE "EstadoParticipacion" AS ENUM ('ANOTADO', 'JUGO', 'BAJA');

-- CreateEnum
CREATE TYPE "GanadorResultado" AS ENUM ('A', 'B', 'EMPATE');

-- CreateTable
CREATE TABLE "Jugador" (
    "id" UUID NOT NULL,
    "apellidoNombre" VARCHAR(80) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "Jugador_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Partido" (
    "id" UUID NOT NULL,
    "fecha" TIMESTAMPTZ(6) NOT NULL,
    "cancha" VARCHAR(80),
    "notas" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "Partido_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Participacion" (
    "id" UUID NOT NULL,
    "partidoId" UUID NOT NULL,
    "jugadorId" UUID NOT NULL,
    "equipo" "Equipo",
    "estado" "EstadoParticipacion" NOT NULL,
    "motivoBaja" VARCHAR(120),
    "comentarios" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "Participacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Gol" (
    "id" UUID NOT NULL,
    "partidoId" UUID NOT NULL,
    "jugadorId" UUID NOT NULL,
    "goles" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "Gol_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Resultado" (
    "id" UUID NOT NULL,
    "partidoId" UUID NOT NULL,
    "golesA" INTEGER NOT NULL,
    "golesB" INTEGER NOT NULL,
    "ganador" "GanadorResultado" NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "Resultado_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_jugadores_activo" ON "Jugador"("activo");

-- CreateIndex
CREATE INDEX "idx_partidos_fecha" ON "Partido"("fecha");

-- CreateIndex
CREATE INDEX "idx_participaciones_partido" ON "Participacion"("partidoId");

-- CreateIndex
CREATE INDEX "idx_participaciones_jugador" ON "Participacion"("jugadorId");

-- CreateIndex
CREATE INDEX "idx_participaciones_estado" ON "Participacion"("estado");

-- CreateIndex
CREATE UNIQUE INDEX "uniq_participacion_partido_jugador" ON "Participacion"("partidoId", "jugadorId");

-- CreateIndex
CREATE INDEX "idx_goles_partido" ON "Gol"("partidoId");

-- CreateIndex
CREATE INDEX "idx_goles_jugador" ON "Gol"("jugadorId");

-- CreateIndex
CREATE UNIQUE INDEX "uniq_goles_partido_jugador" ON "Gol"("partidoId", "jugadorId");

-- CreateIndex
CREATE UNIQUE INDEX "Resultado_partidoId_key" ON "Resultado"("partidoId");

-- CreateIndex
CREATE INDEX "idx_resultados_partido" ON "Resultado"("partidoId");

-- AddForeignKey
ALTER TABLE "Participacion" ADD CONSTRAINT "Participacion_jugadorId_fkey" FOREIGN KEY ("jugadorId") REFERENCES "Jugador"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participacion" ADD CONSTRAINT "Participacion_partidoId_fkey" FOREIGN KEY ("partidoId") REFERENCES "Partido"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gol" ADD CONSTRAINT "Gol_jugadorId_fkey" FOREIGN KEY ("jugadorId") REFERENCES "Jugador"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gol" ADD CONSTRAINT "Gol_partidoId_fkey" FOREIGN KEY ("partidoId") REFERENCES "Partido"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resultado" ADD CONSTRAINT "Resultado_partidoId_fkey" FOREIGN KEY ("partidoId") REFERENCES "Partido"("id") ON DELETE CASCADE ON UPDATE CASCADE;
