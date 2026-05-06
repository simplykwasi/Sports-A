import { query } from '../db/client.js';

export async function getDashboard(req, res, next) {
  try {
    const [leagues, upcoming, valueBets] = await Promise.all([
      query('select league_id, name, country, season, tier from leagues order by name limit 20'),
      query('select fixture_id, kickoff_time, status, home_score, away_score, home_xg, away_xg from fixtures where kickoff_time > now() order by kickoff_time asc limit 12'),
      query('select p.prediction_id, f.external_fixture_id, f.kickoff_time, p.predicted_home_prob, p.predicted_draw_prob, p.predicted_away_prob, p.value_flag from predictions p join fixtures f on p.fixture_id = f.fixture_id where p.value_flag = true order by p.created_at desc limit 10'),
    ]);

    res.json({ leagues: leagues.rows, upcoming: upcoming.rows, quickValueBets: valueBets.rows });
  } catch (error) {
    next(error);
  }
}

export async function getValueBets(req, res, next) {
  try {
    const result = await query(
      `select
         p.prediction_id,
         f.external_fixture_id,
         f.kickoff_time,
         t_home.name as home_team,
         t_away.name as away_team,
         p.predicted_home_prob,
         p.predicted_draw_prob,
         p.predicted_away_prob,
         p.bookie_home_prob,
         p.bookie_draw_prob,
         p.bookie_away_prob,
         p.value_flag,
         p.value_delta,
         p.explanation
       from predictions p
       join fixtures f on p.fixture_id = f.fixture_id
       left join teams t_home on f.home_team_id = t_home.team_id
       left join teams t_away on f.away_team_id = t_away.team_id
       where p.value_flag = true
       order by p.created_at desc
       limit 50`
    );

    res.json({ valueBets: result.rows });
  } catch (error) {
    next(error);
  }
}

export async function getPredictions(req, res, next) {
  try {
    const result = await query(
      `select p.prediction_id, f.external_fixture_id, f.kickoff_time, p.model_name, p.predicted_home_prob, p.predicted_draw_prob, p.predicted_away_prob, p.confidence_score, p.created_at
       from predictions p
       join fixtures f on p.fixture_id = f.fixture_id
       order by p.created_at desc
       limit 100`
    );

    res.json({ predictions: result.rows });
  } catch (error) {
    next(error);
  }
}

export async function getFixtureById(req, res, next) {
  try {
    const { fixtureId } = req.params;
    const result = await query(
      `select f.*, t_home.name as home_team, t_away.name as away_team
       from fixtures f
       left join teams t_home on f.home_team_id = t_home.team_id
       left join teams t_away on f.away_team_id = t_away.team_id
       where f.fixture_id = $1`,
      [fixtureId]
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: 'Fixture not found' });
    }

    res.json({ fixture: result.rows[0] });
  } catch (error) {
    next(error);
  }
}
