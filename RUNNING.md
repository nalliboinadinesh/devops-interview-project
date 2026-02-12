Quick run instructions

Development (local, without Docker)

1. Backend
- Create a `.env` file inside `backend/` (or use root `.env`) using `backend/.env.example` as reference.
- From project root:

```bash
cd backend
npm install
npm run dev
```

This starts the backend on `http://localhost:5000` by default.

Centralized env workflow
- Create a single root `.env` at the repository root (use `.env.example` as reference).
- To propagate the root `.env` into each service for local development, run the sync script from the repo root:

```bash
./scripts/sync-env.sh    # Linux / macOS
.
powershell -File .\scripts\sync-env.ps1   # Windows PowerShell
```

The sync script will copy the root `.env` to `backend/.env`, `admin-app/.env.local`, and `user-app/.env.local`.
Note: React frontends only read `REACT_APP_*` variables at build/start time. If you change `REACT_APP_API_URL`, restart the dev server or rebuild the container.

2. Frontends (Admin and User)
- Create `.env.local` files in `admin-app/` and `user-app/` if needed, or use the `.env.example` files.

Admin app:
```bash
cd admin-app
npm install
npm start
# runs on http://localhost:3001
```

User app:
```bash
cd user-app
npm install
npm start
# runs on http://localhost:3000
```

Production (using Docker Compose)

1. Copy the top-level `.env.example` to `.env.docker` and fill required values (JWT secrets, Mongo connection or use the bundled mongo service).

2. Build and start services:

```bash
docker-compose up --build
```

This will start services:
- backend -> http://localhost:5000
- user-app -> http://localhost:3000
- admin-app -> http://localhost:3001

Notes & Security
- Do NOT commit real credentials. Use `.env` / `.env.docker` which are gitignored.
- In production, ensure `JWT_SECRET` and `JWT_REFRESH_SECRET` are strong, and `CORS_ORIGIN` is restricted to your frontend domains.
- For Docker builds of React apps, you can pass `--build-arg REACT_APP_API_URL=https://api.example.com/api` to set API endpoint at build time.

Troubleshooting
- If Mongo fails to connect in Docker, ensure the `MONGODB_URI` points to the `mongo` service (e.g. `mongodb://mongo:27017/polytechnic-sis`) or provide an external Atlas URI.
- If email OTP sending fails, ensure `EMAIL_USER` and `EMAIL_PASS` are configured (Gmail app password recommended).
