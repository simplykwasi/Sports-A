import liveEngine from '../services/live.engine.js';

export async function getLiveAnalysis(req, res, next) {
  try {
    const { fixtureId } = req.params;
    const state = liveEngine.getCurrentState(fixtureId);
    if (!state) {
      return res.status(404).json({ message: 'No live data available for this fixture' });
    }
    res.json({ liveState: state });
  } catch (error) {
    next(error);
  }
}
