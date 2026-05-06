/**
 * Sports Analytics Engine
 * Implements Poisson Distribution & Value Bet Logic
 */

const factorial = (n) => {
  if (n === 0 || n === 1) return 1;
  let res = 1;
  for (let i = 2; i <= n; i++) res *= i;
  return res;
};

const poissonProbability = (k, lambda) => {
  return (Math.exp(-lambda) * Math.pow(lambda, k)) / factorial(k);
};

/**
 * Calculates match outcome probabilities based on xG
 */
export const calculateMatchProbs = (homeXg, awayXg) => {
  const maxGoals = 10;
  let homeWin = 0;
  let draw = 0;
  let awayWin = 0;

  const homeDist = Array.from({ length: maxGoals + 1 }, (_, i) => poissonProbability(i, homeXg));
  const awayDist = Array.from({ length: maxGoals + 1 }, (_, i) => poissonProbability(i, awayXg));

  for (let i = 0; i <= maxGoals; i++) {
    for (let j = 0; j <= maxGoals; j++) {
      const prob = homeDist[i] * awayDist[j];
      if (i > j) homeWin += prob;
      else if (i === j) draw += prob;
      else awayWin += prob;
    }
  }

  const total = homeWin + draw + awayWin;
  return {
    home: homeWin / total,
    draw: draw / total,
    away: awayWin / total
  };
};

/**
 * Formula: Value = (Odds * Probability) - 1
 * @param {number} odds - Bookmaker decimal odds
 * @param {number} probability - Calculated probability (0-1)
 * @returns {object} { value: number, isValue: boolean }
 */
export const calculateValue = (odds, probability, threshold = 0.05) => {
  if (!odds || !probability) return { value: 0, isValue: false };
  
  const value = (odds * probability) - 1;
  return {
    value: Number(value.toFixed(4)),
    isValue: value >= threshold
  };
};

export const getFairOdds = (probability) => {
  return probability > 0 ? Number((1 / probability).toFixed(2)) : 0;
};