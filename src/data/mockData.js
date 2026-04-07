// Shared mock data for the frontend prototype. Replace these values with API data later.
export const heroMetrics = [
  { label: 'Matches tracked', value: '186', helper: 'Across top European leagues' },
  { label: 'Model confidence', value: '74%', helper: 'Average confidence on current slate' },
  { label: 'Value spots', value: '12', helper: 'Potential edges for today' },
]

export const featuredMatches = [
  {
    league: 'Premier League',
    kickoff: 'Today • 18:30 UTC',
    home: 'Arsenal',
    away: 'Newcastle',
    prediction: 'Arsenal win',
    confidence: '58%',
    value: '+6.2%',
  },
  {
    league: 'La Liga',
    kickoff: 'Today • 20:00 UTC',
    home: 'Real Sociedad',
    away: 'Atletico Madrid',
    prediction: 'Under 2.5 goals',
    confidence: '61%',
    value: '+4.1%',
  },
  {
    league: 'Serie A',
    kickoff: 'Tomorrow • 19:45 UTC',
    home: 'Atalanta',
    away: 'Roma',
    prediction: 'BTTS Yes',
    confidence: '64%',
    value: '+5.4%',
  },
]

export const quickStats = [
  { label: 'Home form', value: 'W-W-D-W-W' },
  { label: 'Away xG trend', value: '1.48 avg' },
  { label: 'Over 2.5 hit rate', value: '63%' },
  { label: 'Clean sheet rate', value: '31%' },
]

export const standings = [
  { team: 'Arsenal', points: 74, goalDiff: '+31', form: 'WWDWW' },
  { team: 'Liverpool', points: 71, goalDiff: '+28', form: 'WDWWW' },
  { team: 'Manchester City', points: 69, goalDiff: '+35', form: 'WLWWW' },
  { team: 'Aston Villa', points: 62, goalDiff: '+16', form: 'WWDLW' },
]

export const oddsRows = [
  { market: 'Arsenal win', bookmaker: 'Bet365', odds: '1.95', edge: '+6.2%' },
  { market: 'Under 2.5 goals', bookmaker: '1xBet', odds: '1.88', edge: '+4.1%' },
  { market: 'BTTS Yes', bookmaker: 'Pinnacle', odds: '1.80', edge: '+5.4%' },
]

export const notificationFeed = [
  'Lineups expected in 40 minutes for Arsenal vs Newcastle.',
  'Odds drift detected on Atletico Madrid double chance.',
  'Three new high-confidence over 2.5 opportunities added.',
]

export const savedMatches = [
  'Arsenal vs Newcastle',
  'Juventus vs Lazio',
  'Barcelona vs Sevilla',
]

export const adminCards = [
  { label: 'Active users', value: '4,281' },
  { label: 'Predictions generated', value: '18,904' },
  { label: 'Flagged odds feeds', value: '2' },
  { label: 'Pending support tickets', value: '14' },
]
