// Mock data for football matches and predictions
export const mockMatches = [
  {
    id: 1,
    time: "14:00",
    homeTeam: "Manchester City",
    awayTeam: "Liverpool",
    homeScore: null,
    awayScore: null,
    status: "upcoming",
    league: "Premier League",
    prediction: {
      type: "Over 2.5 Goals",
      confidence: 85,
      reasoning: [
        "Both teams have strong attacking records",
        "Recent matches averaged 3.2 goals per game",
        "Goalkeeper form suggests high-scoring games"
      ]
    },
    isValueBet: true,
    odds: 1.85
  },
  {
    id: 2,
    time: "16:30",
    homeTeam: "Real Madrid",
    awayTeam: "Barcelona",
    homeScore: 2,
    awayScore: 1,
    status: "live",
    league: "La Liga",
    prediction: {
      type: "Home Win",
      confidence: 78,
      reasoning: [
        "Real Madrid unbeaten in last 8 home games",
        "Barcelona struggling with injuries",
        "Home advantage in El Clasico"
      ]
    },
    isValueBet: false,
    odds: 2.10
  },
  {
    id: 3,
    time: "19:45",
    homeTeam: "Bayern Munich",
    awayTeam: "Borussia Dortmund",
    homeScore: null,
    awayScore: null,
    status: "upcoming",
    league: "Bundesliga",
    prediction: {
      type: "Under 2.5 Goals",
      confidence: 72,
      reasoning: [
        "Both teams play defensively at home",
        "Recent matches ended 1-0 or 0-0",
        "Weather conditions favor low scoring"
      ]
    },
    isValueBet: true,
    odds: 1.95
  },
  {
    id: 4,
    time: "21:00",
    homeTeam: "Juventus",
    awayTeam: "AC Milan",
    homeScore: 1,
    awayScore: 1,
    status: "live",
    league: "Serie A",
    prediction: {
      type: "Draw No Bet",
      confidence: 68,
      reasoning: [
        "Both teams have similar form",
        "Derby matches often end in draws",
        "Defensive strategies expected"
      ]
    },
    isValueBet: false,
    odds: 1.75
  },
  {
    id: 5,
    time: "15:15",
    homeTeam: "PSG",
    awayTeam: "Marseille",
    homeScore: null,
    awayScore: null,
    status: "upcoming",
    league: "Ligue 1",
    prediction: {
      type: "Both Teams To Score",
      confidence: 81,
      reasoning: [
        "Both teams have strong attacking players",
        "Recent head-to-head matches saw BTTS",
        "PSG's defense has been leaky"
      ]
    },
    isValueBet: true,
    odds: 1.65
  }
];

export const topValueBets = mockMatches.filter(match => match.isValueBet);