# Supabase Configuration & Security

## Row Level Security (RLS) Policies

RLS ensures users can only access their own data. Apply these policies in the Supabase console.

### 1. Profiles Table

```sql
-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (auth.uid() = user_id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = user_id);

-- Users can insert their own profile (during signup)
CREATE POLICY "Users can create own profile"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);
```

### 2. Saved Matches Table (if created)

```sql
CREATE TABLE IF NOT EXISTS saved_matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  fixture_id uuid NOT NULL REFERENCES fixtures(fixture_id) ON DELETE CASCADE,
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE saved_matches ENABLE ROW LEVEL SECURITY;

-- Users can only see their own saved matches
CREATE POLICY "Users can view own saved matches"
ON saved_matches FOR SELECT
USING (auth.uid() = user_id);

-- Users can create saved matches
CREATE POLICY "Users can create saved matches"
ON saved_matches FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own saved matches
CREATE POLICY "Users can delete own saved matches"
ON saved_matches FOR DELETE
USING (auth.uid() = user_id);
```

### 3. Read-Only Tables (Leagues, Teams, Fixtures)

```sql
-- Anyone can read (no user check needed)
ALTER TABLE leagues ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view leagues"
ON leagues FOR SELECT
USING (true);

ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view teams"
ON teams FOR SELECT
USING (true);

ALTER TABLE fixtures ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view fixtures"
ON fixtures FOR SELECT
USING (true);

ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view predictions"
ON predictions FOR SELECT
USING (true);

ALTER TABLE market_data ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view market data"
ON market_data FOR SELECT
USING (true);

ALTER TABLE live_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view live events"
ON live_events FOR SELECT
USING (true);
```

## CORS Configuration

### Frontend (Vite Dev Server)

The backend is already configured to accept requests from Vite dev server:

```javascript
// backend/src/app.js
app.use(cors({ origin: true, credentials: true }));
```

### Production CORS Setup

Update the backend CORS configuration for production:

```javascript
// backend/src/app.js
app.use(cors({
  origin: [
    'http://localhost:5173',           // Dev
    'https://sports-a.vercel.app',     // Production
    'https://yourdomain.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

## Supabase Realtime Configuration

### Enable Realtime for Tables

In Supabase console:

1. Go to **Database** → **Tables**
2. For each table you want to monitor:
   - Click the table
   - Navigate to **Realtime** section
   - Toggle **Enable Realtime** ON

### Monitored Tables

✅ **Enable Realtime for:**
- `live_events` - Watch fixture event stream
- `predictions` - Monitor prediction updates
- `market_data` - Track odds changes

⚠️ **Optional (high traffic):**
- `fixtures` - Match state changes
- `teams` - Rare updates

❌ **Disable for performance:**
- `users` - Handled by Supabase Auth
- `leagues` - Static data

## JWT Configuration

### Backend Token Signing

```javascript
// backend/src/services/auth.service.js
signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}
```

Set environment variables:
```env
JWT_SECRET=your-256-bit-secret-key
JWT_EXPIRES_IN=2h
```

### Frontend Token Refresh

The auth context automatically handles token refresh:

```javascript
// src/context/AuthContext.jsx
const { data: { session } } = await supabase.auth.getSession();
const token = session?.access_token;
```

## Database Performance Optimization

### Indexes

Run in Supabase SQL editor:

```sql
-- Fixture lookups
CREATE INDEX idx_fixtures_league ON fixtures(league_id);
CREATE INDEX idx_fixtures_kickoff ON fixtures(kickoff_time DESC);
CREATE INDEX idx_fixtures_status ON fixtures(status);

-- Market data queries
CREATE INDEX idx_market_fixture ON market_data(fixture_id);
CREATE INDEX idx_market_time ON market_data(market_time DESC);

-- Prediction queries
CREATE INDEX idx_prediction_fixture ON predictions(fixture_id);
CREATE INDEX idx_prediction_value_flag ON predictions(value_flag);

-- Live event queries
CREATE INDEX idx_live_fixture ON live_events(fixture_id);
CREATE INDEX idx_live_time ON live_events(event_time DESC);

-- Profile lookups
CREATE INDEX idx_profiles_user ON profiles(user_id);
```

## Redis Caching Strategy

### Cache Keys

```javascript
// src/middleware/cache.middleware.js

// Pattern: cache:{METHOD}:{URL}
// Examples:
// cache:GET:/api/dashboard
// cache:GET:/api/value-bets
// cache:GET:/api/predictions

// TTL values:
const CACHE_TTL = {
  dashboard: 15,        // 15 seconds
  valueBets: 10,        // 10 seconds
  predictions: 20,      // 20 seconds
  fixtures: 30,         // 30 seconds
  liveAnalysis: 5       // 5 seconds (aggressive)
};
```

### Cache Invalidation

When data changes in the backend, invalidate cache:

```javascript
// backend/src/services/cache.service.js
await cache.delete('cache:GET:/api/dashboard');
await cache.delete('cache:GET:/api/value-bets');
```

## Authentication Security Best Practices

### 1. Secure Password Requirements

Frontend validation:
```javascript
if (password.length < 8) {
  error = 'Password must be at least 8 characters';
}
if (!/[A-Z]/.test(password)) {
  error = 'Password must contain uppercase letters';
}
if (!/[0-9]/.test(password)) {
  error = 'Password must contain numbers';
}
```

### 2. Session Timeout

Configure in auth context:
```javascript
// Logout after 2 hours of inactivity
const INACTIVITY_TIMEOUT = 2 * 60 * 60 * 1000;
```

### 3. Rate Limiting

Add to backend:
```bash
npm install express-rate-limit
```

```javascript
import rateLimit from 'express-rate-limit';

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 5,                     // 5 attempts per window
  message: 'Too many login attempts'
});

app.post('/api/auth/login', authLimiter, login);
app.post('/api/auth/register', authLimiter, register);
```

## Error Handling & Logging

### Backend Error Logging

```javascript
// backend/src/middleware/error.middleware.js
export function errorHandler(err, _req, res, _next) {
  console.error('[ERROR]', {
    timestamp: new Date().toISOString(),
    message: err.message,
    stack: err.stack,
    path: _req.path,
    method: _req.method
  });
  
  res.status(err.status || 500).json({
    error: {
      message: err.message,
      requestId: _req.id
    }
  });
}
```

### Frontend Error Tracking

```javascript
// src/lib/supabaseClient.js
export async function withSupabaseErrorHandling(operation, timeoutMs = 10000) {
  try {
    return await Promise.race([
      operation(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error(`Timeout after ${timeoutMs}ms`)), timeoutMs)
      )
    ]);
  } catch (error) {
    console.error('[Supabase Error]', {
      timestamp: new Date().toISOString(),
      message: error.message
    });
    return { error: { message: error.message } };
  }
}
```

## Testing Security

### Check RLS Policies

In Supabase console:

1. Use the **SQL Editor**
2. Test policies with sample queries:

```sql
-- As authenticated user (should work)
SELECT * FROM profiles WHERE user_id = auth.uid();

-- As different user (should fail)
SELECT * FROM profiles WHERE user_id = 'different-user-id';
```

### Verify CORS

```bash
# From frontend console
fetch('http://localhost:4000/api/health', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  },
  credentials: 'include'
})
.then(r => r.json())
.then(d => console.log('CORS OK', d))
.catch(e => console.error('CORS Failed', e));
```

## Compliance & Privacy

### GDPR Compliance

- User deletion: Supabase cascades on `auth.users` deletion
- Data export: Query user's profiles and saved_matches
- Consent tracking: Add to profiles table

```sql
ALTER TABLE profiles ADD COLUMN terms_accepted_at timestamptz;
ALTER TABLE profiles ADD COLUMN privacy_accepted_at timestamptz;
```

### Data Retention

Set TTL on sensitive data:

```sql
-- Auto-delete market_data after 90 days
ALTER TABLE market_data 
SET (ttl = 7776000000);  -- 90 days in ms
```

---

**Security Checklist**

- [ ] All RLS policies configured
- [ ] CORS only allows known origins
- [ ] JWT secret is strong (256-bit)
- [ ] Rate limiting on auth endpoints
- [ ] HTTPS enforced in production
- [ ] Regular security backups enabled
- [ ] Error messages don't leak sensitive info
- [ ] Passwords enforced to minimum standards
