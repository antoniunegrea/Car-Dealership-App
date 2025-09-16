## Carventory

A full‑stack car dealership management platform with authentication, inventory and dealership management, file uploads, admin monitoring, and session tracking. Built with React + TypeScript on the frontend and Node.js (Express) + TypeORM + PostgreSQL on the backend. Supports local and Docker deployments.

### Quick Links
- **Frontend**: `frontend/` (React + TypeScript)
- **Backend**: `backend/` (Express + TypeORM + PostgreSQL)
- **Docker**: root `docker-compose.yml`

### Highlights (Technical Features)
- **JWT authentication**: issue/verify JWTs for stateless auth; role support (`user`, `admin`).
- **Session management**: per‑device session records with inactivity and absolute expiry windows.
- **User monitoring & logging**: actions persisted in `UserLog`/`UserMonitoring` for admin insights.
- **Cars & Dealerships**: CRUD with filtering, sorting, relations (`Dealership` → many `Car`).
- **Offline‑tolerant UI**: queues operations client‑side when server is offline, replays later.
- **Modular services**: typed service layer (`ServiceProvider`) with configurable API base URL.
- **File uploads**: file management endpoints and UI page.
- **Charts & admin pages**: analytics with `recharts`; admin-only monitored users screen.
- **Type-safe**: TypeScript across both frontend and backend.

---

## Table of Contents
- Overview
- Architecture
- Getting Started (Local)
- Getting Started (Docker)
- Environment Variables
- Scripts
- API Overview
- Frontend Overview
- Testing
- Troubleshooting

---

## Overview
The app lets authenticated users manage car inventory and dealerships, while admins can monitor user activity. The frontend communicates with a REST API secured by JWT, and the backend persists data in PostgreSQL via TypeORM.

### What you can do
- Manage cars: create, list, search, sort, edit, delete
- Manage dealerships: create, list, search, sort, edit, delete
- Upload and manage files
- View charts/analytics
- Admin: review monitored users and activity logs

---

## Architecture
- **Backend** (`backend/`)
  - Express server in `src/index.ts`
  - Postgres via TypeORM (`src/config/database.ts`)
  - Entities: `Car`, `Dealership`, `User`, `Session`, `UserLog`, `UserMonitoring`
  - Auth: `AuthController` issues JWT; `authMiddleware` verifies JWT; `roleMiddleware` guards roles
  - Routes: `cars`, `dealerships`, `auth`, `admin`, `files`, `server`, `sessions`
  - Migrations in `src/migrations` (compiled to `dist/migrations`)

- **Frontend** (`frontend/`)
  - React + TypeScript app (`src/App.tsx`, `src/pages`, `src/components`)
  - Services for API access (`src/service/*`) wired via `ServiceProvider`
  - Routing with `react-router-dom`
  - Charts with `recharts`

---

## Getting Started (Local)

### Prerequisites
- Node.js 18+
- PostgreSQL 13+

### 1) Backend setup
```bash
cd backend
npm install
# Configure .env (see Environment Variables)
npm run build
npm run migration:run
npm start
# API default: http://localhost:3000
```

### 2) Frontend setup
```bash
cd frontend
npm install
# Configure .env (see Environment Variables). Default API: http://localhost:3000/api
npm start
# App default: http://localhost:3000 handled by CRA dev server
```

Tip: When running both locally without Docker, set `REACT_APP_API_URL` to `http://localhost:3000/api`.

---

## Getting Started (Docker)
Ensure Docker Desktop is running.

```bash
# at repo root
docker compose up --build
```

Ports
- Frontend: `http://localhost:80`
- Backend API: `http://localhost:3000`

Note: `docker-compose.yml` expects `.env` files in `backend/.env` and `frontend/.env`.

---

## Environment Variables

### Backend (`backend/.env`)
- `DATABASE_URL` (required): Postgres connection string. Example: `postgres://user:pass@localhost:5432/cardb`
- `JWT_SECRET` (required): secret for signing JWTs
- `PORT` (optional): defaults to `3000`
- `SESSION_TIMEOUT` (optional): absolute session expiry in minutes (default 120)
- `INACTIVITY_TIMEOUT` (optional): inactivity timeout in minutes (default 30)

### Frontend (`frontend/.env`)
- `REACT_APP_API_URL`: base API URL (default used in code if missing: `http://localhost:3000/api`)

---

## Scripts

### Backend
- `npm run dev` — start with nodemon (TypeScript source)
- `npm run build` — compile TypeScript to `dist/`
- `npm start` — run compiled server (`dist/index.js`)
- `npm run migration:run` — run TypeORM migrations
- `npm run migration:revert` — revert last migration
- `npm test` | `npm run test:coverage` — Jest tests and coverage

### Frontend
- `npm start` — run CRA dev server
- `npm run build` — production build
- `npm test` — run tests

---

## API Overview
Base URL: `http://localhost:3000/api`

### Auth
- `POST /auth/login` — returns `{ token, user }` (JWT with `id`, `role`)
- `POST /auth/register` — create new user (password hashed with bcrypt)

JWT is required as `Authorization: Bearer <token>` for protected routes. Verification is done in `authMiddleware` using `JWT_SECRET`.

### Sessions
- `POST /sessions` — create a session entry for the current user and device
- `GET /sessions` — list active sessions for the user
- `PATCH /sessions/:id` — update activity/heartbeat
- `DELETE /sessions/:id` — deactivate session

The backend tracks absolute expiry (`SESSION_TIMEOUT`) and inactivity (`INACTIVITY_TIMEOUT`).

### Cars
- `GET /cars` — list with filtering (`searchTerm`), sorting (`sortBy`, `order`)
- `POST /cars` — create
- `GET /cars/:id` — details
- `PUT /cars/:id` — update
- `DELETE /cars/:id` — delete

### Dealerships
- `GET /dealerships` — list with filtering/sorting, includes related `cars`
- `POST /dealerships` — create
- `GET /dealerships/:id` — details
- `PUT /dealerships/:id` — update
- `DELETE /dealerships/:id` — delete

### Files
- `POST /files` — upload
- `GET /files` — list
- `DELETE /files/:id` — delete

### Admin
- `GET /admin/monitored-users` — admin-only monitoring endpoints

Note: Some routes are guarded by role via `roleMiddleware(['admin'])`.

---

## Frontend Overview

### Key Pages
- `/` — Login (`LoginPage`), redirects to `/cars` after auth
- `/register` — Registration (`RegisterPage`)
- `/cars` — Cars list with search/sort, offline banner, CRUD
- `/cars/add`, `/cars/:id/edit` — add/edit car
- `/dealerships` — Dealerships list; add/edit routes accordingly
- `/files` — File manager
- `/charts` — Analytics and charts
- `/admin/monitored-users` — Admin-only monitoring screen

### Important Components & Hooks
- `ServiceProvider` — central registry for API services
- `AuthService`, `CarService`, `DealershipService`, `AdminService`, `FileService`, `SessionService`
- Offline queue via `queuedOperations` in `App.tsx` with localStorage persistence
- `useDebounce` for performant search inputs

### Configuration
- Set `REACT_APP_API_URL` in `.env` to point the app to your backend API

---

## Authentication, JWT & Sessions
- Login issues a JWT: payload includes `id` and `role`; expiry typically `1d`
- Every protected request includes `Authorization: Bearer <token>`
- Backend verifies token in `authMiddleware` (`jsonwebtoken.verify` with `JWT_SECRET`)
- Session records are stored server-side with `token`, `deviceInfo`, `isActive`, timestamps, and expiry
- Admins can inspect monitored users and activity logs

---

## Testing
- Backend: Jest tests (`npm test`) and coverage (`npm run test:coverage`)
- Frontend: CRA testing setup with Testing Library (`npm test`)

---

## Troubleshooting
- 401 Unauthorized: ensure `Authorization: Bearer <token>` is present and `JWT_SECRET` matches backend
- Database errors: confirm `DATABASE_URL` is set and reachable; run migrations
- CORS issues: backend enables CORS for `*`; ensure ports/hosts are correct
- API base URL: set `REACT_APP_API_URL` to your backend (e.g., `http://localhost:3000/api`)
- Docker: verify `.env` files exist in `backend/` and `frontend/` before `docker compose up`

---

## License
This project is for educational purposes. Adapt licensing as needed.
