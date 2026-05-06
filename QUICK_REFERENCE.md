# ⚡ Sports A - Quick Reference Card

## 🎯 Common Tasks

### Start Development

```bash
# Terminal 1: Frontend
npm run dev

# Terminal 2: Backend
cd backend && npm run dev

# Terminal 3: Redis (optional)
redis-server

# Browser: http://localhost:5173
```

### Update Supabase Schema

```bash
cd backend
npm run migrate
```

### Install Dependencies

```bash
# Frontend
npm install

# Backend
cd backend && npm install
```

---

## 🔐 Environment Variables

### Frontend (.env)
```env
VITE_SUPABASE_URL=https://sijynfgkrcnhgmaqdcav.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_API_URL=http://localhost:4000/api
VITE_APP_ENV=development
```

### Backend (.env)
```env
DATABASE_URL=postgresql://user:pass@db.supabase.co:5432/postgres
SUPABASE_URL=https://sijynfgkrcnhgmaqdcav.supabase.co
SUPABASE_KEY=service-role-key
SPORTS_API_KEY=api-football-key
JWT_SECRET=random-256-bit-secret
REDIS_URL=redis://localhost:6379
PORT=4000
```

---

## 💾 File Locations

| What | Where |
|------|-------|
| **Supabase Init** | `src/lib/supabaseClient.js` |
| **Auth Provider** | `src/context/AuthContext.jsx` |
| **API Calls** | `src/services/api.service.js` |
| **Data Hook** | `src/hooks/useSportsData.js` |
| **Realtime Hook** | `src/hooks/useRealtimeSubscription.js` |
| **Protected Routes** | `src/components/ProtectedRoute.jsx` |
| **Main Router** | `src/App.jsx` |
| **Backend Routes** | `backend/src/routes/*.js` |
| **DB Schema** | `backend/db/migrations/001_init.sql` |

---

## 🔌 API Endpoints

### Auth
```
POST /api/auth/login          { email, password }
POST /api/auth/register       { email, password, displayName }
POST /api/auth/refresh        { refreshToken }
```

### Analytics
```
GET /api/dashboard            (cached 15s)
GET /api/value-bets          (cached 10s)
GET /api/predictions         (cached 20s)
GET /api/fixtures/:id        (cached 30s)
```

### Live
```
GET /api/live-analysis/:id   (cached 5s)
WS /live-ws                  (real-time)
```

---

## 🎣 Hook Usage

### useAuth
```javascript
const { currentUser, login, register, logout } = useAuth();
```

### useSportsData
```javascript
const { leagues, fixtures, valueBets, loading, error, refetch } = useSportsData({
  leagueId: 'id',
  autoRefresh: true,
  refreshInterval: 30000
});
```

### useliveLiveMatchUpdates
```javascript
const { liveEvents, isConnected, error } = useliveLiveMatchUpdates(fixtureId);
```

### usePredictionUpdates
```javascript
const { prediction, marketData, isConnected, error } = usePredictionUpdates(fixtureId);
```

---

## 🚧 Common Patterns

### Fetch Data with Error Handling
```javascript
import { analyticsAPI } from '../services/api.service';

const result = await analyticsAPI.getDashboard();
if (result.error) {
  console.error('Failed:', result.error.message);
} else {
  console.log('Data:', result);
}
```

### Query Supabase Directly
```javascript
import { supabaseQueries } from '../services/api.service';

const leagues = await supabaseQueries.getLeagues();
const teams = await supabaseQueries.getTeams(leagueId);
```

### Protect a Route
```jsx
<Route
  element={
    <ProtectedRoute>
      <MyPage />
    </ProtectedRoute>
  }
  path="/my-page"
/>
```

### Show Loading Skeleton
```jsx
import { SkeletonCard, DataTableSkeleton } from '../components/ui/LoadingSkeletons';

{loading ? <DataTableSkeleton rows={5} /> : <DataTable data={data} />}
```

### Listen to Real-Time Events
```javascript
const { liveEvents, isConnected } = useliveLiveMatchUpdates(fixtureId);

useEffect(() => {
  if (liveEvents.length > 0) {
    console.log('New events:', liveEvents);
  }
}, [liveEvents]);
```

---

## 🐛 Debugging

### Check Auth Status
```javascript
// In browser console
const { data: { session } } = await supabase.auth.getSession();
console.log(session);
```

### Check Realtime Connection
```javascript
// In component
console.log('Connected:', isConnected);
// Should be true if WebSocket is active
```

### Monitor API Calls
```
Browser DevTools → Network tab
Look for /api/* requests
Check Authorization header has Bearer token
```

### View Database Logs
```
Supabase Console → Logs
Filter by request_id or timestamp
```

---

## 📊 Common SQL Queries

### View Users
```sql
select id, email, created_at from auth.users limit 10;
```

### View Predictions
```sql
select * from predictions 
where value_flag = true
order by created_at desc limit 10;
```

### View Market Data
```sql
select * from market_data 
where fixture_id = 'fixture-id'
order by market_time desc limit 20;
```

### Check RLS
```sql
-- Test if user can see their own profile
select * from profiles where user_id = auth.uid();
```

---

## 🔑 Key Constants

| Constant | Value | Purpose |
|----------|-------|---------|
| `JWT_EXPIRES_IN` | `2h` | Token lifetime |
| `CACHE_TTL.dashboard` | `15s` | Dashboard cache |
| `CACHE_TTL.valueBets` | `10s` | Value bets cache |
| `CACHE_TTL.liveAnalysis` | `5s` | Live analysis cache |
| `VALUE_BET_THRESHOLD` | `0.05` | 5% delta for value |
| `API_TIMEOUT` | `10000ms` | Operation timeout |
| `POISSON_MAX_GOALS` | `7` | Probability calc limit |

---

## 🚨 Troubleshooting

| Issue | Solution |
|-------|----------|
| 401 Unauthorized | Check JWT token in localStorage, verify Bearer token |
| CORS Error | Confirm backend CORS config allows origin |
| WebSocket Failed | Check `ws://localhost:4000/live-ws` is accessible |
| Session Lost | Clear localStorage and re-login |
| Data Not Updating | Verify Realtime is enabled on table, check RLS |
| Slow Queries | Check database indexes, use cache |
| Login Fails | Verify email/password correct, check Supabase logs |

---

## 📚 Documentation

- **Full Setup**: `SETUP_GUIDE.md`
- **Integration Patterns**: `SUPABASE_INTEGRATION.md`
- **Security Config**: `SECURITY_CONFIG.md`
- **Project Overview**: `INTEGRATION_SUMMARY.md`
- **File Manifest**: `MANIFEST.md`

---

## 🎓 Learning

**Supabase**: https://supabase.com/docs  
**React**: https://react.dev  
**Express**: https://expressjs.com  
**PostgreSQL**: https://www.postgresql.org/docs  
**WebSockets**: https://developer.mozilla.org/en-US/docs/Web/API/WebSocket  

---

## ⚙️ Configuration Checklist

Frontend
- [ ] `.env` file created
- [ ] `VITE_SUPABASE_URL` set
- [ ] `VITE_SUPABASE_ANON_KEY` set
- [ ] `VITE_API_URL` correct
- [ ] `npm install` run

Backend
- [ ] `.env` file created
- [ ] `DATABASE_URL` set
- [ ] `SUPABASE_URL` and `SUPABASE_KEY` set
- [ ] `JWT_SECRET` generated
- [ ] `npm install` run from backend/
- [ ] `npm run migrate` executed

Database
- [ ] Migrations applied
- [ ] RLS policies configured
- [ ] Realtime enabled on tables
- [ ] Indexes created

---

**Quick Reference for Sports A Development**  
Last Updated: May 6, 2026
