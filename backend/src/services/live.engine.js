import dotenv from 'dotenv';
import CacheService from './cache.service.js';
import ValueService from './value.service.js';
import LiveAnalyticsEngine from './live.service.js';

dotenv.config();

const cache = new CacheService(process.env.REDIS_URL);
const valueService = new ValueService();
const liveEngine = new LiveAnalyticsEngine(cache, valueService);

export default liveEngine;
