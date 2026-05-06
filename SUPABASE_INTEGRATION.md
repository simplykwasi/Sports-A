# Supabase Frontend Integration Guide

This document explains the complete Supabase backend integration for the Sports A React frontend.

## Architecture Overview

### Core Components

1. **Supabase Client** (`src/lib/supabaseClient.js`)
   - Initializes Supabase connection
   - Provides global error wrapper with timeout handling
   - Auth state listener

2. **API Service Layer** (`src/services/api.service.js`)
   - Handles backend API calls via `fetchWithAuth()` (JWT-attached)
   - Supabase query helpers for direct database reads
   - Organized into logical groups: `authAPI`, `analyticsAPI`, `liveAPI`, `supabaseQueries`

3. **Auth Context** (`src/context/AuthContext.jsx`)
   - Supabase-based authentication
   - Session persistence
   - Post-registration profile creation
   - Provides: `login()`, `register()`, `logout()`

4. **Custom Hooks**
   - `useSportsData()`: Fetch and cache leagues/teams/fixtures with value bet detection
   - `useRealtimeSubscription()`: Monitor table changes via WebSockets
   - `useliveLiveMatchUpdates()`: Real-time live event streaming
   - `usePredictionUpdates()`: Track odds and prediction changes

5. **Protected Routes** (`src/components/ProtectedRoute.jsx`)
   - Redirects unauthorized users to landing page
   - Checks `currentUser` from auth context

6. **Error Handling & UI**
   - `ErrorBoundary`: Catches React errors and displays fallback UI
   - `LoadingSkeletons`: Smooth loading states during data fetching

## Environment Setup

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=https://sijynfgkrcnhgmaqdcav.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpanluZmdrcmNuaGdtYXFkY2F2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwMTUwMDcsImV4cCI6MjA5MzU5MTAwN30.BUb1FNtJARVAOVQMDo479KFtlbNcf5-EZe7f3XYWOxI
VITE_API_URL=http://localhost:4000/api
VITE_APP_ENV=development
```

## Authentication Flow

### Registration

```javascript
import { useAuth } from '../hooks/useAuth';

const { register } = useAuth();
const result = await register(email, password, displayName);

if (result.ok) {
  // User created, profile auto-initialized
  navigate('/dashboard');
}
```

- Calls `supabase.auth.signUp()`
- Automatically creates a profile in the `profiles` table
- Session is persisted via Supabase localStorage

### Login

```javascript
const { login } = useAuth();
const result = await login(email, password);

if (result.ok) {
  navigate('/dashboard');
}
```

- Calls `supabase.auth.signInWithPassword()`
- Session is automatically managed

### Protected Routes

```jsx
<Route
  element={
    <ProtectedRoute>
      <AppLayout />
    </ProtectedRoute>
  }
>
  <Route path="/dashboard" element={<DashboardPage />} />
  {/* other protected routes */}
</Route>
```

Unauthorized users are redirected to `/` automatically.

## Data Fetching Patterns

### Using Custom Hooks

```javascript
import { useSportsData } from '../hooks/useSportsData';

function MyComponent() {
  const { leagues, fixtures, valueBets, loading, error, refetch } = useSportsData({
    leagueId: 'some-league-id',
    status: 'NS', // Not Started
    autoRefresh: true,
    refreshInterval: 30000
  });

  if (loading) return <SkeletonGrid />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {valueBets.map(bet => (
        <div key={bet.fixtureId}>
          {bet.homeTeam} vs {bet.awayTeam}
          <p>Value Delta: {bet.valueDelta}</p>
        </div>
      ))}
    </div>
  );
}
```

### Using Direct API Calls

```javascript
import { analyticsAPI } from '../services/api.service';

const dashData = await analyticsAPI.getDashboard();
// { leagues, upcoming, quickValueBets }

const valueBets = await analyticsAPI.getValueBets();
// { valueBets: [...] }
```

### Direct Supabase Queries

```javascript
import { supabaseQueries } from '../services/api.service';

const leagues = await supabaseQueries.getLeagues();
const teams = await supabaseQueries.getTeams(leagueId);
const fixtures = await supabaseQueries.getFixtures({ status: 'NS' });
```

## Real-Time Updates

### Monitoring Live Match Events

```javascript
import { useliveLiveMatchUpdates } from '../hooks/useRealtimeSubscription';

function LiveMatchView({ fixtureId }) {
  const { liveEvents, isConnected, error } = useliveLiveMatchUpdates(fixtureId);

  if (!isConnected) return <p>Connecting to live stream...</p>;

  return (
    <div>
      {liveEvents.map(event => (
        <div key={event.event_id}>
          {event.event_type} at minute {event.event_time}
          Possession: Home {event.home_possession}% - Away {event.away_possession}%
        </div>
      ))}
    </div>
  );
}
```

### Monitoring Prediction & Odds Updates

```javascript
import { usePredictionUpdates } from '../hooks/useRealtimeSubscription';

function OddsTracker({ fixtureId }) {
  const { prediction, marketData, isConnected } = usePredictionUpdates(fixtureId);

  return (
    <div>
      <p>Fair Odds: {prediction?.predicted_home_prob}</p>
      <p>Latest Market Data:</p>
      {marketData.map(market => (
        <div key={market.market_id}>
          {market.provider}: {market.home_odds}
        </div>
      ))}
    </div>
  );
}
```

## Value Bet Detection

The system automatically flags value bets where:
- AI-predicted probability > Bookmaker implied probability by ≥ 5%

The logic is in `useSportsData()`:

```javascript
const deltas = {
  home: aiProb.home - bookyProb.home,
  draw: aiProb.draw - bookyProb.draw,
  away: aiProb.away - bookyProb.away,
};

const hasValue = Object.values(deltas).some((delta) => Math.abs(delta) >= 0.05);
```

## Row Level Security (RLS)

All direct Supabase table access respects RLS policies:

- **Saved Matches**: Users can only view/edit their own records
- **Profile Settings**: Users can only modify their own profile
- **Predictions & Market Data**: Read-only for authenticated users
- **Live Events**: Real-time updates automatically filtered by fixture

## CORS Configuration

The backend (`backend/src/app.js`) includes:

```javascript
app.use(cors({ origin: true, credentials: true }));
```

This allows requests from the Vite dev server (`http://localhost:5173`).

## Error Handling

### Global Error Wrapper

```javascript
import { withSupabaseErrorHandling } from '../lib/supabaseClient';

const result = await withSupabaseErrorHandling(async () => {
  return supabase.from('table').select('*');
}, 10000); // 10-second timeout

if (result.error) {
  console.error(result.error.message);
}
```

### Error Boundary

Wrapped in `App.jsx` to catch and display errors gracefully:

```jsx
<ErrorBoundary>
  <AuthProvider>
    {/* app routes */}
  </AuthProvider>
</ErrorBoundary>
```

## Loading States

Use loading skeletons during data fetch:

```jsx
import { SkeletonCard, DataTableSkeleton } from '../components/ui/LoadingSkeletons';

function DataFetch() {
  const { data, loading } = useSportsData();
  
  if (loading) return <DataTableSkeleton rows={5} />;
  return <div>{/* render data */}</div>;
}
```

## Development Workflow

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the dev server:
   ```bash
   npm run dev
   ```

3. Start the backend (in `backend/` folder):
   ```bash
   cd backend
   npm install
   npm run dev
   ```

4. Login/register at `http://localhost:5173`

5. Access dashboard at `/dashboard` (protected route)

## Pages Using Integration

- **Dashboard** (`/dashboard`): Aggregated data via `analyticsAPI.getDashboard()`
- **Value Bets** (`/value-bets`): Detected via `useSportsData()` + real-time updates
- **Live Analysis** (`/live-analysis`): WebSocket updates via `useliveLiveMatchUpdates()`
- **Match Analytics** (`/match-analytics/:fixtureId`): Live events + predictions
- **Odds Comparison** (`/odds-comparison`): Market data tracking
- **Saved Bets** (`/saved-bets`): User-specific RLS-protected data

## Troubleshooting

**Session Lost on Refresh**
- Supabase auto-persists to localStorage
- Check `.env` variables are correct

**Real-time not updating**
- Ensure RLS policies are configured on the tables
- Check WebSocket connection: `isConnected` flag in hooks

**API calls fail with 401**
- Verify JWT token is being attached via `fetchWithAuth()`
- Check `localStorage` for `sb-* auth keys

**Missing data**
- Verify tables are populated in Supabase console
- Check RLS policies allow read access
