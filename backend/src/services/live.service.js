import dotenv from 'dotenv';
import { query } from '../db/client.js';

dotenv.config();

class LiveAnalyticsEngine {
  constructor(cache = null, valueService = null) {
    this.liveState = new Map();
    this.cache = cache;
    this.valueService = valueService;
    this.apiBase = process.env.SPORTS_API_BASE;
    this.apiKey = process.env.SPORTS_API_KEY;
  }

  async startRealtimePolling(intervalMs = 7000) {
    this.pollingTimer = setInterval(async () => {
      try {
        const fixtures = await this._fetchActiveFixtures();
        await Promise.all(fixtures.map((fixture) => this._refreshFixtureState(fixture)));
      } catch (error) {
        console.error('Live polling failed', error.message);
      }
    }, intervalMs);
  }

  async _fetchActiveFixtures() {
    if (!this.apiBase || !this.apiKey) {
      return [];
    }
    const response = await fetch(`${this.apiBase}/fixtures?live=all`, {
      headers: { 'x-apisports-key': this.apiKey },
    });
    const payload = await response.json();
    return payload.response || [];
  }

  async _refreshFixtureState(fixturePayload) {
    const fixtureId = fixturePayload.fixture.id;
    const event = this._normalizeLivePayload(fixturePayload);
    const existing = this.liveState.get(fixtureId) || this._emptyState(fixturePayload);
    const updated = { ...existing, ...event, updatedAt: new Date().toISOString() };
    updated.probabilities = this.computeLiveProbabilities(updated);
    this.liveState.set(fixtureId, updated);

    await query(
      `insert into live_events (fixture_id, event_time, event_type, home_possession, away_possession, home_shots_on_target, away_shots_on_target, home_red_cards, away_red_cards, raw_payload)
       values ((select fixture_id from fixtures where external_fixture_id = $1 limit 1), now(), $2, $3, $4, $5, $6, $7, $8, $9)`,
      [fixtureId, event.eventType, event.homePossession, event.awayPossession, event.homeShotsOnTarget, event.awayShotsOnTarget, event.homeRedCards, event.awayRedCards, JSON.stringify(fixturePayload)]
    );
  }

  _emptyState(fixturePayload) {
    return {
      fixtureId: fixturePayload.fixture.id,
      elapsed: fixturePayload.fixture.status.elapsed || 0,
      score: fixturePayload.goals,
      homePossession: fixturePayload.statistics?.find((s) => s.type === 'Ball Possession')?.value || 50,
      awayPossession: 100 - (fixturePayload.statistics?.find((s) => s.type === 'Ball Possession')?.value || 50),
      homeShotsOnTarget: fixturePayload.statistics?.find((s) => s.type === 'Shots on Goal')?.value || 0,
      awayShotsOnTarget: 0,
      homeRedCards: fixturePayload.teams.home.redcards || 0,
      awayRedCards: fixturePayload.teams.away.redcards || 0,
      preMatchProbabilities: {
        home: 0.34,
        draw: 0.30,
        away: 0.36,
      },
    };
  }

  _normalizeLivePayload(payload) {
    const possession = payload.statistics?.find((stat) => stat.type === 'Ball Possession')?.value || '50%';
    const shotsOnTarget = payload.statistics?.find((stat) => stat.type === 'Shots on Goal')?.value || 0;
    const homePossession = Number(String(possession).replace('%', '')) || 50;

    return {
      eventType: 'state-update',
      elapsed: payload.fixture.status.elapsed || 0,
      score: payload.goals,
      homePossession,
      awayPossession: 100 - homePossession,
      homeShotsOnTarget: shotsOnTarget.home || 0,
      awayShotsOnTarget: shotsOnTarget.away || 0,
      homeRedCards: payload.teams.home.redcards || 0,
      awayRedCards: payload.teams.away.redcards || 0,
    };
  }

  computeLiveProbabilities(state) {
    const momentum = (state.homeShotsOnTarget - state.awayShotsOnTarget) * 0.025;
    const possessionDelta = (state.homePossession - state.awayPossession) * 0.0025;
    const redCardImpact = (state.homeRedCards - state.awayRedCards) * 0.12;
    const elapsedRatio = Math.min(state.elapsed / 90, 1);

    const homeBase = state.preMatchProbabilities.home + momentum + possessionDelta - redCardImpact;
    const awayBase = state.preMatchProbabilities.away - momentum - possessionDelta + redCardImpact;
    const drawBase = state.preMatchProbabilities.draw + 0.03 * (1 - elapsedRatio);

    const normalized = this._renormalize([homeBase, drawBase, awayBase]);
    return { home: normalized[0], draw: normalized[1], away: normalized[2] };
  }

  _renormalize(values) {
    const positive = values.map((value) => Math.max(value, 0.01));
    const total = positive.reduce((sum, value) => sum + value, 0);
    return positive.map((value) => Number((value / total).toFixed(4)));
  }

  getCurrentState(fixtureId) {
    return this.liveState.get(fixtureId) || null;
  }
}

export default LiveAnalyticsEngine;
