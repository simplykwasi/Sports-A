# Sports A Backend

This backend supports the Sports A frontend by providing:
- Data ingestion and normalization for leagues, teams, players, and fixtures
- Market data storage and bookmaker odds versioning
- Predictions storage, confidence analytics, and value bet detection
- Live-match event ingestion and probability recalculation via WebSockets
- JWT-authenticated APIs optimized with Redis caching

## Architecture

- `src/app.js` - Express application and route registration
- `src/server.js` - HTTP server with WebSocket support for live analytics
- `src/db/client.js` - PostgreSQL database access via `pg`
- `src/db/supabase.client.js` - Optional Supabase client for additional API access
- `src/routes/` - API route definitions
- `src/controllers/` - Controller logic for each endpoint
- `src/services/` - Core services for ingestion, modeling, live analytics, caching, and auth
- `src/utils/` - Normalization and modeling helpers
- `db/migrations/001_init.sql` - PostgreSQL schema for Supabase

## Critical Backend Pillars

1. **Data Ingestion**: `services/ingestion.service.js` pulls from `SPORTS_API_BASE`, normalizes aliases, and computes features like xG, strength, and weighted form.
2. **Advanced Modeling**: `services/value.service.js` derives fair odds from a Poisson distribution and flags value bets when bookmaker-implied probabilities differ by > 5%.
3. **Real-Time Live Processing**: `services/live.service.js` ingests live updates and dynamically adjusts win/draw/loss probabilities.
4. **Business Logic**: Controllers and cache middleware expose secure endpoints for `/dashboard`, `/value-bets`, and `/live-analysis`.

## Getting Started

1. Copy `.env.example` to `.env` and configure Supabase, Redis, and API credentials.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run migrations:
   ```bash
   npm run migrate
   ```
4. Start the backend:
   ```bash
   npm run dev
   ```

## Key Endpoints

- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/dashboard`
- `GET /api/value-bets`
- `GET /api/predictions`
- `GET /api/live-analysis/:fixtureId`
- WebSocket: `ws://localhost:4000/live-ws`
