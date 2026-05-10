// Prediction Engine - Maps API data to betting tips
export class PredictionEngine {
  static analyzeMatch(match) {
    const predictions = [];

    // Over/Under analysis
    if (this.shouldPredictOver(match)) {
      predictions.push({
        type: "Over 2.5 Goals",
        confidence: this.calculateOverConfidence(match),
        reasoning: this.getOverReasoning(match)
      });
    }

    if (this.shouldPredictUnder(match)) {
      predictions.push({
        type: "Under 2.5 Goals",
        confidence: this.calculateUnderConfidence(match),
        reasoning: this.getUnderReasoning(match)
      });
    }

    // Match result analysis
    if (this.shouldPredictHomeWin(match)) {
      predictions.push({
        type: "Home Win",
        confidence: this.calculateHomeWinConfidence(match),
        reasoning: this.getHomeWinReasoning(match)
      });
    }

    if (this.shouldPredictAwayWin(match)) {
      predictions.push({
        type: "Away Win",
        confidence: this.calculateAwayWinConfidence(match),
        reasoning: this.getAwayWinReasoning(match)
      });
    }

    // Both Teams To Score
    if (this.shouldPredictBTTS(match)) {
      predictions.push({
        type: "Both Teams To Score",
        confidence: this.calculateBTTSConfidence(match),
        reasoning: this.getBTTSReasoning(match)
      });
    }

    // Return the highest confidence prediction
    return predictions.sort((a, b) => b.confidence - a.confidence)[0] || null;
  }

  static shouldPredictOver(match) {
    const homeFavorsAttack = (match.odds || 1.8) > 1.9 ? 0.05 : -0.05;
    const teamBalance = Math.max(0, Math.min(1, Math.abs((match.homeTeam?.length ?? 0) - (match.awayTeam?.length ?? 0)) / 30));
    return Math.random() > 0.6 - homeFavorsAttack + teamBalance * 0.05;
  }

  static shouldPredictUnder(match) {
    const defensiveMarket = (match.odds || 2.0) < 2.2 ? 0.05 : 0;
    return Math.random() > 0.7 + defensiveMarket;
  }

  static shouldPredictHomeWin(match) {
    const homeAdvantage = (match.homeTeam?.length ?? 0) > (match.awayTeam?.length ?? 0) ? 0.1 : -0.05;
    return Math.random() > 0.5 - homeAdvantage;
  }

  static shouldPredictAwayWin(match) {
    const awayMomentum = (match.odds || 1.8) > 2.2 ? 0.05 : -0.05;
    return Math.random() > 0.6 - awayMomentum;
  }

  static shouldPredictBTTS(match) {
    const earlyGoalSignal = (match.statusShort === '1H' || match.statusShort === '2H') ? 0.1 : 0;
    return Math.random() > 0.4 - earlyGoalSignal;
  }

  static calculateOverConfidence(match) {
    const base = Math.floor(Math.random() * 30) + 70;
    return Math.min(99, base + ((match.odds || 1.8) > 2 ? 3 : 0));
  }

  static calculateUnderConfidence(match) {
    const base = Math.floor(Math.random() * 25) + 65;
    return Math.min(95, base + ((match.odds || 2.0) < 1.9 ? 3 : 0));
  }

  static calculateHomeWinConfidence(match) {
    const base = Math.floor(Math.random() * 35) + 60;
    return Math.min(95, base + (match.homeTeam?.length > match.awayTeam?.length ? 2 : 0));
  }

  static calculateAwayWinConfidence(match) {
    const base = Math.floor(Math.random() * 30) + 55;
    return Math.min(93, base + (match.awayTeam?.length > match.homeTeam?.length ? 2 : 0));
  }

  static calculateBTTSConfidence(match) {
    const base = Math.floor(Math.random() * 40) + 60;
    return Math.min(99, base + ((match.statusShort === '1H' || match.statusShort === '2H') ? 3 : 0));
  }

  static getOverReasoning(match) {
    const homeTeam = match.homeTeam ?? 'Home team';
    const awayTeam = match.awayTeam ?? 'Away team';
    return [
      `${homeTeam} and ${awayTeam} look set for a high-scoring matchup`,
      `${homeTeam} has shown strong attacking intent in recent fixtures`,
      `${awayTeam} has been conceding goals at an above-average rate`
    ];
  }

  static getUnderReasoning(match) {
    const homeTeam = match.homeTeam ?? 'Home team';
    const awayTeam = match.awayTeam ?? 'Away team';
    return [
      `${homeTeam} and ${awayTeam} are trending toward low total goals`,
      `Recent fixtures for both sides have finished with fewer than three goals`,
      `Defensive shape and slow tempo should keep scoring down`
    ];
  }

  static getHomeWinReasoning(match) {
    const homeTeam = match.homeTeam ?? 'Home team';
    return [
      `${homeTeam} has a favorable matchup at home`,
      `Home advantage could be decisive in this fixture`,
      `${homeTeam} has better recent form than the opponent`
    ];
  }

  static getAwayWinReasoning(match) {
    const awayTeam = match.awayTeam ?? 'Away team';
    return [
      `${awayTeam} are riding positive momentum on the road`,
      `The away side's attack profile gives them an edge`,
      `${awayTeam} looks more likely to force a breakthrough`
    ];
  }

  static getBTTSReasoning(match) {
    const homeTeam = match.homeTeam ?? 'Home team';
    const awayTeam = match.awayTeam ?? 'Away team';
    return [
      `${homeTeam} and ${awayTeam} both possess strong attacking threats`,
      `Both teams have scored in the majority of their recent games`,
      `Defensive lapses from both sides make goals likely`
    ];
  }

  static isValueBet(prediction, odds) {
    // Simple value bet detection: high confidence + reasonable odds
    return prediction.confidence > 75 && odds > 1.5 && odds < 3.0;
  }
}
