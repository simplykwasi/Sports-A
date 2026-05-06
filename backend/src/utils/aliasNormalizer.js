const TEAM_ALIAS_MAP = {
  'man utd': 'Manchester United',
  'manchester united': 'Manchester United',
  'man city': 'Manchester City',
  'manchester city': 'Manchester City',
  arsenal: 'Arsenal',
  chelsea: 'Chelsea',
  'psg': 'Paris Saint-Germain',
  'real madrid': 'Real Madrid',
  'fc barcelona': 'Barcelona',
  juventus: 'Juventus',
};

export function normalizeTeamName(rawName) {
  if (!rawName || typeof rawName !== 'string') {
    return rawName;
  }

  const normalized = rawName.trim().toLowerCase();
  return TEAM_ALIAS_MAP[normalized] || rawName.trim();
}
