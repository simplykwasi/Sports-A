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

// Edit the league tabs shown on the matches page here.
export const matchLeagueTabs = [
  'All leagues',
  'Premier League',
  'La Liga',
  'Serie A',
  'Bundesliga',
]

// Edit the match list cards here.
export const matchListings = [
  {
    id: 'arsenal-newcastle',
    league: 'Premier League',
    kickoff: 'Today - 18:30 UTC',
    venue: 'Emirates Stadium',
    home: { name: 'Arsenal', shortName: 'ARS', crestColor: 'bg-red-500/15 text-red-300 border-red-400/20' },
    away: { name: 'Newcastle', shortName: 'NEW', crestColor: 'bg-slate-300/15 text-slate-200 border-slate-300/20' },
  },
  {
    id: 'sociedad-atletico',
    league: 'La Liga',
    kickoff: 'Today - 20:00 UTC',
    venue: 'Reale Arena',
    home: { name: 'Real Sociedad', shortName: 'RSO', crestColor: 'bg-sky-500/15 text-sky-300 border-sky-400/20' },
    away: { name: 'Atletico Madrid', shortName: 'ATM', crestColor: 'bg-rose-500/15 text-rose-300 border-rose-400/20' },
  },
  {
    id: 'atalanta-roma',
    league: 'Serie A',
    kickoff: 'Tomorrow - 19:45 UTC',
    venue: 'Gewiss Stadium',
    home: { name: 'Atalanta', shortName: 'ATA', crestColor: 'bg-blue-500/15 text-blue-300 border-blue-400/20' },
    away: { name: 'Roma', shortName: 'ROM', crestColor: 'bg-amber-500/15 text-amber-300 border-amber-400/20' },
  },
  {
    id: 'dortmund-leipzig',
    league: 'Bundesliga',
    kickoff: 'Tomorrow - 17:30 UTC',
    venue: 'Signal Iduna Park',
    home: { name: 'Dortmund', shortName: 'BVB', crestColor: 'bg-yellow-400/15 text-yellow-200 border-yellow-300/20' },
    away: { name: 'Leipzig', shortName: 'RBL', crestColor: 'bg-indigo-500/15 text-indigo-300 border-indigo-400/20' },
  },
]

export const matchDetailTabs = [
  'Match Analysis',
  'Statistics',
  'Predictions',
  'League Standings',
  'Results History',
  'Team Details',
  'Odds Comparisons',
  'Value Bets',
  'Over/Under Bets',
]

// Edit the full match analysis page content here.
export const matchDetailsById = {
  'arsenal-newcastle': {
    headline: 'Arsenal carry the stronger attacking form, while Newcastle are giving up high-quality chances away from home.',
    recommendedBet: 'Arsenal to win',
    confidence: 'High confidence - 58%',
    homeForm: ['2-1 vs Chelsea', '3-0 vs Wolves', '1-1 vs Liverpool', '2-0 vs Brighton'],
    awayForm: ['1-2 vs Villa', '0-1 vs City', '2-2 vs West Ham', '1-3 vs Spurs'],
    stats: [
      { label: 'Home xG', value: '1.94' },
      { label: 'Away xGA', value: '1.61' },
      { label: 'Shots on target', value: '6.2 vs 4.1' },
      { label: 'Possession', value: '58% vs 46%' },
    ],
    standings: [
      { team: 'Arsenal', points: '74', form: 'WWDWW' },
      { team: 'Newcastle', points: '55', form: 'LDWDL' },
    ],
    teamDetails: [
      { title: 'Arsenal', body: 'Strong home press, stable midfield control, and better recent chance creation.' },
      { title: 'Newcastle', body: 'Direct transition threat, but defensive line has looked fragile under sustained pressure.' },
    ],
    odds: [
      { market: 'Arsenal win', bestBook: 'Bet365', price: '1.95' },
      { market: 'Arsenal draw no bet', bestBook: 'Betway', price: '1.42' },
      { market: 'Arsenal over 1.5 goals', bestBook: 'SportyBet', price: '1.76' },
    ],
    valueBets: [
      'Arsenal to win at 1.95',
      'Arsenal over 1.5 team goals at 1.76',
      'Arsenal win & under 4.5 goals at 2.35',
    ],
    overUnder: [
      { line: 'Over 2.5', model: '57%', market: '1.84' },
      { line: 'Under 3.5', model: '69%', market: '1.42' },
    ],
  },
  'sociedad-atletico': {
    headline: 'This profile leans toward a tighter match, with both sides conceding few clear chances in recent fixtures.',
    recommendedBet: 'Under 2.5 goals',
    confidence: 'High confidence - 61%',
    homeForm: ['1-0 vs Getafe', '0-0 vs Sevilla', '2-1 vs Girona', '1-1 vs Valencia'],
    awayForm: ['1-0 vs Betis', '1-1 vs Barca', '2-0 vs Osasuna', '0-0 vs Villarreal'],
    stats: [
      { label: 'Combined xG', value: '2.28' },
      { label: 'Clean sheet rate', value: '44%' },
      { label: 'Goals per match', value: '2.05' },
      { label: 'Cards average', value: '4.6' },
    ],
    standings: [
      { team: 'Atletico Madrid', points: '67', form: 'WDWDW' },
      { team: 'Real Sociedad', points: '57', form: 'DWWDL' },
    ],
    teamDetails: [
      { title: 'Real Sociedad', body: 'Good structure in midfield and patient build-up, but not always explosive in the final third.' },
      { title: 'Atletico Madrid', body: 'Organized without the ball and usually effective at protecting narrow leads.' },
    ],
    odds: [
      { market: 'Under 2.5 goals', bestBook: 'Betway', price: '1.88' },
      { market: 'Draw', bestBook: 'SportyBet', price: '3.05' },
      { market: 'BTTS No', bestBook: '1xBet', price: '1.79' },
    ],
    valueBets: ['Under 2.5 goals at 1.88', 'BTTS No at 1.79'],
    overUnder: [
      { line: 'Under 2.5', model: '61%', market: '1.88' },
      { line: 'Under 3.5', model: '81%', market: '1.31' },
    ],
  },
  'atalanta-roma': {
    headline: 'Both teams are creating enough chances to keep the goals markets active, especially in second-half periods.',
    recommendedBet: 'Both teams to score',
    confidence: 'High confidence - 64%',
    homeForm: ['3-1 vs Torino', '2-2 vs Napoli', '2-0 vs Genoa', '1-1 vs Milan'],
    awayForm: ['2-1 vs Lazio', '1-2 vs Inter', '2-2 vs Fiorentina', '1-0 vs Bologna'],
    stats: [
      { label: 'BTTS hit rate', value: '64%' },
      { label: 'Goals average', value: '3.12' },
      { label: 'Big chances', value: '3.8 vs 2.9' },
      { label: 'Shots inside box', value: '8.1 vs 6.7' },
    ],
    standings: [
      { team: 'Atalanta', points: '60', form: 'WDWWD' },
      { team: 'Roma', points: '58', form: 'WLWDW' },
    ],
    teamDetails: [
      { title: 'Atalanta', body: 'Aggressive final-third play and reliable wing progression make them dangerous at home.' },
      { title: 'Roma', body: 'More balanced than earlier in the season and capable of scoring even in lower-possession matches.' },
    ],
    odds: [
      { market: 'BTTS Yes', bestBook: 'Pinnacle', price: '1.80' },
      { market: 'Over 2.5 goals', bestBook: 'Bet365', price: '1.91' },
      { market: 'Atalanta win', bestBook: 'SportyBet', price: '2.12' },
    ],
    valueBets: ['BTTS Yes at 1.80', 'Over 2.5 goals at 1.91'],
    overUnder: [
      { line: 'Over 2.5', model: '59%', market: '1.91' },
      { line: 'Over 3.5', model: '36%', market: '2.74' },
    ],
  },
  'dortmund-leipzig': {
    headline: 'This is the most balanced match on the slate, but Dortmund still carry a slight edge through home attacking volume.',
    recommendedBet: 'Dortmund draw no bet',
    confidence: 'Medium confidence - 54%',
    homeForm: ['2-0 vs Mainz', '3-2 vs Freiburg', '1-1 vs Leverkusen', '4-1 vs Augsburg'],
    awayForm: ['1-0 vs Hoffenheim', '2-2 vs Frankfurt', '0-1 vs Bayern', '3-1 vs Bremen'],
    stats: [
      { label: 'Home xG', value: '1.86' },
      { label: 'Away xG', value: '1.48' },
      { label: 'Corners average', value: '5.9 vs 5.1' },
      { label: 'Win probability', value: '42% / 29% / 29%' },
    ],
    standings: [
      { team: 'Leipzig', points: '61', form: 'WDLWW' },
      { team: 'Dortmund', points: '59', form: 'WWDWW' },
    ],
    teamDetails: [
      { title: 'Dortmund', body: 'Home intensity and direct vertical passing make them dangerous against open opponents.' },
      { title: 'Leipzig', body: 'Quick in transition and disciplined centrally, but sometimes vulnerable to wide overloads.' },
    ],
    odds: [
      { market: 'Dortmund draw no bet', bestBook: 'Betway', price: '1.61' },
      { market: 'Over 2.5 goals', bestBook: '1xBet', price: '1.78' },
      { market: 'Both teams to score', bestBook: 'SportyBet', price: '1.67' },
    ],
    valueBets: ['Dortmund draw no bet at 1.61', 'Both teams to score at 1.67'],
    overUnder: [
      { line: 'Over 2.5', model: '56%', market: '1.78' },
      { line: 'Under 4.5', model: '78%', market: '1.27' },
    ],
  },
}

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
