import CacheService from '../services/cache.service.js';

const cache = new CacheService(process.env.REDIS_URL);

export function cacheResponse(ttlSeconds) {
  return async (req, res, next) => {
    const key = `cache:${req.method}:${req.originalUrl}`;
    try {
      const cached = await cache.get(key);
      if (cached) {
        return res.json(JSON.parse(cached));
      }

      const originalJson = res.json.bind(res);
      res.json = async (body) => {
        await cache.set(key, JSON.stringify(body), ttlSeconds);
        originalJson(body);
      };

      next();
    } catch (error) {
      next(error);
    }
  };
}
