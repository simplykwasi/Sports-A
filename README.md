# Sports A

A modern, responsive sports match tracking and prediction app built with React and Vite. Features live match updates, league standings, search functionality, and personalized betting recommendations for registered users.

## Features

- **Live Match Tracking**: Real-time updates for ongoing matches across multiple leagues
- **Match Predictions**: AI-powered predictions and betting recommendations (requires account)
- **Search Functionality**: Quick search for teams, leagues, and matches
- **User Authentication**: Sign up, sign in, and profile management
- **Favorites**: Track your favorite teams and leagues
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **League Standings**: View current table positions and team forms

## Tech Stack

- **Frontend**: React 18 with Vite
- **Styling**: Tailwind CSS for responsive design
- **Routing**: React Router for navigation
- **State Management**: React Context for authentication
- **Build Tool**: Vite for fast development and optimized builds
- **Linting**: ESLint for code quality
- **Backend**: Node.js + Express, JWT auth, Redis caching, Supabase/PostgreSQL
- **Realtime**: WebSockets for live analytics and value detection

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd sports-a
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

### Run Linting

```bash
npm run lint
```

## Backend Development

The backend lives in `backend/` and is designed for Supabase/PostgreSQL, live analytics, and value bet detection.

1. Change directory into the backend folder:
   ```bash
   cd backend
   ```
2. Install backend dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` from `.env.example` and configure Supabase, Redis, and API-Football credentials.
4. Run database migrations:
   ```bash
   npm run migrate
   ```
5. Start the backend server:
   ```bash
   npm run dev
   ```

The backend exposes:
- `GET /api/dashboard`
- `GET /api/value-bets`
- `GET /api/predictions`
- `GET /api/live-analysis/:fixtureId`
- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/auth/refresh`

## Deployment

### Static Hosting

The app can be deployed to any static hosting service:

- **Vercel**: Connect your GitHub repo and deploy automatically
- **Netlify**: Drag & drop the `dist` folder or connect via Git
- **GitHub Pages**: Use GitHub Actions for automated deployment
- **AWS S3 + CloudFront**: For scalable static hosting

### Environment Variables

Create a `.env` file for environment-specific configuration:

```env
VITE_API_URL=https://api.sports-a.com
VITE_APP_ENV=production
```

### Performance Features

- **Code Splitting**: Pages are lazy-loaded for faster initial load
- **Optimized Bundles**: Vite automatically optimizes and minifies code
- **PWA Ready**: Includes web app manifest for installable experience

## Project Structure

```
src/
├── components/
│   ├── layout/          # Layout components (Topbar, Sidebar, etc.)
│   ├── matches/         # Match-related components
│   └── ui/              # Reusable UI components
├── context/             # React contexts (Auth)
├── data/                # Mock data and navigation
├── hooks/               # Custom React hooks
├── lib/                 # Utility libraries
└── pages/               # Page components
```

## Authentication

The app includes a simple authentication system with:
- User registration and login
- Persistent sessions using localStorage
- Profile management
- Privileged features for signed-in users (betting recommendations)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.
