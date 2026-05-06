import express from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { cacheResponse } from '../middleware/cache.middleware.js';
import { getLiveAnalysis } from '../controllers/live.controller.js';

const router = express.Router();

router.use(requireAuth);
router.get('/:fixtureId', cacheResponse(5), getLiveAnalysis);

export default router;
