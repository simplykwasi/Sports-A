import {
  BarChart3,
  Eye,
  History,
  Home,
  LayoutDashboard,
  Layers,
  Percent,
  Radio,
  Save,
  Shield,
  Trophy,
} from 'lucide-react'

export const navigationGroups = [
  {
    title: 'Core',
    links: [
      { label: 'Home', to: '/', icon: Home },
      { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
      { label: 'Matches', to: '/matches', icon: Layers },
      { label: 'League Standings', to: '/league-standings', icon: Trophy },
    ],
  },
  {
    title: 'Betting & odds',
    links: [
      { label: 'Value Bets', to: '/value-bets', icon: Percent },
      { label: 'Odds Comparison', to: '/odds-comparison', icon: BarChart3 },
      { label: 'Saved Bets', to: '/saved-bets', icon: Save },
      { label: 'Bet History', to: '/bet-history', icon: History },
      { label: 'Watchlist', to: '/watchlist', icon: Eye },
    ],
  },
  {
    title: 'Analysis',
    links: [{ label: 'Live Analysis', to: '/live-analysis', icon: Radio }],
  },
  {
    title: 'Admin',
    links: [{ label: 'Admin Panel', to: '/admin', icon: Shield }],
  },
]
