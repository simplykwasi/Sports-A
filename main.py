import datetime
import os
from typing import List, Optional

import requests
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

TOP_LEAGUES = {
    'Premier League',
    'La Liga',
    'Bundesliga',
    'Ghana Premier League',
}

app = FastAPI(title='Sports Predictor Brain')
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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
    league: Optional[str] = None
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
    API_KEY = os.getenv('VITE_SPORTS_API_KEY')
    if not API_KEY:
        return [
            MatchInput(
                id='demo-1',
                homeTeam='Chelsea',
                awayTeam='Manchester United',
                league='Premier League',
                time='18:30',
                odds=1.92,
                statusShort='FT',
                homeScore=2,
                awayScore=1,
            ),
            MatchInput(
                id='demo-2',
                homeTeam='Real Madrid',
                awayTeam='Barcelona',
                league='La Liga',
                time='20:00',
                odds=2.15,
                statusShort='FT',
                homeScore=1,
                awayScore=1,
            ),
            MatchInput(
                id='demo-3',
                homeTeam='Bayern Munich',
                awayTeam='Borussia Dortmund',
                league='Bundesliga',
                time='17:45',
                odds=1.70,
                statusShort='FT',
                homeScore=3,
                awayScore=2,
            ),
            MatchInput(
                id='demo-4',
                homeTeam='Accra Hearts',
                awayTeam='Asante Kotoko',
                league='Ghana Premier League',
                time='16:00',
                odds=2.05,
                statusShort='FT',
                homeScore=0,
                awayScore=1,
            ),
        ]

    yesterday = (datetime.date.today() - datetime.timedelta(days=1)).isoformat()
    url = f'https://v3.football.api-sports.io/fixtures?date={yesterday}'
    headers = {
        'x-rapidapi-key': API_KEY,
        'x-rapidapi-host': 'v3.football.api-sports.io',
        'Accept': 'application/json',
    }
    response = requests.get(url, headers=headers, timeout=10)
    if response.status_code != 200:
        raise HTTPException(status_code=502, detail='Failed to fetch yesterday fixtures')

    data = response.json().get('response', [])
    fixtures = []
    for item in data:
        league = item.get('league', {}).get('name')
        status_short = item.get('fixture', {}).get('status', {}).get('short')
        if league not in TOP_LEAGUES or status_short != 'FT':
            continue
        fixture = item.get('fixture', {})
        teams = item.get('teams', {})
        goals = item.get('goals', {})

        fixtures.append(
            MatchInput(
                id=str(fixture.get('id', f"{league}-{teams.get('home', {}).get('name')}-{teams.get('away', {}).get('name')}-{fixture.get('timestamp')}") ),
                homeTeam=teams.get('home', {}).get('name', 'Home'),
                awayTeam=teams.get('away', {}).get('name', 'Away'),
                league=league,
                time=fixture.get('date', '')[:16],
                odds=safe_float(item.get('odds', {}).get('home'), 1.85),
                statusShort=status_short,
                homeScore=goals.get('home', 0),
                awayScore=goals.get('away', 0),
            )
        )
    return fixtures


def fetch_fixtures_by_date(date_str: str) -> List[MatchInput]:
    API_KEY = os.getenv('VITE_SPORTS_API_KEY')
    if not API_KEY:
        return [
            MatchInput(
                id='demo-today-1',
                homeTeam='Chelsea',
                awayTeam='Arsenal',
                league='Premier League',
                time=date_str + ' 18:30',
                odds=1.92,
                statusShort='NS',
            ),
            MatchInput(
                id='demo-today-2',
                homeTeam='Real Madrid',
                awayTeam='Atletico Madrid',
                league='La Liga',
                time=date_str + ' 20:00',
                odds=2.15,
                statusShort='NS',
            ),
        ]

    url = f'https://v3.football.api-sports.io/fixtures?date={date_str}&next=20'
    headers = {
        'x-rapidapi-key': API_KEY,
        'x-rapidapi-host': 'v3.football.api-sports.io',
        'Accept': 'application/json',
    }
    response = requests.get(url, headers=headers, timeout=10)
    if response.status_code != 200:
        raise HTTPException(status_code=502, detail='Failed to fetch fixtures for date')

    data = response.json().get('response', [])
    fixtures = []
    for item in data:
        league = item.get('league', {}).get('name')
        if league not in TOP_LEAGUES:
            continue

        fixture = item.get('fixture', {})
        teams = item.get('teams', {})
        goals = item.get('goals', {})
        status_short = fixture.get('status', {}).get('short')

        fixtures.append(
            MatchInput(
                id=str(fixture.get('id', f"{league}-{teams.get('home', {}).get('name')}-{teams.get('away', {}).get('name')}-{fixture.get('timestamp')}")),
                homeTeam=teams.get('home', {}).get('name', 'Home'),
                awayTeam=teams.get('away', {}).get('name', 'Away'),
                league=league,
                time=fixture.get('date', '')[:16],
                odds=safe_float(item.get('odds', {}).get('home'), 1.85),
                statusShort=status_short,
                homeScore=goals.get('home', 0),
                awayScore=goals.get('away', 0),
            )
        )
    return fixtures


def format_prediction_payload(match: MatchInput, prediction: PredictionOutput) -> dict:
    return {
        "id": match.id,
        "homeTeam": match.homeTeam,
        "awayTeam": match.awayTeam,
        "prediction": prediction.recommendedBet,
        "confidence": prediction.confidence,
        "status": match.statusShort or 'NS',
        "score": f"{match.homeScore or 0}-{match.awayScore or 0}",
    }


@app.get('/')
def root():
    return {"message": "Server is running"}


@app.get('/predictions', response_model=dict)
def predictions():
    today = datetime.date.today().isoformat()
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

    