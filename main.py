import os
from datetime import datetime, timedelta
from typing import List, Optional

import pytz
import requests
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

API_KEY = os.getenv('API_FOOTBALL_API_KEY', '3041353cf06b3eb32032dc0a68762f98')
BASE_URL = 'https://v3.football.api-sports.io'
TIMEZONE = 'Africa/Accra'

app = FastAPI(title='Sports Predictor Brain')
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def api_get(url: str) -> dict:
    headers = {
        'x-apisports-key': API_KEY,
        'x-rapidapi-key': API_KEY,
        'x-rapidapi-host': 'v3.football.api-sports.io',
        'Accept': 'application/json',
    }
    print(f"Requesting API-Football: {url}")
    response = requests.get(url, headers=headers, timeout=10)
    print(f"API Response Status: {response.status_code}")

    if response.status_code != 200:
        error_msg = 'API-Football error'
        try:
            error_data = response.json()
            error_msg = error_data.get('message', error_msg)
        except Exception:
            error_msg = response.text or error_msg

        if response.status_code in {401, 403}:
            print(f"Auth failure ({response.status_code}): {error_msg}")
            raise HTTPException(status_code=response.status_code, detail=error_msg)

        raise HTTPException(status_code=502, detail=error_msg)

    return response.json()


def current_accra_date() -> str:
    tz = pytz.timezone(TIMEZONE)
    return datetime.now(tz).date().isoformat()


def yesterday_accra_date() -> str:
    tz = pytz.timezone(TIMEZONE)
    return (datetime.now(tz).date() - timedelta(days=1)).isoformat()


def safe_int(value: Optional[int], fallback: int = 0) -> int:
    try:
        return int(value)
    except (TypeError, ValueError):
        return fallback


def normalize_probabilities(values: List[float]) -> List[float]:
    total = sum(values) or 1.0
    return [round((value / total) * 100, 1) for value in values]


def safe_float(value: Optional[float], fallback: float = 1.85) -> float:
    try:
        return float(value)
    except (TypeError, ValueError):
        return fallback


class MatchInput(BaseModel):
    id: str
    homeTeam: str
    awayTeam: str
    leagueName: Optional[str] = None
    leagueCountry: Optional[str] = None
    time: Optional[str] = None
    odds: Optional[float] = 1.85
    statusShort: Optional[str] = None
    homeScore: Optional[int] = 0
    awayScore: Optional[int] = 0


class PredictionOutput(BaseModel):
    id: str
    homeProbability: float
    drawProbability: float
    awayProbability: float
    recommendedBet: str
    confidence: int


class PredictRequest(BaseModel):
    matches: List[MatchInput]


class AccuracyRow(BaseModel):
    id: str
    homeTeam: str
    awayTeam: str
    league: Optional[str]
    finalScore: str
    preMatchPrediction: str
    livePrediction: str
    result: bool


class AccuracyResponse(BaseModel):
    hitRate: int
    hitCount: int
    totalMatches: int
    details: List[AccuracyRow]


def compute_probabilities(match: MatchInput) -> List[float]:
    home_odds = safe_float(match.odds, 1.85)
    home_bias = max(0.25, min(0.75, 1.0 / home_odds + 0.05))
    away_bias = max(0.15, min(0.55, 1.0 - home_bias - 0.18))
    draw_bias = max(0.12, min(0.30, 1.0 - home_bias - away_bias))

    if match.statusShort in {'1H', '2H', 'HT'}:
        home_bias += 0.03
        away_bias += 0.02
        draw_bias -= 0.05

    if (match.homeScore or 0) > (match.awayScore or 0):
        home_bias += 0.05
    elif (match.awayScore or 0) > (match.homeScore or 0):
        away_bias += 0.05

    return normalize_probabilities([home_bias, draw_bias, away_bias])


def choose_recommended_bet(home_prob: float, draw_prob: float, away_prob: float, match: MatchInput) -> str:
    scores = {
        'Home Win': home_prob,
        'Draw': draw_prob,
        'Away Win': away_prob,
    }
    choice = max(scores, key=scores.get)
    if scores[choice] < 52 and draw_prob >= 28:
        return 'Draw'
    if scores[choice] < 50:
        return 'Live Momentum Watch'
    if choice == 'Draw' and abs(home_prob - away_prob) < 8:
        return 'Value on Draw'
    return choice


def compute_confidence(home_prob: float, draw_prob: float, away_prob: float) -> int:
    best = max(home_prob, draw_prob, away_prob)
    confidence = int(min(98, best + (best * 0.15)))
    return max(45, confidence)


def generate_prediction(match: MatchInput) -> PredictionOutput:
    home_prob, draw_prob, away_prob = compute_probabilities(match)
    recommended_bet = choose_recommended_bet(home_prob, draw_prob, away_prob, match)
    confidence = compute_confidence(home_prob, draw_prob, away_prob)

    return PredictionOutput(
        id=match.id,
        homeProbability=home_prob,
        drawProbability=draw_prob,
        awayProbability=away_prob,
        recommendedBet=recommended_bet,
        confidence=confidence,
    )


def simulate_live_prediction(match: MatchInput) -> str:
    home_score = match.homeScore or 0
    away_score = match.awayScore or 0
    total_goals = home_score + away_score

    if home_score > away_score:
        return 'Home Win'
    if away_score > home_score:
        return 'Away Win'
    if total_goals >= 3:
        return 'Over 2.5 Goals'
    return 'Draw'


def is_hit(recommended_bet: str, match: MatchInput) -> bool:
    home_score = match.homeScore or 0
    away_score = match.awayScore or 0
    total_goals = home_score + away_score
    if recommended_bet == 'Home Win':
        return home_score > away_score
    if recommended_bet == 'Away Win':
        return away_score > home_score
    if recommended_bet == 'Draw':
        return home_score == away_score
    if recommended_bet == 'Over 2.5 Goals':
        return total_goals > 2.5
    if recommended_bet == 'Under 2.5 Goals':
        return total_goals < 2.5
    return False


def fetch_yesterday_fixtures() -> List[MatchInput]:
    if not API_KEY:
        raise HTTPException(status_code=500, detail='API key is missing')

    yesterday = yesterday_accra_date()
    url = f'{BASE_URL}/fixtures?date={yesterday}&timezone={TIMEZONE}'
    payload = api_get(url)
    fixtures = []

    for item in payload.get('response', []):
        fixture = item.get('fixture', {})
        status_short = fixture.get('status', {}).get('short')
        if status_short != 'FT':
            continue

        league = item.get('league', {})
        league_name = league.get('name', '')
        league_country = league.get('country', '')
        teams = item.get('teams', {})
        goals = item.get('goals', {})

        fixtures.append(
            MatchInput(
                id=str(fixture.get('id', f"{league_name}-{teams.get('home', {}).get('name')}-{teams.get('away', {}).get('name')}-{fixture.get('timestamp')}")),
                homeTeam=teams.get('home', {}).get('name', 'Home'),
                awayTeam=teams.get('away', {}).get('name', 'Away'),
                leagueName=league_name,
                leagueCountry=league_country,
                time=fixture.get('date', '')[:16],
                statusShort=status_short,
                homeScore=safe_int(goals.get('home')),
                awayScore=safe_int(goals.get('away')),
            )
        )

    return fixtures


def fetch_fixtures_by_date(date_str: str) -> List[MatchInput]:
    if not API_KEY:
        raise HTTPException(status_code=500, detail='API key is missing')

    url = f'{BASE_URL}/fixtures?date={date_str}&timezone={TIMEZONE}'
    payload = api_get(url)
    fixtures = []

    for item in payload.get('response', []):
        fixture = item.get('fixture', {})
        league = item.get('league', {})
        league_name = league.get('name', '')
        league_country = league.get('country', '')
        teams = item.get('teams', {})
        goals = item.get('goals', {})
        status_short = fixture.get('status', {}).get('short')

        fixtures.append(
            MatchInput(
                id=str(fixture.get('id', f"{league_name}-{teams.get('home', {}).get('name')}-{teams.get('away', {}).get('name')}-{fixture.get('timestamp')}")),
                homeTeam=teams.get('home', {}).get('name', 'Home'),
                awayTeam=teams.get('away', {}).get('name', 'Away'),
                leagueName=league_name,
                leagueCountry=league_country,
                time=fixture.get('date', '')[:16],
                statusShort=status_short,
                homeScore=safe_int(goals.get('home')),
                awayScore=safe_int(goals.get('away')),
            )
        )

    print(f"Found {len(fixtures)} matches for {date_str} using Key {API_KEY[:4]}...")
    return fixtures


def map_status_label(status_short: Optional[str]) -> str:
    if status_short == 'NS':
        return 'Upcoming'
    if status_short in {'1H', '2H', 'HT', 'ET', 'P'}:
        return 'LIVE'
    if status_short == 'FT':
        return 'Finished'
    return status_short or 'Upcoming'


def format_prediction_payload(match: MatchInput, prediction: PredictionOutput) -> dict:
    return {
        'id': match.id,
        'homeTeam': match.homeTeam,
        'awayTeam': match.awayTeam,
        'leagueName': match.leagueName,
        'leagueCountry': match.leagueCountry,
        'status': map_status_label(match.statusShort),
        'time': match.time,
        'score': f"{match.homeScore or 0}-{match.awayScore or 0}",
        'prediction': prediction.recommendedBet,
        'confidence': prediction.confidence,
    }


@app.get('/')
def root():
    return {"message": "Server is running"}


@app.get('/predictions', response_model=dict)
def predictions():
    today = current_accra_date()
    matches = fetch_fixtures_by_date(today)
    prediction_list = [format_prediction_payload(match, generate_prediction(match)) for match in matches]
    return {"status": "success", "data": prediction_list}


@app.post('/predict', response_model=dict)
def predict(request: PredictRequest):
    predictions = [generate_prediction(match) for match in request.matches]
    return {"success": True, "data": predictions}


@app.get('/accuracy', response_model=dict)
def accuracy():
    matches = fetch_yesterday_fixtures()
    if not matches:
        return {"status": "success", "data": [], "details": [], "hitRate": 0, "hitCount": 0, "totalMatches": 0}

    results = []
    details = []
    hits = 0
    for match in matches:
        prediction = generate_prediction(match)
        live_prediction = simulate_live_prediction(match)
        success = is_hit(prediction.recommendedBet, match)
        if success:
            hits += 1

        results.append(format_prediction_payload(match, prediction))
        details.append(
            AccuracyRow(
                id=match.id,
                homeTeam=match.homeTeam,
                awayTeam=match.awayTeam,
                league=match.league,
                finalScore=f'{match.homeScore} - {match.awayScore}',
                preMatchPrediction=prediction.recommendedBet,
                livePrediction=live_prediction,
                result=success,
            )
        )

    hit_rate = int(round((hits / len(results)) * 100)) if results else 0
    return {
        "status": "success",
        "data": results,
        "details": [row.dict() for row in details],
        "hitRate": hit_rate,
        "hitCount": hits,
        "totalMatches": len(results),
    }


if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(app, host="127.0.0.1", port=8000)

    