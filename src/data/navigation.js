import {
  FiBell,
  FiBookmark,
  FiCompass,
  FiFlag,
  FiGrid,
  FiHome,
  FiSearch,
  FiSettings,
  FiShield,
  FiUser,
} from 'react-icons/fi'

// Edit sidebar groups, labels, and route links here.
export const navigationGroups = [
  {
    title: 'Core',
    links: [
      { label: 'Landing', to: '/', icon: FiHome },
      { label: 'Dashboard', to: '/dashboard', icon: FiGrid },
      { label: 'Matches', to: '/matches', icon: FiCompass },
      { label: 'League Standings', to: '/league-standings', icon: FiFlag },
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
