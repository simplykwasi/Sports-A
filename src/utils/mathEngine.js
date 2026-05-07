/**
 * Math Engine for Sports Analytics
 * Provides Poisson Distribution, Expected Value, and Value Bet calculations
 */

/**
 * Calculate factorial of a number
 * @param {number} n - The number to calculate factorial for
 * @returns {number} - Factorial result
 */
function factorial(n) {
  if (n === 0 || n === 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

/**
 * Calculate Poisson probability distribution
 * P(X = k) = (λ^k * e^(-λ)) / k!
 * 
 * @param {number} lambda - Expected average (mean) number of goals
 * @param {number} k - Actual number of goals
 * @returns {number} - Probability of exactly k goals
 */
export function calculatePoisson(lambda, k) {
  if (lambda < 0 || k < 0) return 0;
  
  const numerator = Math.pow(lambda, k) * Math.exp(-lambda);
  const denominator = factorial(k);
  
  return numerator / denominator;
}

/**
 * Calculate probability of a match outcome using Poisson distribution
 * 
 * @param {number} homeGoals - Expected home team goals
 * @param {number} awayGoals - Expected away team goals
 * @param {number} maxGoals - Maximum goals to calculate (default: 10)
 * @returns {Object} - Probabilities for home win, draw, away win
 */
export function calculateMatchOutcome(homeGoals, awayGoals, maxGoals = 10) {
  let homeWinProb = 0;
  let drawProb = 0;
  let awayWinProb = 0;

  for (let i = 0; i <= maxGoals; i++) {
    for (let j = 0; j <= maxGoals; j++) {
      const prob = calculatePoisson(homeGoals, i) * calculatePoisson(awayGoals, j);
      
      if (i > j) {
        homeWinProb += prob;
      } else if (i === j) {
        drawProb += prob;
      } else {
        awayWinProb += prob;
      }
    }
  }

  return {
    homeWin: homeWinProb,
    draw: drawProb,
    awayWin: awayWinProb,
  };
}

/**
 * Calculate expected value (EV) for a bet
 * EV = (Probability of Win × Amount Won) - (Probability of Loss × Amount Lost)
 * 
 * @param {number} probability - Probability of the bet winning (0 to 1)
 * @param {number} odds - Decimal odds (e.g., 2.5)
 * @param {number} stake - Amount staked (default: 1)
 * @returns {number} - Expected value of the bet
 */
export function calculateExpectedValue(probability, odds, stake = 1) {
  if (probability < 0 || probability > 1) return 0;
  if (odds < 1) return 0;
  
  const amountWon = (odds - 1) * stake;
  const amountLost = stake;
  
  const ev = (probability * amountWon) - ((1 - probability) * amountLost);
  
  return ev;
}

/**
 * Calculate implied probability from decimal odds
 * 
 * @param {number} odds - Decimal odds
 * @returns {number} - Implied probability (0 to 1)
 */
export function calculateImpliedProbability(odds) {
  if (odds <= 0) return 0;
  return 1 / odds;
}

/**
 * Find value bets by comparing true probability with bookmaker odds
 * 
 * @param {Object} predictions - Object with homeWin, draw, awayWin probabilities
 * @param {Object} odds - Object with homeWin, draw, awayWin decimal odds
 * @param {number} threshold - Minimum edge percentage to consider (default: 5%)
 * @returns {Array} - Array of value bet opportunities
 */
export function findValueBets(predictions, odds, threshold = 0.05) {
  const valueBets = [];

  const outcomes = ['homeWin', 'draw', 'awayWin'];
  const outcomeLabels = {
    homeWin: 'Home Win',
    draw: 'Draw',
    awayWin: 'Away Win',
  };

  outcomes.forEach((outcome) => {
    const trueProbability = predictions[outcome];
    const bookmakerOdds = odds[outcome];
    
    if (!trueProbability || !bookmakerOdds) return;

    const impliedProb = calculateImpliedProbability(bookmakerOdds);
    const edge = trueProbability - impliedProb;
    const edgePercentage = (edge / impliedProb) * 100;

    const ev = calculateExpectedValue(trueProbability, bookmakerOdds, 100);

    if (edge > threshold) {
      valueBets.push({
        outcome: outcomeLabels[outcome],
        outcomeKey: outcome,
        trueProbability: trueProbability,
        impliedProbability: impliedProb,
        odds: bookmakerOdds,
        edge: edge,
        edgePercentage: edgePercentage,
        expectedValue: ev,
        isValueBet: true,
      });
    }
  });

  return valueBets.sort((a, b) => b.edge - a.edge);
}

/**
 * Calculate Kelly Criterion for optimal bet sizing
 * Kelly % = (bp - q) / b
 * Where: b = odds - 1, p = probability of win, q = probability of loss
 * 
 * @param {number} probability - Probability of winning (0 to 1)
 * @param {number} odds - Decimal odds
 * @param {number} fraction - Fraction of Kelly to use (default: 0.25 for quarter Kelly)
 * @returns {number} - Recommended stake as percentage of bankroll
 */
export function calculateKellyCriterion(probability, odds, fraction = 0.25) {
  if (probability <= 0 || probability >= 1) return 0;
  if (odds <= 1) return 0;

  const b = odds - 1;
  const p = probability;
  const q = 1 - probability;

  const kelly = (b * p - q) / b;

  // Never recommend more than 25% of bankroll by default (conservative)
  const adjustedKelly = Math.max(0, kelly * fraction);

  return Math.min(adjustedKelly, 0.25); // Cap at 25%
}

/**
 * Calculate over/under goals probability
 * 
 * @param {number} homeGoals - Expected home team goals
 * @param {number} awayGoals - Expected away team goals
 * @param {number} line - Goals line (e.g., 2.5)
 * @param {number} maxGoals - Maximum goals to calculate (default: 15)
 * @returns {Object} - Probabilities for over and under
 */
export function calculateOverUnder(homeGoals, awayGoals, line, maxGoals = 15) {
  let overProb = 0;
  let underProb = 0;

  for (let i = 0; i <= maxGoals; i++) {
    for (let j = 0; j <= maxGoals; j++) {
      const totalGoals = i + j;
      const prob = calculatePoisson(homeGoals, i) * calculatePoisson(awayGoals, j);

      if (totalGoals > line) {
        overProb += prob;
      } else {
        underProb += prob;
      }
    }
  }

  return {
    over: overProb,
    under: underProb,
  };
}

/**
 * Calculate both teams to score (BTTS) probability
 * 
 * @param {number} homeGoals - Expected home team goals
 * @param {number} awayGoals - Expected away team goals
 * @param {number} maxGoals - Maximum goals to calculate (default: 10)
 * @returns {Object} - Probabilities for yes and no
 */
export function calculateBTTS(homeGoals, awayGoals, maxGoals = 10) {
  let bttsYes = 0;
  let bttsNo = 0;

  for (let i = 0; i <= maxGoals; i++) {
    for (let j = 0; j <= maxGoals; j++) {
      const prob = calculatePoisson(homeGoals, i) * calculatePoisson(awayGoals, j);

      if (i > 0 && j > 0) {
        bttsYes += prob;
      } else {
        bttsNo += prob;
      }
    }
  }

  return {
    yes: bttsYes,
    no: bttsNo,
  };
}

/**
 * Calculate correct score probabilities
 * 
 * @param {number} homeGoals - Expected home team goals
 * @param {number} awayGoals - Expected away team goals
 * @param {number} maxGoals - Maximum goals to show (default: 5)
 * @returns {Array} - Array of score probabilities sorted by likelihood
 */
export function calculateCorrectScore(homeGoals, awayGoals, maxGoals = 5) {
  const scores = [];

  for (let i = 0; i <= maxGoals; i++) {
    for (let j = 0; j <= maxGoals; j++) {
      const probability = calculatePoisson(homeGoals, i) * calculatePoisson(awayGoals, j);
      
      scores.push({
        homeScore: i,
        awayScore: j,
        probability: probability,
        percentage: (probability * 100).toFixed(2),
      });
    }
  }

  return scores.sort((a, b) => b.probability - a.probability);
}

export default {
  calculatePoisson,
  calculateMatchOutcome,
  calculateExpectedValue,
  calculateImpliedProbability,
  findValueBets,
  calculateKellyCriterion,
  calculateOverUnder,
  calculateBTTS,
  calculateCorrectScore,
};
