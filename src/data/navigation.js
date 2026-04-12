import {
  FiFlag,
  FiGrid,
  FiHome,
  FiLayers,
  FiShield,
} from 'react-icons/fi'

// Edit sidebar groups, labels, and route links here.
export const navigationGroups = [
  {
    title: 'Core',
    links: [
      { label: 'Home', to: '/', icon: FiHome },
      { label: 'Dashboard', to: '/dashboard', icon: FiGrid },
      { label: 'Matches', to: '/matches', icon: FiLayers },
      { label: 'League Standings', to: '/league-standings', icon: FiFlag },
      { label: 'Admin Panel', to: '/admin', icon: FiShield },
    ],
  },
]
