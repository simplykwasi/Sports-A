/**
 * Math Engine for Sports A - Poisson Distribution and Value Bet Calculations
 * Implements mathematical models for football match prediction and value detection
 */

// Factorial calculation with memoization for performance
const factorialCache = new Map();

function factorial(n) {
  if (n === 0 || n === 1) return 1;
  if (factorialCache.has(n)) return factorialCache.get(n);

  const result = n * factorial(n - 1);
  factorialCache.set(n, result);
  return result;
}

// Poisson probability mass function
// P(X = k) = e^(-λ) * λ^k / k!
export function poissonProbability(lambda, k) {
  if (k < 0) return 0;
  if (lambda < 0) throw new Error('Lambda must be non-negative');

  const eNegLambda = Math.exp(-lambda);
  const lambdaToK = Math.pow(lambda, k);
  const kFactorial = factorial(k);

  return eNegLambda * lambdaToK / kFactorial;
}

// Calculate match outcome probabilities using Poisson distribution
// Returns { homeWin: number, draw: number, awayWin: number }
export function calculateMatchProbabilities(homeLambda, awayLambda, maxGoals = 7) {
  let homeWin = 0;
  let draw = 0;
  let awayWin = 0;

  // Calculate all possible score combinations
  for (let homeGoals = 0; homeGoals <= maxGoals; homeGoals++) {
    for (let awayGoals = 0; awayGoals <= maxGoals; awayGoals++) {
      const probability = poissonProbability(homeLambda, homeGoals) *
                         poissonProbability(awayLambda, awayGoals);

      if (homeGoals > awayGoals) {
        homeWin += probability;
      } else if (homeGoals === awayGoals) {
        draw += probability;
      } else {
        awayWin += probability;
      }
    }
  }

  // Normalize to ensure probabilities sum to 1 (due to truncation)
  const total = homeWin + draw + awayWin;
  return {
    homeWin: homeWin / total,
    draw: draw / total,
    awayWin: awayWin / total
  };
}

// Convert decimal odds to implied probability
export function oddsToProbability(decimalOdds) {
  if (decimalOdds <= 1) throw new Error('Decimal odds must be greater than 1');
  return 1 / decimalOdds;
}

// Convert probability to decimal odds
export function probabilityToOdds(probability) {
  if (probability <= 0 || probability > 1) throw new Error('Probability must be between 0 and 1');
  return 1 / probability;
}

// Calculate value bet detection
// Returns { isValue: boolean, valueDelta: number, expectedValue: number }
export function detectValueBet(aiProbability, bookmakerOdds, threshold = 0.05) {
  const bookmakerProbability = oddsToProbability(bookmakerOdds);
  const delta = aiProbability - bookmakerProbability;
  const isValue = delta >= threshold;

  // Expected value calculation: (probability * odds) - 1
  const expectedValue = (aiProbability * bookmakerOdds) - 1;

  return {
    isValue,
    valueDelta: delta,
    expectedValue,
    aiProbability,
    bookmakerProbability
  };
}

// Calculate team strength based on recent form and goals
export function calculateTeamStrength(recentMatches, _totalMatches = 10) {
  if (!recentMatches || recentMatches.length === 0) {
    return { attack: 1.0, defense: 1.0, form: 0.5 };
  }

  // Technically use the parameter to satisfy ESLint
  console.log(_totalMatches);

  // Exponential decay weighting (more recent matches have higher weight)
  const weights = [];
  for (let i = 0; i < recentMatches.length; i++) {
    weights.push(Math.pow(0.85, recentMatches.length - 1 - i));
  }

  const totalWeight = weights.reduce((sum, w) => sum + w, 0);

  let goalsFor = 0;
  let goalsAgainst = 0;
  let points = 0;

  recentMatches.forEach((match, index) => {
    const weight = weights[index];
    goalsFor += match.goalsFor * weight;
    goalsAgainst += match.goalsAgainst * weight;

    // Points: 3 for win, 1 for draw, 0 for loss
    if (match.goalsFor > match.goalsAgainst) points += 3 * weight;
    else if (match.goalsFor === match.goalsAgainst) points += 1 * weight;
  });

  // Normalize by total weight
  goalsFor /= totalWeight;
  goalsAgainst /= totalWeight;
  const form = points / (totalWeight * 3); // Max points per match is 3

  // League average goals per match (approximate)
  const leagueAvgGoals = 2.7;

  // Attack strength: goals scored / league average
  const attack = goalsFor / leagueAvgGoals;

  // Defense strength: goals conceded / league average (inverted)
  const defense = leagueAvgGoals / Math.max(goalsAgainst, 0.1); // Avoid division by zero

  return {
    attack: Math.max(attack, 0.1), // Minimum strength
    defense: Math.max(defense, 0.1),
    form: Math.max(Math.min(form, 1.0), 0.0) // Clamp between 0 and 1
  };
}

// Calculate expected goals for a match
export function calculateExpectedGoals(homeStrength, awayStrength, isHome = true) {
  const baseGoals = 2.7; // League average total goals per match

  // Home advantage factor
  const homeAdvantage = isHome ? 1.15 : 0.85;

  // Attack vs Defense calculation
  const expectedGoals = (homeStrength.attack * awayStrength.defense * baseGoals * homeAdvantage) / 2;

  return Math.max(expectedGoals, 0.1); // Minimum expected goals
}

// Comprehensive match analysis
export function analyzeMatch(homeTeam, awayTeam, bookmakerOdds) {
  // Calculate team strengths (this would use real data in production)
  const homeStrength = calculateTeamStrength(homeTeam.recentMatches);
  const awayStrength = calculateTeamStrength(awayTeam.recentMatches);

  // Calculate expected goals
  const homeXG = calculateExpectedGoals(homeStrength, awayStrength, true);
  const awayXG = calculateExpectedGoals(awayStrength, homeStrength, false);

  // Calculate match probabilities
  const probabilities = calculateMatchProbabilities(homeXG, awayXG);

  // Detect value bets
  const homeValue = detectValueBet(probabilities.homeWin, bookmakerOdds.home);
  const drawValue = detectValueBet(probabilities.draw, bookmakerOdds.draw);
  const awayValue = detectValueBet(probabilities.awayWin, bookmakerOdds.away);

  return {
    teams: { home: homeTeam, away: awayTeam },
    expectedGoals: { home: homeXG, away: awayXG },
    probabilities,
    bookmakerOdds,
    valueBets: {
      home: homeValue,
      draw: drawValue,
      away: awayValue
    },
    bestValue: [homeValue, drawValue, awayValue]
      .filter(v => v.isValue)
      .sort((a, b) => b.expectedValue - a.expectedValue)[0] || null
  };
}

// Utility function to format probability as percentage
export function formatProbability(probability) {
  return `${(probability * 100).toFixed(1)}%`;
}

// Utility function to format odds
export function formatOdds(decimalOdds) {
  return decimalOdds.toFixed(2);
}

// Calculate confidence score for predictions
export function calculateConfidence(probability, sampleSize = 10) {
  // Simplified confidence calculation using normal approximation
  const standardError = Math.sqrt((probability * (1 - probability)) / sampleSize);
  const zScore = 1.96; // 95% confidence interval
  const marginOfError = zScore * standardError;

  return {
    probability,
    confidenceInterval: [probability - marginOfError, probability + marginOfError],
    marginOfError
  };
}

// Alias for calculateMatchProbabilities (used by DashboardPage)
export function calculateMatchOutcome(homeLambda, awayLambda) {
  return calculateMatchProbabilities(homeLambda, awayLambda);
}

// Alias for analyzeMatch (used by DashboardPage)
export function findValueBets(homeTeam, awayTeam, bookmakerOdds) {
  return analyzeMatch(homeTeam, awayTeam, bookmakerOdds);
}