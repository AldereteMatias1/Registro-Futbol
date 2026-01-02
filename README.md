# Registro Futbol Amigos (Monorepo)

Monorepo con backend NestJS + Prisma y frontend React + Vite.

## Estructura

```
apps/
  backend/   # API NestJS + Prisma
  frontend/  # React + Vite + Tailwind
packages/
  shared/    # (opcional) tipos compartidos
```

## Requisitos

- Node.js 18+
- pnpm 9+
- Postgres

## Variables de entorno

Crear `.env` en la raíz o en cada app usando los ejemplos:

- `.env.example` (root)
- `apps/backend/.env.example`
- `apps/frontend/.env.example`

Backend:

- `DATABASE_URL`
- `ADMIN_USER`
- `ADMIN_PASS`

Frontend:

- `VITE_API_URL` (ej: `http://localhost:3000`)

## Comandos

Instalar dependencias (desde la raíz):

```bash
pnpm install
```

Desarrollo:

```bash
pnpm dev
```

Backend solamente:

```bash
pnpm dev:backend
```

Frontend solamente:

```bash
pnpm dev:frontend
```

Build:

```bash
pnpm build
```

## Migraciones Prisma

Desde `apps/backend`:

```bash
pnpm -C apps/backend prisma:generate
pnpm -C apps/backend prisma:migrate
```

## Endpoints usados por el frontend

- `GET /jugadores`
- `POST /jugadores` (admin)
- `PATCH /jugadores/:id` (admin)
- `DELETE /jugadores/:id` (admin)
- `GET /partidos`
- `GET /partidos/:partidoId/participaciones`
- `GET /partidos/:partidoId/goles`
- `GET /partidos/:partidoId/resultado`
- `GET /stats/jugadores`
- `GET /rankings/goleadores`
- `GET /rankings/asistencia/mensual?year=YYYY&month=MM`
- `GET /rankings/asistencia/anual?year=YYYY`
- `GET /rankings/ganadores`

## Deploy (Railway / Vercel)

Backend (Railway):
1. Crear servicio Node.
2. Setear `DATABASE_URL`, `ADMIN_USER`, `ADMIN_PASS`.
3. Ejecutar migraciones (`pnpm -C apps/backend prisma:migrate`).
4. Exponer puerto `3000`.

Frontend (Railway o Vercel):
1. Setear `VITE_API_URL` apuntando al backend público.
2. Build command: `pnpm -C apps/frontend build`.
3. Output dir: `apps/frontend/dist`.
