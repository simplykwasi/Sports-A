import express from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { cacheResponse } from '../middleware/cache.middleware.js';
import { getDashboard, getValueBets, getPredictions, getFixtureById } from '../controllers/analytics.controller.js';

const router = express.Router();

router.use(requireAuth);
router.get('/dashboard', cacheResponse(15), getDashboard);
router.get('/value-bets', cacheResponse(10), getValueBets);
router.get('/predictions', cacheResponse(20), getPredictions);
router.get('/fixtures/:fixtureId', cacheResponse(30), getFixtureById);

export default router;
