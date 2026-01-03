# Registro Futbol Amigos (Monorepo)

Monorepo con backend NestJS + SQL (pg) y frontend React + Vite.

## Estructura

```
apps/
  backend/   # API NestJS + SQL
  frontend/  # React + Vite + Tailwind
packages/
  shared/    # (opcional) tipos compartidos
```

## Requisitos

- Node.js 18+
- npm 9+
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
npm install
```

Desarrollo:

```bash
npm run dev
```

Backend solamente:

```bash
npm run dev:backend
```

Frontend solamente:

```bash
npm run dev:frontend
```

Build:

```bash
npm run build
```

## Migraciones (SQL puro)

El backend no usa Prisma. La base se crea/actualiza con scripts SQL.

### Requisitos

- `DATABASE_URL` apuntando a Postgres (Neon/Render/etc.)

### Ejecutar migraciones en local

```bash
cd apps/backend
npm run db:migrate
```

Estructura SQL

`apps/backend/sql/001_init.sql` crea enums, tablas, índices.

`apps/backend/sql/002_views_reporting.sql` crea vistas para rankings/stats.

## Deploy Backend (Render)

- Root Directory: `apps/backend`
- Build command: `npm install && npm run build && npm run db:migrate`
- Start command: `npm run start`
- Env vars: `DATABASE_URL`, `ADMIN_USER`, `ADMIN_PASS`

## Deploy Frontend (Vercel)

- Root Directory: `apps/frontend`
- Env var: `VITE_API_URL=https://registro-futbol.onrender.com`

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
