import {
  FiActivity,
  FiBarChart2,
  FiBell,
  FiBookmark,
  FiCompass,
  FiFlag,
  FiGrid,
  FiHome,
  FiLayers,
  FiList,
  FiPercent,
  FiSearch,
  FiSettings,
  FiShield,
  FiTarget,
  FiTrendingUp,
  FiUser,
  FiUsers,
} from 'react-icons/fi'

// Edit sidebar groups, labels, and route links here.
export const navigationGroups = [
  {
    title: 'Core',
    links: [
      { label: 'Landing', to: '/', icon: FiHome },
      { label: 'Dashboard', to: '/dashboard', icon: FiGrid },
      { label: 'Matches', to: '/matches', icon: FiCompass },
      { label: 'Match Analysis', to: '/match-analysis', icon: FiActivity },
      { label: 'Predictions', to: '/predictions', icon: FiTarget },
      { label: 'Statistics', to: '/statistics', icon: FiBarChart2 },
      { label: 'League Standings', to: '/league-standings', icon: FiFlag },
      { label: 'Results History', to: '/results-history', icon: FiList },
      { label: 'Team Details', to: '/team-details', icon: FiUsers },
      { label: 'Odds Comparison', to: '/odds-comparison', icon: FiTrendingUp },
      { label: 'Value Bets', to: '/value-bets', icon: FiPercent },
      { label: 'Over/Under', to: '/over-under-predictions', icon: FiLayers },
    ],
  },
  {
    title: 'User',
    links: [
      { label: 'Login', to: '/login', icon: FiUser },
      { label: 'Register', to: '/register', icon: FiUser },
      { label: 'Profile', to: '/profile', icon: FiUser },
      { label: 'Notifications', to: '/notifications', icon: FiBell },
      { label: 'Search', to: '/search', icon: FiSearch },
      { label: 'Favorites', to: '/favorites', icon: FiBookmark },
      { label: 'Settings', to: '/settings', icon: FiSettings },
      { label: 'Admin Panel', to: '/admin', icon: FiShield },
    ],
  },
]
