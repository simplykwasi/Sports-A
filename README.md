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
