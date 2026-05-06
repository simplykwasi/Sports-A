import { poissonP } from '../utils/poisson.js';

class ValueService {
  computeMatchProbabilities(homeLambda, awayLambda) {
    const maxGoals = 7;
    const homeDistribution = Array.from({ length: maxGoals + 1 }, (_, k) => poissonP(k, homeLambda));
    const awayDistribution = Array.from({ length: maxGoals + 1 }, (_, k) => poissonP(k, awayLambda));

    let homeProb = 0;
    let drawProb = 0;
    let awayProb = 0;

    for (let i = 0; i <= maxGoals; i += 1) {
      for (let j = 0; j <= maxGoals; j += 1) {
        const probability = homeDistribution[i] * awayDistribution[j];
        if (i > j) homeProb += probability;
        else if (i === j) drawProb += probability;
        else awayProb += probability;
      }
    }

    const total = homeProb + drawProb + awayProb;
    return {
      home: Number((homeProb / total).toFixed(5)),
      draw: Number((drawProb / total).toFixed(5)),
      away: Number((awayProb / total).toFixed(5)),
    };
  }

  impliedOdds(prob) {
    return prob > 0 ? Number((1 / prob).toFixed(3)) : null;
  }

  computeFairOdds(homeXg, awayXg, homeStrength = 1, awayStrength = 1) {
    const homeLambda = homeXg * homeStrength;
    const awayLambda = awayXg * awayStrength;
    const probabilities = this.computeMatchProbabilities(homeLambda, awayLambda);

    return {
      probabilities,
      odds: {
        home: this.impliedOdds(probabilities.home),
        draw: this.impliedOdds(probabilities.draw),
        away: this.impliedOdds(probabilities.away),
      },
    };
  }

  detectValueBet(prediction, marketData) {
    const implied = {
      home: marketData.implied_home || (marketData.home_odds ? 1 / marketData.home_odds : null),
      draw: marketData.implied_draw || (marketData.draw_odds ? 1 / marketData.draw_odds : null),
      away: marketData.implied_away || (marketData.away_odds ? 1 / marketData.away_odds : null),
    };

    const odds = {
      home: marketData.home_odds || (implied.home ? 1 / implied.home : null),
      draw: marketData.draw_odds || (implied.draw ? 1 / implied.draw : null),
      away: marketData.away_odds || (implied.away ? 1 / implied.away : null),
    };

    // Value = (Odds * Probability) - 1
    const calculations = {
      home: odds.home ? (odds.home * prediction.predicted_home_prob) - 1 : 0,
      draw: odds.draw ? (odds.draw * prediction.predicted_draw_prob) - 1 : 0,
      away: odds.away ? (odds.away * prediction.predicted_away_prob) - 1 : 0,
    };

    const bestMarket = Object.entries(calculations).reduce((best, [key, value]) => {
      if (value > best.value) {
        return { market: key, value };
      }
      return best;
    }, { market: null, value: -1 });

    // A "Value Bet" is typically considered anything where Value > 0.05 (5% edge)
    const valueFlag = bestMarket.value >= 0.05;

    return {
      valueFlag,
      valueDelta: Number(bestMarket.value.toFixed(5)),
      bestMarket: bestMarket.market,
      fairOdds: this.computeFairOdds(prediction.home_xg || 1.15, prediction.away_xg || 0.95, prediction.home_strength || 1, prediction.away_strength || 1),
      implied,
    };
  }
}

export default ValueService;
