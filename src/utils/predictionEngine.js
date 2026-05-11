const BACKEND_BASE_URL = window.location.hostname === 'localhost' ? 'http://127.0.0.1:8000' : (import.meta.env.VITE_PYTHON_BACKEND_URL || 'https://your-deployed-python-url.com');

function normalizeMatchInput(match) {
  return {
    id: String(match.id),
    homeTeam: match.homeTeam ?? 'Home',
    awayTeam: match.awayTeam ?? 'Away',
    league: match.league ?? 'Unknown League',
    time: match.time ?? '',
    odds: typeof match.odds === 'number' ? match.odds : Number(match.odds) || 1.85,
    statusShort: match.statusShort ?? 'NS',
    homeScore: typeof match.homeScore === 'number' ? match.homeScore : Number(match.homeScore) || 0,
    awayScore: typeof match.awayScore === 'number' ? match.awayScore : Number(match.awayScore) || 0,
  };
}

export class PredictionEngine {
  static async fetchPredictions(matches) {
    const payload = { matches: matches.map(normalizeMatchInput) };
    const response = await fetch(`${BACKEND_BASE_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Prediction service failed (${response.status}): ${body}`);
    }

    const json = await response.json();
    if (!Array.isArray(json.predictions)) {
      throw new Error('Prediction service returned invalid data.');
    }

    return json.predictions;
  }

  static async fetchAccuracy() {
    const response = await fetch(`${BACKEND_BASE_URL}/accuracy`);
    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Accuracy service failed (${response.status}): ${body}`);
    }

    const json = await response.json();
    return json;
  }

  static isValueBet(prediction, odds) {
    return prediction?.confidence > 75 && odds > 1.5 && odds < 3.0;
  }
}
