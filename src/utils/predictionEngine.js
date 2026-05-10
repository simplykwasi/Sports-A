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
    // Logic: High-scoring teams, attacking formations, etc.
    return Math.random() > 0.6; // Mock logic
  }

  static shouldPredictUnder(match) {
    // Logic: Defensive teams, bad weather, etc.
    return Math.random() > 0.7; // Mock logic
  }

  static shouldPredictHomeWin(match) {
    return Math.random() > 0.5; // Mock logic
  }

  static shouldPredictAwayWin(match) {
    return Math.random() > 0.6; // Mock logic
  }

  static shouldPredictBTTS(match) {
    return Math.random() > 0.4; // Mock logic
  }

  static calculateOverConfidence(match) {
    return Math.floor(Math.random() * 30) + 70; // 70-99%
  }

  static calculateUnderConfidence(match) {
    return Math.floor(Math.random() * 25) + 65; // 65-89%
  }

  static calculateHomeWinConfidence(match) {
    return Math.floor(Math.random() * 35) + 60; // 60-94%
  }

  static calculateAwayWinConfidence(match) {
    return Math.floor(Math.random() * 30) + 55; // 55-84%
  }

  static calculateBTTSConfidence(match) {
    return Math.floor(Math.random() * 40) + 60; // 60-99%
  }

  static getOverReasoning(match) {
    return [
      "Both teams have strong attacking records this season",
      "Recent matches averaged 3.2 goals per game",
      "Goalkeeper form suggests high-scoring encounters"
    ];
  }

  static getUnderReasoning(match) {
    return [
      "Both teams employ defensive strategies",
      "Recent matches ended with low scores",
      "Weather conditions may limit attacking play"
    ];
  }

  static getHomeWinReasoning(match) {
    return [
      "Home team unbeaten in recent home matches",
      "Away team struggling with injuries",
      "Strong home advantage in this fixture"
    ];
  }

  static getAwayWinReasoning(match) {
    return [
      "Away team in excellent form recently",
      "Home team dealing with defensive issues",
      "Away team has good record against this opponent"
    ];
  }

  static getBTTSReasoning(match) {
    return [
      "Both teams have attacking players in form",
      "Recent head-to-head matches saw goals from both sides",
      "Defensive records suggest both will score"
    ];
  }

  static isValueBet(prediction, odds) {
    // Simple value bet detection: high confidence + reasonable odds
    return prediction.confidence > 75 && odds > 1.5 && odds < 3.0;
  }
}
